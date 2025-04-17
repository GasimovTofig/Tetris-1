FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt 

# Install compatible Flask and Werkzeug versions
RUN pip install --no-cache-dir --upgrade Flask==2.2.2 werkzeug==2.2.2

# Copy your application files into the container
COPY . .

# Run the Flask app
CMD ["python", "serve.py"]





