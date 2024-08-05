from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import os
import uuid
import shutil
from typing import List
import logging

from app.model import model

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

UPLOAD_DIR = "uploaded_files"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.get("/")
async def read_root():
    logger.info("GET / request received")
    return {"message": "Hello World"}

@app.post("/uploadfiles/")
async def create_upload_files(files: List[UploadFile] = File(...)):
    logger.info("POST /uploadfiles/ request received with %d files", len(files))
    
    if not files:
        logger.error("No files uploaded")
        raise HTTPException(status_code=400, detail="No files uploaded")

    file_paths = []
    for file in files:
        filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        file_paths.append(file_path)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info("File saved: %s", file_path)
    
    output_excel = os.path.join(UPLOAD_DIR, "output.xlsx")
    try:
        logger.info("Processing files to generate Excel")
        model.main(file_paths, output_excel)
        logger.info("Excel file created successfully: %s", output_excel)
    except Exception as e:
        logger.error("Error processing files: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))

    return FileResponse(output_excel, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', filename="output.xlsx")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
