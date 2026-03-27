import os
import base64
import json
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Setup Gemini 3 Flash / 1.5 Flash in 2026
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

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
        
        return result

    except Exception as e:
        print(f"Error in /scan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
