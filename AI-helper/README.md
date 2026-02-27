# AI Helper (Resume Recommendations)

Small FastAPI service that provides resume recommendations (rule-based fallback or OpenAI-backed when API key is set).

## Endpoints

- POST `/recommend`
  - Description: Analyze a resume payload and return up to 5 concise recommendations.
  - Request JSON: any of the `ResumeIn` shape (see `fastapi_app.py`) — simple payload example:
    ```json
    {
      "name": "Jane Doe",
      "summary": "Backend engineer...",
      "skills": ["Node.js", "MongoDB"],
      "experience": [{ "companyName": "ACME", "responsibilities": ["Built X"] }]
    }
    ```
  - Response JSON: `{ "suggestions": ["...", "..."] }`

- POST `/recommend/{resume_id}`
  - Description: Fetch a resume from the AI helper's MongoDB by id and return recommendations for that resume.
  - Path param: `resume_id` (Mongo _id or string id)

- GET `/health`
  - Description: Health check endpoint. Returns basic DB status and `resumesCount`.

## Run locally

1. Create a virtualenv and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Set environment variables (example):

```bash
export MONGO_URI="mongodb://localhost:27017"
export MONGO_DB_NAME="resume_db"
export OPENAI_API_KEY="sk_your_key_here"  # optional
```

3. Start the app:

```bash
uvicorn fastapi_app:app --reload --port 9000
```

## Examples

- Simple recommend (curl):

```bash
curl -X POST http://localhost:9000/recommend \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","summary":"Experienced dev","skills":["Python"]}'
```

- Recommend for saved resume id:

```bash
curl -X POST http://localhost:9000/recommend/605c3b2f9e1d8b2f4a0d7a1f
```

## Notes

- If `OPENAI_API_KEY` is available and the `openai` package is installed, the service will attempt to use OpenAI; otherwise it falls back to a built-in analyzer.
- CORS origins default to `http://127.0.0.1:5173` (configurable via `CORS_ORIGINS`).

