import os
import base64
import json
import traceback
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# Look for .env in the parent directory (root)
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Setup Gemini 2.0 Flash (2026 standard for Flash performance)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

app = FastAPI(title="Eco-Scan AI Bridge")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Eco-Scan AI Bridge is running"}

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Backend is reachable"}

class ScanResponse(BaseModel):
    item_name: str
    category: str
    estimated_expiry: str
    confidence_score: float
    carbon_impact_factor: float
    co2e_saved: float

@app.post("/scan", response_model=ScanResponse)
async def scan_food_item(file: UploadFile = File(...)):
    try:
        if not os.getenv("GEMINI_API_KEY"):
            print("CRITICAL: GEMINI_API_KEY is missing!")
            raise HTTPException(status_code=500, detail="Gemini API Key not configured")

        # 1. Read and encode the image
        image_data = await file.read()
        
        # 2. Define the Vision Prompt for Gemini
        prompt = """
        Analyze this food item image. 
        1. Identify the specific product name (e.g., 'Maize Meal', 'Covo', 'Greek Yogurt').
        2. Categorize it (e.g., 'Grains', 'Vegetables', 'Dairy').
        3. Estimate a conservative expiry date in YYYY-MM-DD format if not visible.
        4. Provide a carbon impact factor (kg CO2e per kg).
        
        Return ONLY a JSON object with keys: 
        "item_name", "category", "estimated_expiry", "confidence_score", "carbon_impact_factor"
        """

        # 3. Call Gemini
        print(f"Calling Gemini for file: {file.filename}")
        try:
            response = model.generate_content([
                prompt,
                {"mime_type": "image/jpeg", "data": image_data}
            ])
            print(f"Gemini response received.")
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")
        
        # 4. Clean and parse the response
        try:
            text_response = response.text.replace('```json', '').replace('```', '').strip()
            result_data = json.loads(text_response)
        except Exception as e:
            print(f"JSON Parsing Error: {str(e)} | Raw: {response.text}")
            # Fallback for structured response if Gemini hallucinates
            result_data = {
                "item_name": "Unknown Item",
                "category": "OTHER",
                "estimated_expiry": "2026-12-31",
                "confidence_score": 0.5,
                "carbon_impact_factor": 2.5
            }
        
        # 5. Map impact to 0.5kg default weight for CO2e calculation
        impact_factor = float(result_data.get("carbon_impact_factor", 2.5))
        co2e_saved = float(f"{(impact_factor * 0.5):.2f}")
        
        # Ensure result_data is a dict we can update
        result = dict(result_data)
        result["co2e_saved"] = co2e_saved
        
        return result
    except Exception as e:
        print("--- FASTAPI ERROR START ---")
        print(traceback.format_exc())
        print("--- FASTAPI ERROR END ---")
        raise HTTPException(status_code=500, detail=str(e))

class RecipeResponse(BaseModel):
    item_name: str
    recipes: list[str]

@app.post("/recipes", response_model=RecipeResponse)
async def generate_recipes(item_name: str):
    try:
        prompt = f"""
        You are the Eco-Scan Zero-Waste Chef. 
        For the food item '{item_name}', suggest 3 creative, zero-waste, and local Zimbabwean-themed recipes.
        Focus on using the item fully (including peels or stalks if applicable) and common local ingredients.
        
        Return ONLY a JSON array of strings.
        """
        response = model.generate_content(prompt)
        # Clean response and parse JSON array
        recipes = json.loads(response.text.replace('```json', '').replace('```', '').strip())
        return {"item_name": item_name, "recipes": recipes}
    except Exception as e:
        print(f"Recipe AI error: {str(e)}")
        # Fallback for local testing
        return {
            "item_name": item_name, 
            "recipes": [f"{item_name} Relish with Peanut Butter", f"Dried {item_name} (Mufushwa)", f"Sautéed {item_name} with Onions"]
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
