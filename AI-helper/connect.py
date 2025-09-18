import os
from urllib.parse import urlparse
from motor.motor_asyncio import AsyncIOMotorClient

# Prefer explicit env var, fall back to common names
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME") or os.getenv("MONGO_DB")

# If no DB name provided, try to parse it from the URI path
if not MONGO_DB_NAME:
    try:
        parsed = urlparse(MONGO_URI)
        path = (parsed.path or "").lstrip("/")            # '/myDB' -> 'myDB'
        path = path.split("?")[0]                         # remove query if any
        MONGO_DB_NAME = path if path else "resume_ai"     # fallback name
    except Exception:
        MONGO_DB_NAME = "resume_ai"

client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB_NAME]

def get_db():
    return db