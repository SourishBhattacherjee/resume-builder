from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

# Optional OpenAI integration
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except Exception:
    OPENAI_AVAILABLE = False

app = FastAPI(title="Resume AI Helper")

# Mongo client (lazy)
_mongo_client: Optional[AsyncIOMotorClient] = None

def get_mongo_client() -> AsyncIOMotorClient:
    global _mongo_client
    if _mongo_client is None:
        uri = os.getenv('MONGO_URI')
        if not uri:
            raise RuntimeError('MONGO_URI environment variable is not set')
        _mongo_client = AsyncIOMotorClient(uri)
    return _mongo_client

async def get_db():
    client = get_mongo_client()
    db = client.get_default_database()
    if db is None:
        db_name = os.getenv('MONGO_DB_NAME', 'resume_db')
        db = client[db_name]
    return db

# CORS
origins = os.getenv("CORS_ORIGINS", "http://127.0.0.1:5173")
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
    full_name: Optional[str] = None
    email: Optional[str] = None
    text: Optional[str] = ""
    locale: Optional[str] = "en"

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


# ---------------- Helpers ----------------

def has_text(value: Optional[str]) -> bool:
    return bool(value and value.strip())


def has_valid_list(items, key_check=None):
    if not items or not isinstance(items, list):
        return False
    if key_check:
        return any(getattr(item, key_check, None) for item in items)
    return len(items) > 0


def build_structured_text(r: ResumeIn) -> str:
    parts = []

    if r.name:
        parts.append(f"Name: {r.name}")

    if r.personalDetails:
        for pd in r.personalDetails:
            pd_lines = []
            if pd.fullName:
                pd_lines.append(f"Full name: {pd.fullName}")
            if pd.email:
                pd_lines.append(f"Email: {pd.email}")
            if pd.linkedin:
                pd_lines.append(f"LinkedIn: {pd.linkedin}")
            if pd.github:
                pd_lines.append(f"GitHub: {pd.github}")
            if pd_lines:
                parts.append("; ".join(pd_lines))

    if has_text(r.summary):
        parts.append(f"Summary: {r.summary}")

    if has_valid_list(r.skills):
        parts.append("Skills: " + ", ".join(r.skills))

    if has_valid_list(r.experience, "companyName"):
        exp_lines = ["Experience:"]
        for e in r.experience:
            if not e.companyName:
                continue
            dates = f"{e.startDate or ''} - {e.endDate or ('Present' if e.currentlyWorking else '')}".strip(" -")
            exp_lines.append(f"- {e.companyName} ({dates})")
            if e.location:
                exp_lines.append(f"  Location: {e.location}")

            resps = [x for x in (e.responsibilities or []) if has_text(x)]
            for resp in resps:
                exp_lines.append(f"    • {resp}")

        parts.append("\n".join(exp_lines))

    if has_valid_list(r.education, "institution"):
        edu_lines = ["Education:"]
        for ed in r.education:
            if not ed.institution:
                continue
            dates = f"{ed.startDate or ''} - {ed.endDate or ''}".strip(" -")
            edu_lines.append(f"- {ed.institution}, {ed.degree or ''} ({dates})")
            if has_text(ed.relatedCoursework):
                edu_lines.append(f"    Coursework: {ed.relatedCoursework}")
        parts.append("\n".join(edu_lines))

    if has_valid_list(r.projects, "name"):
        proj_lines = ["Projects:"]
        for p in r.projects:
            if not p.name:
                continue
            proj_lines.append(f"- {p.name} ({p.link or ''})")

            desc = [d for d in (p.description or []) if has_text(d)]
            for d in desc:
                proj_lines.append(f"    • {d}")

        parts.append("\n".join(proj_lines))

    if has_valid_list(r.certifications, "name"):
        parts.append("Certifications: " + ", ".join([c.name for c in r.certifications if c.name]))

    if has_valid_list(r.languages):
        parts.append("Languages: " + ", ".join(r.languages))

    if not parts:
        return r.text or ""

    return "\n\n".join(parts)


# ---------------- Endpoint ----------------

