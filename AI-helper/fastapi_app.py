from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()



app = FastAPI(title="Resume AI Helper")

# ---------------- Mongo Setup ----------------

_mongo_client: Optional[AsyncIOMotorClient] = None

def get_mongo_client() -> AsyncIOMotorClient:
    global _mongo_client
    if _mongo_client is None:
        uri = os.getenv("MONGO_URI")
        if not uri:
            raise RuntimeError("MONGO_URI is not set")
        _mongo_client = AsyncIOMotorClient(uri)
    return _mongo_client

async def get_db():
    client = get_mongo_client()
    db_name = os.getenv("MONGO_DB_NAME", "test")
    return client[db_name]

# ---------------- CORS ----------------

origins = os.getenv("CORS_ORIGINS", "http://127.0.0.1:5173,http://localhost:5173")
if isinstance(origins, str):
    origins = [o.strip() for o in origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Models ----------------

class Recommendation(BaseModel):
    suggestions: List[str]

class PersonalDetailsModel(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None

class EducationModel(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    relatedCoursework: Optional[str] = None

class ExperienceModel(BaseModel):
    companyName: Optional[str] = None
    location: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    currentlyWorking: Optional[bool] = False
    responsibilities: Optional[List[str]] = None

class ProjectModel(BaseModel):
    name: Optional[str] = None
    link: Optional[str] = None
    description: Optional[List[str]] = None

class CertificationModel(BaseModel):
    name: Optional[str] = None
    link: Optional[str] = None

class ResumeIn(BaseModel):
    user: Optional[str] = None
    name: Optional[str] = None
    template: Optional[str] = None
    personalDetails: Optional[List[PersonalDetailsModel]] = None
    summary: Optional[str] = None
    education: Optional[List[EducationModel]] = None
    skills: Optional[List[str]] = None
    experience: Optional[List[ExperienceModel]] = None
    projects: Optional[List[ProjectModel]] = None
    certifications: Optional[List[CertificationModel]] = None
    languages: Optional[List[str]] = None
    previewImage: Optional[str] = None
    text: Optional[str] = ""

# ---------------- Helpers ----------------

def has_text(value: Optional[str]) -> bool:
    return bool(value and value.strip())

def build_structured_text(r: ResumeIn) -> str:
    parts = []

    if r.name:
        parts.append(f"Name: {r.name}")

    if r.summary:
        parts.append(f"Summary: {r.summary}")

    if r.skills:
        parts.append("Skills: " + ", ".join(r.skills))

    if r.experience:
        parts.append("Experience:")
        for e in r.experience:
            if e.companyName:
                parts.append(f"- {e.companyName}")
            for resp in (e.responsibilities or []):
                if has_text(resp):
                    parts.append(f"  • {resp}")

    if r.projects:
        parts.append("Projects:")
        for p in r.projects:
            if p.name:
                parts.append(f"- {p.name}")
            for d in (p.description or []):
                if has_text(d):
                    parts.append(f"  • {d}")

    if r.education:
        parts.append("Education:")
        for ed in r.education:
            if ed.institution:
                parts.append(f"- {ed.institution} {ed.degree or ''}")

    return "\n".join(parts) or (r.text or "")

def convert_dates(obj):
    if isinstance(obj, dict):
        new_obj = {}
        for k, v in obj.items():
            if isinstance(v, datetime):
                new_obj[k] = v.isoformat()
            elif isinstance(v, list):
                new_obj[k] = [convert_dates(i) for i in v]
            else:
                new_obj[k] = v
        new_obj.pop("_id", None)
        return new_obj
    return obj

def clean_list(items):
    if not items:
        return items
    return [convert_dates(item) for item in items]

def mongo_to_resume_in(d: dict) -> ResumeIn:
    if not d:
        return None

    d = dict(d)
    d.pop("_id", None)

    return ResumeIn(
        user=str(d.get("user")) if d.get("user") else None,
        name=d.get("name"),
        template=d.get("template"),
        personalDetails=clean_list(d.get("personalDetails")),
        summary=d.get("summary"),
        education=clean_list(d.get("education")),
        skills=d.get("skills"),
        experience=clean_list(d.get("experience")),
        projects=clean_list(d.get("projects")),
        certifications=clean_list(d.get("certifications")),
        languages=d.get("languages"),
        previewImage=d.get("previewImage"),
        text=d.get("text") or "",
    )

# ---------------- Analyzer ----------------

def run_fallback_analyzer(resume_text: str, resume: ResumeIn) -> List[str]:
    suggestions = []
    word_count = len(resume_text.split())

    if word_count < 200:
        suggestions.append("Your resume is short — add more technical depth and metrics.")
    elif word_count > 1000:
        suggestions.append("Condense your resume to 1–2 pages focusing on relevant impact.")

    if not any(char.isdigit() for char in resume_text):
        suggestions.append("Add quantifiable metrics (e.g., reduced latency by 40%, handled 10k requests/day).")

    if not any(word.lower().endswith("ed") for word in resume_text.split()[:200]):
        suggestions.append("Start bullet points with strong action verbs like Built, Designed, Implemented.")

    if not resume.skills:
        suggestions.append("Add a dedicated skills section grouped by categories.")

    if not resume.projects:
        suggestions.append("Include 2–3 strong projects with tech stack and measurable impact.")

    if not resume.experience:
        suggestions.append("Add at least one internship or real-world experience.")

    if not suggestions:
        suggestions.append("Good resume. Add system design details and production deployment links.")

    return suggestions[:5]

# ---------------- Core Endpoint ----------------

from fastapi.responses import PlainTextResponse

@app.post("/recommend", response_class=PlainTextResponse)
async def recommend(resume: ResumeIn):

    resume_text = build_structured_text(resume)

    if not resume_text.strip():
        return "No resume data found. Please fill your resume first."

    api_key = os.getenv("OPENROUTER_API_KEY")

    if api_key:
        import urllib.request
        import json
        try:
            prompt = (
                "You are a resume reviewer. Give 5 concise, actionable suggestions.\n\n"
                f"{resume_text}\n\nReturn each suggestion on a new line. No JSON."
            )

            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            data = {
                "model": "openai/gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 300,
                "temperature": 0.6
            }

            req = urllib.request.Request(
                "https://openrouter.ai/api/v1/chat/completions",
                data=json.dumps(data).encode("utf-8"),
                headers=headers,
                method="POST"
            )

            with urllib.request.urlopen(req) as response:
                resp_body = response.read().decode("utf-8")
                resp_json = json.loads(resp_body)
                content = resp_json["choices"][0]["message"]["content"].strip()

            # ensure clean lines
            lines = [l.strip("- ").strip() for l in content.splitlines() if l.strip()]
            return "\n".join(lines[:5])

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OpenRouter failed: {e}")

    suggestions = run_fallback_analyzer(resume_text, resume)
    return "\n".join(suggestions)
# ---------------- Mongo ID Endpoint ----------------

@app.post("/recommend/{resume_id}", response_model=Recommendation)
async def recommend_by_id(resume_id: str, db=Depends(get_db)):

    try:
        query = {"_id": ObjectId(resume_id)}
    except Exception:
        query = {"_id": resume_id}

    doc = await db["resumes"].find_one(query)

    if not doc:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume = mongo_to_resume_in(doc)

    return await recommend(resume)

# ---------------- Health Check ----------------

@app.get("/health")
async def health(db=Depends(get_db)):
    try:
        count = await db["resumes"].count_documents({})
        return {
            "status": "ok",
            "database": db.name,
            "resumesCount": count
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}