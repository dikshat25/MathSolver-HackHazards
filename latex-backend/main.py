# main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from PIL import Image
import io

app = FastAPI()

# Allow frontend (React) to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/latex")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Extract LaTeX using pytesseract (or pix2tex if you're ready)
        latex_code = pytesseract.image_to_string(image)

        return {"latex": latex_code}
    except Exception as e:
        return {"error": str(e)}