@app.post("/recommend", response_model=Recommendation)
async def recommend(resume: ResumeIn):

    resume_text_for_ai = build_structured_text(resume)
    api_key = os.getenv("OPENAI_API_KEY")

    # ---------- OpenAI path ----------
    if api_key and OPENAI_AVAILABLE:
        try:
            client = OpenAI(api_key=api_key)

            prompt = (
                "You are a helpful assistant that reads a candidate's resume and returns "
                "5 concise, actionable suggestions to improve it.\n\n"
                f"Here is the candidate's resume:\n\n{resume_text_for_ai}\n\n"
                "Respond as a JSON array of strings only."
            )

            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300,
                temperature=0.6,
            )

            content = resp.choices[0].message.content.strip()

            import json
            try:
                arr = json.loads(content)
                if isinstance(arr, list):
                    return {"suggestions": arr[:5]}
            except Exception:
                lines = [l.strip("- ").strip() for l in content.splitlines() if l.strip()]
                return {"suggestions": lines[:5]}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OpenAI request failed: {e}")

    # ---------- Smart fallback analyzer ----------
    # If OpenAI is not configured or the OpenAI package isn't available,
    # run a lightweight heuristic analyzer and return suggestions.
    if not (api_key and OPENAI_AVAILABLE):
        suggestions = []
        resume_text = resume_text_for_ai or (resume.text or "")
        words = resume_text.split()
        word_count = len(words)

        # Rule: length
        if word_count < 200:
            suggestions.append('Your resume is a bit short — consider adding more details about your impact, metrics, and technologies used.')
        elif word_count > 1000:
            suggestions.append('Your resume is quite long — try to condense to 1-2 pages and focus on relevant achievements.')

        # Rule: presence of metrics (simple heuristic)
        if not any('%' in s or 'x' in s.lower() or any(char.isdigit() for char in s) for s in words[:500]):
            suggestions.append('Include quantifiable metrics (e.g., "% increase", "reduced latency by 40%", "handled 1M users") to demonstrate impact.')

        # Rule: action verbs
        if not any(word.lower().endswith('ed') or word.lower() in ['led','built','designed','implemented','developed','optimized'] for word in words[:200]):
            suggestions.append('Start bullet points with strong action verbs like "Led", "Designed", "Implemented", "Optimized".')

        # Rule: contact info
        if not (resume.email or (resume.personalDetails and any(pd.email for pd in resume.personalDetails))):
            suggestions.append('Add a professional contact email at the top of the resume.')

        # Generic fallback
        if not suggestions:
            suggestions.append('Consider proofreading for clarity and consistency, and ensure each bullet highlights the result of your work.')

        return {"suggestions": suggestions[:5]}


@app.post("/recommend/{resume_id}", response_model=Recommendation)
async def recommend_by_id(resume_id: str, db=Depends(get_db)):
    """Fetch resume document from MongoDB by id, convert to ResumeIn and run analyzer."""
    # Try ObjectId first, fall back to string id
    query = None
    try:
        query = {"_id": ObjectId(resume_id)}
    except Exception:
        query = {"_id": resume_id}

    doc = await db["resumes"].find_one(query)
    if not doc:
        raise HTTPException(status_code=404, detail="Resume not found")

    def mongo_to_resume_in(d: dict) -> ResumeIn:
        # Convert Mongo document to ResumeIn-compatible dict
        d = dict(d)
        if "_id" in d:
            d["id"] = str(d["_id"])
            d.pop("_id", None)
        return ResumeIn(
            user=str(d.get("user")) if d.get("user") else None,
            name=d.get("name"),
            template=d.get("template"),
            personalDetails=d.get("personalDetails"),
            summary=d.get("summary"),
            education=d.get("education"),
            skills=d.get("skills"),
            experience=d.get("experience"),
            projects=d.get("projects"),
            certifications=d.get("certifications"),
            languages=d.get("languages"),
            previewImage=d.get("previewImage"),
            text=d.get("text") or "",
        )

    resume = mongo_to_resume_in(doc)
    return await recommend(resume)