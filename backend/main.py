import os
import re
import sys
import json
import asyncio
import logging
import traceback
from datetime import date
from typing import Optional

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ValidationError
from google import genai
from google.genai import types
from google.genai.errors import ClientError
from dotenv import load_dotenv

# ─── Logging ──────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("eco-scan")

# ─── Config ───────────────────────────────────────────────────
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ── Startup Gate: hard-fail if key is missing ─────────────────
if not GEMINI_API_KEY:
    log.critical("CRITICAL: API KEY MISSING — set GEMINI_API_KEY in your .env file. Server will NOT start.")
    sys.exit(1)

client = genai.Client(api_key=GEMINI_API_KEY)
GEMINI_MODEL = "gemini-2.0-flash"
MODE = os.getenv("MODE", "production").lower()
log.info("Gemini SDK configured successfully (google-genai). MODE=%s", MODE)

# ─── Mock Data (used when MODE=development) ──────────────────
MOCK_SCAN_RESULT = {
    "item_name": "Generic Apple",
    "category": "FRUITS",
    "estimated_expiry": "2026-04-15",
    "confidence_score": 0.92,
    "carbon_impact_factor": 0.4,
    "co2e_saved": 0.20,
    "is_expired": False,
    "freshness_grade": 8,
    "analysis_reasoning": "[MOCK] Development mode — no Gemini call made.",
}

app = FastAPI(title="Eco-Scan AI Bridge")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Pydantic Data Contracts
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class GeminiResponse(BaseModel):
    """Strict contract for the JSON Gemini must return."""
    item_name: str = Field(..., min_length=1)
    category: str = Field(..., pattern=r"^(VEGETABLES|FRUITS|DAIRY|GRAINS|MEAT|LEGUMES|BEVERAGES|SNACKS|OTHER)$")
    estimated_expiry: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    carbon_impact_factor: float = Field(..., ge=0.0)
    is_expired: Optional[bool] = None
    freshness_grade: int = Field(default=7, ge=1, le=10)
    analysis_reasoning: str = Field(default="No visual defects detected.")


class ScanResponse(BaseModel):
    """Final response returned to the frontend (adds co2e_saved)."""
    item_name: str
    category: str
    estimated_expiry: str
    confidence_score: float
    carbon_impact_factor: float
    co2e_saved: float
    is_expired: bool
    freshness_grade: int
    analysis_reasoning: str


class RecipeIngredient(BaseModel):
    name: str
    amount: str

class RecipeDetail(BaseModel):
    name: str
    time_to_cook_minutes: int
    difficulty: str
    ingredients: list[RecipeIngredient]

class RecipeResponse(BaseModel):
    item_name: str
    recipes: list[RecipeDetail]


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Helpers
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def _traceback_summary() -> str:
    """Return last 3 frames of the current traceback for error details."""
    return "".join(traceback.format_exc().splitlines(keepends=True)[-6:])


def clean_json(raw: str) -> str:
    """Strip markdown code fences and whitespace from Gemini output.

    Handles all common Gemini wrappers:
      ```json\n{...}\n```
      ```\n{...}\n```
      plain JSON
    """
    cleaned = raw.strip()
    # Remove opening fence (```json or ``` with optional lang tag)
    if cleaned.startswith("```"):
        first_newline = cleaned.find("\n")
        if first_newline != -1:
            cleaned = cleaned[first_newline + 1:]
        else:
            cleaned = cleaned[3:]
    # Remove closing fence
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return cleaned.strip()


