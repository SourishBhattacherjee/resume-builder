# AI Helper (Resume Recommendations)

This small FastAPI service provides quick AI-flavored recommendations for improving resumes.

Endpoints
- POST /recommend
  - Request JSON: { "full_name": "...", "email": "...", "text": "<resume text>" }
  - Response JSON: { "suggestions": ["...", "..."] }

How it works
- If `OPENAI_API_KEY` is set in the environment and the `openai` Python package is installed, the service will call OpenAI to generate recommendations.
- Otherwise it uses a lightweight rule-based fallback.

Run locally
1. Create a virtualenv and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Set `OPENAI_API_KEY` in your environment if you want the OpenAI-backed recommendations.

3. Start the app with Uvicorn:

```bash
uvicorn fastapi_app:app --reload --port 9000
```

Try it
- POST to `http://localhost:9000/recommend` with a JSON body.

Notes
- The project includes a fallback analyzer so you can run recommendations without API keys.
- This is intentionally small and designed to be extended with richer parsing and more fine-grained suggestions.
