# Use an official Python runtime as a parent image
FROM python:3.11

# Set environment variables for FastAPI
ENV APP_HOST=127.0.0.1/

# Set the working directory inside the container
WORKDIR /

# Copy the requirements file into the container and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application code into the container
COPY . .

# Expose the port that FastAPI will run on
EXPOSE 8000

# Command to run the FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