SCAN_PROMPT = """You are a food safety AI for Eco-Scan. Perform TWO parallel checks on this image:

CHECK 1 — OCR Date Scan:
- Search the packaging for any text matching: "Best Before", "BB", "EXP", "Use By", or date formats (DD/MM/YYYY, MM/YYYY, YYYY-MM-DD).
- If a date is found, extract it as the authoritative expiry date.

CHECK 2 — Visual Freshness Grade:
- Analyze the food itself (not packaging) for visual signs of decay:
  * Signs of spoilage: mold (fuzzy/white patches), bruising (dark spots), wilting (limpness), fermentation (bubbling/swelling), discoloration.
  * Grade the freshness 1-10 where: 10=perfect, 7-9=good, 4-6=use soon, 1-3=spoiled/dangerous.
- Write a short analysis_reasoning explaining what you see (e.g. "Mild browning on banana peel; 80% of fruit appears firm").

LOGIC:
- If OCR date found AND it is before 2026-03-28: is_expired = true
- If OCR date found AND it is on/after 2026-03-28: is_expired = false
- If NO date found: set is_expired based on visual grade (grade <= 2 means is_expired = true)
- estimated_expiry: use OCR date if found, else estimate from visual grade

Return ONLY a single valid JSON object with EXACTLY these keys:
{
  "item_name": "specific product name",
  "category": "one of: VEGETABLES, FRUITS, DAIRY, GRAINS, MEAT, LEGUMES, BEVERAGES, SNACKS, OTHER",
  "estimated_expiry": "YYYY-MM-DD",
  "confidence_score": 0.0-1.0,
  "carbon_impact_factor": kg_CO2e_per_kg_float,
  "is_expired": true_or_false,
  "freshness_grade": 1_to_10_integer,
  "analysis_reasoning": "short sentence explaining visual or OCR findings"
}

Example:
{"item_name": "Banana", "category": "FRUITS", "estimated_expiry": "2026-04-02", "confidence_score": 0.92, "carbon_impact_factor": 0.7, "is_expired": false, "freshness_grade": 6, "analysis_reasoning": "Moderate brown spotting on peel; fruit still firm and safe to eat."}"""


def _parse_and_validate(raw_text: str) -> GeminiResponse:
    """Clean, parse, and validate raw Gemini text through the Pydantic model."""
    cleaned = clean_json(raw_text)
    data = json.loads(cleaned)  # may raise json.JSONDecodeError
    return GeminiResponse(**data)  # may raise ValidationError


def _parse_retry_delay(error_message: str) -> float:
    """Extract retry delay in seconds from a 429 error message. Defaults to 60."""
    match = re.search(r"retry in ([\d.]+)s", str(error_message), re.IGNORECASE)
    return float(match.group(1)) if match else 60.0


def _call_gemini_vision(prompt: str, image_bytes: bytes, mime_type: str) -> str:
    """Call Gemini with an image and return raw text. Raises HTTPException 503 on failure."""
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                prompt,
            ],
        )
        return response.text
    except ClientError as e:
        if e.code == 429:
            retry_after = _parse_retry_delay(str(e))
            log.warning("Gemini 429 — rate limited. Retry after %.1fs", retry_after)
            raise HTTPException(
                status_code=429,
                detail={"message": "Rate limited by Gemini", "retry_after": retry_after},
            )
        log.error("Gemini ClientError (non-429):\n%s", traceback.format_exc())
        raise HTTPException(
            status_code=503,
            detail=f"Gemini API unavailable: {_traceback_summary()}",
        )
    except Exception:
        log.error("Gemini API call failed:\n%s", traceback.format_exc())
        raise HTTPException(
            status_code=503,
            detail=f"Gemini API unavailable: {_traceback_summary()}",
        )


def _call_gemini_text(prompt: str) -> str:
    """Call Gemini with a text-only prompt. Raises HTTPException 503 on failure."""
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )
        return response.text
    except ClientError as e:
        if e.code == 429:
            retry_after = _parse_retry_delay(str(e))
            log.warning("Gemini 429 — rate limited (text). Retry after %.1fs", retry_after)
            raise HTTPException(
                status_code=429,
                detail={"message": "Rate limited by Gemini", "retry_after": retry_after},
            )
        log.error("Gemini ClientError (non-429, text):\n%s", traceback.format_exc())
        raise HTTPException(
            status_code=503,
            detail=f"Gemini API unavailable: {_traceback_summary()}",
        )
    except Exception:
        log.error("Gemini text call failed:\n%s", traceback.format_exc())
        raise HTTPException(
            status_code=503,
            detail=f"Gemini API unavailable: {_traceback_summary()}",
        )


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Routes
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.get("/")
async def root():
    return {"message": "Eco-Scan AI Bridge is running"}


@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Backend is reachable"}


