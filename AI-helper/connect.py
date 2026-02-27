import os
from motor.motor_asyncio import AsyncIOMotorClient

# Load from env
MONGO_URI = os.getenv("MONGO_URI")

# Your Atlas DB name (confirmed from screenshot)
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "test")

if not MONGO_URI:
    raise ValueError("MONGO_URI is not set in environment variables")

# Create client
client = AsyncIOMotorClient(MONGO_URI)

# Get database
db = client[MONGO_DB_NAME]

# Dependency for FastAPI
def get_db():
    return db