# Dockerfile
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN apt-get update && apt-get install -y libgl1-mesa-glx && \
    pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./app /app/app

# Install Tesseract
RUN apt-get update && apt-get install -y tesseract-ocr

# Cleanup
RUN pip install --no-cache-dir -r /app/requirements.txt \
&& rm -rf /root/.cache/pip


CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