@app.post("/scan", response_model=ScanResponse)
async def scan_food_item(file: UploadFile = File(...)):
    # 0. Mock short-circuit for development mode
    if MODE == "development":
        log.warning("[MOCK] Returning mock scan result — MODE=development")
        await asyncio.sleep(1)
        return MOCK_SCAN_RESULT

    # 1. Read raw image bytes (no base64 needed with new SDK)
    image_bytes = await file.read()
    mime_type = file.content_type or "image/jpeg"
    log.info("Scan request — file=%s  size=%d bytes  mime=%s", file.filename, len(image_bytes), mime_type)

    # 2. First Gemini call
    raw_text = _call_gemini_vision(SCAN_PROMPT, image_bytes, mime_type)
    log.info("Gemini raw (first 200): %s", raw_text[:200])

    # 3. Parse + validate (with one repair attempt)
    try:
        validated = _parse_and_validate(raw_text)
    except (json.JSONDecodeError, ValidationError) as first_err:
        log.warning("First parse failed (%s). Attempting repair prompt…", first_err)

        # ── Repair Loop ──────────────────────────────────
        repair_prompt = (
            "You returned invalid JSON. Here is your raw output:\n\n"
            f"```\n{raw_text}\n```\n\n"
            "Please return ONLY the corrected, valid JSON object matching this schema: "
            "item_name (str), category (VEGETABLES|FRUITS|DAIRY|GRAINS|MEAT|LEGUMES|BEVERAGES|SNACKS|OTHER), "
            "estimated_expiry (YYYY-MM-DD), confidence_score (0-1 float), carbon_impact_factor (float >=0), "
            "is_expired (bool), freshness_grade (1-10 int), analysis_reasoning (str). "
            "Return ONLY the JSON, no markdown, no explanation."
        )
        repaired_text = _call_gemini_vision(repair_prompt, image_bytes, mime_type)
        log.info("Gemini repair raw (first 200): %s", repaired_text[:200])

        try:
            validated = _parse_and_validate(repaired_text)
            log.info("Repair succeeded.")
        except (json.JSONDecodeError, ValidationError) as repair_err:
            log.error("Repair also failed: %s", repair_err)
            raise HTTPException(
                status_code=422,
                detail=(
                    f"Gemini returned unparseable data even after repair. "
                    f"Original error: {first_err} | Repair error: {repair_err} | "
                    f"Raw output (first 300 chars): {raw_text[:300]}"
                ),
            )

    # 4. Derive is_expired if Gemini omitted it
    result = validated.model_dump()
    if result["is_expired"] is None:
        today = date(2026, 3, 28)
        try:
            expiry_date = date.fromisoformat(result["estimated_expiry"])
            result["is_expired"] = expiry_date < today
        except ValueError:
            result["is_expired"] = False

    # 5. Calculate CO2e saved (0.5 kg default weight)
    result["co2e_saved"] = round(result["carbon_impact_factor"] * 0.5, 2)

    log.info("Scan complete — item=%s  category=%s  expired=%s", result["item_name"], result["category"], result["is_expired"])
    return result


@app.post("/recipes", response_model=RecipeResponse)
async def generate_recipes(item_name: str):
    try:
        prompt = f"""
        You are the Eco-Scan Zero-Waste Chef. 
        For the food item '{item_name}', suggest 2 creative, zero-waste, and local Zimbabwean-themed recipes.
        Focus on using the item fully (including peels or stalks if applicable) and common local ingredients.
        
        Return ONLY a JSON array of recipe objects. Exact schema for the array items:
        {{
            "name": "string",
            "time_to_cook_minutes": integer,
            "difficulty": "Beginner" | "Medium" | "Expert",
            "ingredients": [
                {{ "name": "string", "amount": "string" }}
            ]
        }}
        """
        raw = _call_gemini_text(prompt)
        recipes_list = json.loads(clean_json(raw))
        
        # If Gemini returned {"recipes": [...]}, extract the list
        if isinstance(recipes_list, dict) and "recipes" in recipes_list:
            recipes_list = recipes_list["recipes"]
            
        return {"item_name": item_name, "recipes": recipes_list}
    except Exception as e:
        log.warning("Recipe AI error: %s", e)
        # Fallback 
        return {
            "item_name": item_name,
            "recipes": [
                {
                    "name": f"{item_name} Relish with Peanut Butter",
                    "time_to_cook_minutes": 20,
                    "difficulty": "Beginner",
                    "ingredients": [
                        {"name": item_name, "amount": "1 portion"},
                        {"name": "Peanut Butter", "amount": "2 tbsp"},
                        {"name": "Onion", "amount": "1 small"}
                    ]
                }
            ],
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
