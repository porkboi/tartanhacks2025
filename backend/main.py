from fastapi import FastAPI, File, UploadFile
import pytesseract
from PIL import Image
import io
import re
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Function to extract food items and their quantities
def parse_receipt_text(text):
    items = []
    lines = text.split('\n')
    item_pattern = re.compile(r'(?P<name>[a-zA-Z ]+)\s+(?P<quantity>\d+)')
    
    for line in lines:
        match = item_pattern.search(line)
        if match:
            items.append({
                "name": match.group("name").strip(),
                "quantity": int(match.group("quantity"))
            })
    
    return items

@app.post("/api/process-receipt")
async def upload_receipt(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read()))
    text = pytesseract.image_to_string(image)
    parsed_items = parse_receipt_text(text)
    
    return {"addedItems": parsed_items}
