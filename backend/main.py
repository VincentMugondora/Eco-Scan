from fastapi import FastAPI, UploadFile, File, HTTPHeader
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import List, Dict
import json

app = FastAPI(title="Eco-Scan AI Bridge")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_SYSTEM_PROMPT = """
You are the Eco-Scan Zero-Waste Chef. 
Analyze the provided food image and return a structured JSON response.
Identify the item, suggest a category (GRAINS, PROTEIN, DAIRY, VEGETABLES, FRUITS, OTHER), 
estimate a weight in kg, and provide 3 local Zimbabwean-themed zero-waste recipes.

Return ONLY this JSON format:
{
  "item_name": "string",
  "category": "string",
  "estimated_weight_kg": float,
  "estimated_expiry": "YYYY-MM-DD",
  "recipes": ["string", "string", "string"]
}
"""

@app.post("/scan")
async def scan_item(file: UploadFile = File(...)):
    # Placeholder for Gemini 2.0 Flash integration
    # In a real scenario, we would use the google-generativeai SDK here
    
    # Mock response for the hardcoded image verification
    return {
        "item_name": "Covo (Leafy Greens)",
        "category": "VEGETABLES",
        "estimated_weight_kg": 0.5,
        "estimated_expiry": "2026-04-03",
        "recipes": ["Covo Stew with Peanut Butter", "Sautéed Covo with Tomatoes", "Dried Covo (Mufushwa)"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
