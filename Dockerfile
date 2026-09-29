FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies first (for caching)
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code and ChromaDB store
COPY backend/ ./backend/
COPY chromadb_store/ ./chromadb_store/

# Expose the default port for Hugging Face Spaces
EXPOSE 7860

# Set Python Path so it finds the backend modules
ENV PYTHONPATH=/app/backend

# Start the FastAPI server
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
