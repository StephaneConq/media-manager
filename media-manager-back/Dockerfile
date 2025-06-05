FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


COPY .env .
COPY models/ ./models
COPY routers/ ./routers
COPY services/ ./services
COPY .dockerignore .
COPY .gcloudignore .
COPY app.py .
COPY config.py .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
