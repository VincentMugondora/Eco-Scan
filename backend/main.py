import os
import base64
import json
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Setup Gemini 2.0 Flash (2026 standard for Flash performance)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

app = FastAPI(title="Eco-Scan AI Bridge")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        response = model.generate_content([
            prompt,
            {"mime_type": "image/jpeg", "data": image_data}
        ])
        
        # 4. Clean and parse the response
        text_response = response.text.replace('```json', '').replace('```', '').strip()
        result = json.loads(text_response)
        
        # 5. Map impact to 0.5kg default weight for CO2e calculation
        # CO2e Saved = Carbon Impact Factor * 0.5kg
        result["co2e_saved"] = round(result.get("carbon_impact_factor", 2.5) * 0.5, 3)
        
        return result
    except Exception as e:
        print(f"Error in /scan: {str(e)}")
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
