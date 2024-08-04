import os
import cv2
import pytesseract
import pandas as pd
from pdf2image import convert_from_path
from ultralytics import YOLO
from openpyxl import Workbook
from openpyxl.utils.dataframe import dataframe_to_rows
from openpyxl.styles import Alignment
import json

# YOLO model path and class names
model = YOLO('yolov8model/weights/best.pt')
class_names = {
    0: 'BA',
    1: 'BAID',
    2: 'INV',
    3: 'INV_DATE',
    4: 'INV_DATE_ID',
    5: 'INV_ID',
    6: 'ORD_DATE',
    7: 'ORD_DATE_ID',
    8: 'SA',
    9: 'SAID',
    10: 'SLR',
    11: 'SLR_ID',
    12: 'TOTAL',
    13: 'TOTAL_ID'
}

# Output directories
base_save_path = '/tmp/savedimages'  # Using /tmp directory for Lambda
os.makedirs(base_save_path, exist_ok=True)

# Function to save cropped images with class name as filename
def imgwrite(img, class_name, idx, invoice_folder):
    filename = f'{class_name}_{idx}.png'
    folder_path = os.path.join(base_save_path, invoice_folder)
    os.makedirs(folder_path, exist_ok=True)
    cv2.imwrite(os.path.join(folder_path, filename), img)

# Function to process an image and save detected objects
def process_image(image_path, invoice_folder):
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error loading image {image_path}")
        return

    results = model.predict(image)
    boxes = results[0].boxes.data
    for i, (xmin, ymin, xmax, ymax, conf, cls_id) in enumerate(boxes):
        class_name = class_names.get(int(cls_id), "Unknown")
        cropped_image = image[int(ymin):int(ymax), int(xmin):int(xmax)]
        imgwrite(cropped_image, class_name, i, invoice_folder)

# Function to convert PDF to images and process them
def process_pdf(pdf_path, invoice_folder):
    images = convert_from_path(pdf_path)
    for i, image in enumerate(images):
        image_path = os.path.join(base_save_path, invoice_folder, f'page_{i}.png')
        image.save(image_path, 'PNG')
        process_image(image_path, invoice_folder)

# Process files and directories
def process_files(file_paths):
    for file_path in file_paths:
        invoice_folder = os.path.basename(file_path).split('.')[0]  # Use filename without extension as folder name
        if file_path.lower().endswith('.pdf'):
            process_pdf(file_path, invoice_folder)
        elif file_path.lower().endswith(('.png', '.jpg', '.jpeg')):
            process_image(file_path, invoice_folder)
        else:
            print(f"Unsupported file type: {file_path}")

# Tesseract OCR configuration
pytesseract.pytesseract.tesseract_cmd = '/opt/bin/tesseract'  # Use the correct path for Lambda

# Function to clean numeric values
def clean_numeric(value):
    return ''.join(ch for ch in value if ch.isdigit() or ch in ',.')

# Column mappings for the Excel sheet
column_mappings = {
    'BA': 'Billing Address',
    'INV': 'Invoice #',
    'SA': 'Shipping Address',
    'ORD_DATE': 'Order Date',
    'INV_DATE': 'Invoice Date',
    'TOTAL': 'Total Amount',
    # Include additional mappings as needed
}

# Function to extract text from images and save to Excel
def images_to_excel(base_directory, excel_path):
    df = pd.DataFrame(columns=column_mappings.values())

    for invoice_folder in os.listdir(base_directory):
        folder_path = os.path.join(base_directory, invoice_folder)
        if os.path.isdir(folder_path):
            invoice_data = {column: "" for column in column_mappings.values()}

            for filename in os.listdir(folder_path):
                if filename.endswith(".png"):
                    file_path = os.path.join(folder_path, filename)
                    img = cv2.imread(file_path)
                    extracted_text = pytesseract.image_to_string(img)
                    parts = filename.split('_')
                    class_name = '_'.join(parts[:-1])
                    if class_name in column_mappings:
                        column_name = column_mappings[class_name]
                        if column_name == 'Total Amount':
                            extracted_text = clean_numeric(extracted_text)
                        invoice_data[column_name] = extracted_text.strip()

            new_row = pd.DataFrame([invoice_data])
            df = pd.concat([df, new_row], ignore_index=True)

    writer = pd.ExcelWriter(excel_path, engine='openpyxl')
    df.to_excel(writer, index=False)

    workbook = writer.book
    worksheet = writer.sheets['Sheet1']

    for column_cells in worksheet.columns:
        length = max(len(str(cell.value)) for cell in column_cells)
        worksheet.column_dimensions[column_cells[0].column_letter].width = length

    writer.close()
    print("Excel file created and data stored successfully.")

# Main function to process input files and generate Excel
def lambda_handler(event, context):
    file_paths = event.get('file_paths', [])
    output_excel = event.get('output_excel', '/tmp/invoice_data.xlsx')  # Use /tmp directory for Lambda
    main(file_paths, output_excel)
    return {
        'statusCode': 200,
        'body': json.dumps('Processing complete.'),
        'output_excel': output_excel
    }

def main(file_paths, output_excel):
    process_files(file_paths)
    images_to_excel(base_save_path, output_excel)
