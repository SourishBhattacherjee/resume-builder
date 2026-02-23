from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from typing import List, Optional

# Optional OpenAI integration if OPENAI_API_KEY is set
try:
    import openai
    OPENAI_AVAILABLE = True
except Exception:
    OPENAI_AVAILABLE = False

app = FastAPI(title="Resume AI Helper")

# CORS: allow frontend origin (adjust or set CORS_ORIGINS env var as needed)
origins = os.getenv('CORS_ORIGINS', 'http://127.0.0.1:5173')
if isinstance(origins, str):
    origins = [o.strip() for o in origins.split(',') if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResumeIn(BaseModel):
    full_name: Optional[str]
    email: Optional[str]
    text: str
    locale: Optional[str] = "en"

class Recommendation(BaseModel):
    suggestions: List[str]


@app.post('/recommend', response_model=Recommendation)
async def recommend(resume: ResumeIn):
    """
    Returns quick AI-style recommendations for improving the resume.

    Behavior:
    - If OPENAI_API_KEY is present, use OpenAI's API to generate suggestions.
    - Otherwise, fall back to a lightweight rule-based analyzer.
    """
    api_key = os.getenv('OPENAI_API_KEY')

    if api_key and OPENAI_AVAILABLE:
        openai.api_key = api_key
        prompt = (
            f"You are a helpful assistant that reads a resume and returns 5 concise, actionable suggestions to improve it.\n\n"
            f"Resume text:\n{resume.text}\n\nRespond as a JSON array of strings only."
        )
        try:
            resp = openai.ChatCompletion.create(
                model='gpt-4o-mini',
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300,
                temperature=0.6,
            )
            content = resp.choices[0].message.content.strip()
            # Expecting JSON array; try to parse
            import json
            try:
                arr = json.loads(content)
                if isinstance(arr, list):
                    return {"suggestions": arr}
            except Exception:
                # If parsing fails, split by newline heuristically
                lines = [l.strip('- ').strip() for l in content.splitlines() if l.strip()]
                return {"suggestions": lines[:5]}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OpenAI request failed: {e}")

    # Fallback heuristic analyzer
    suggestions = []
    text = resume.text or ''
    words = text.split()
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
    if not any(word.lower().endswith('ed') or word.lower() in ['led','built','designed','implemented'] for word in words[:200]):
        suggestions.append('Start bullet points with strong action verbs like "Led", "Designed", "Implemented", "Optimized".')

    # Rule: contact info
    if not resume.email:
        suggestions.append('Add a professional contact email at the top of the resume.')

    # Fallback generic
    if not suggestions:
        suggestions.append('Consider proofreading for clarity and consistency, and ensure each bullet highlights the result of your work.')

    return {"suggestions": suggestions[:5]}
