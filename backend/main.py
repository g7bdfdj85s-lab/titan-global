import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import OpenAI, APIError, AuthenticationError, RateLimitError

app = FastAPI(title="TITAN GLOBAL API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://incredible-bonbon-d369ee.netlify.app"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

class DirectiveRequest(BaseModel):
    directive: str = Field(min_length=3, max_length=3000)

@app.get("/")
def home():
    return {"company": "TITAN GLOBAL", "status": "online"}

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "ai_connected": bool(os.getenv("OPENAI_API_KEY")),
        "mode": "ai-enabled" if os.getenv("OPENAI_API_KEY") else "prototype"
    }

@app.post("/directive")
def process_directive(payload: DirectiveRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="AI is not configured")

    client = OpenAI(api_key=api_key)
    try:
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-6.1-terra"),
            instructions=(
                "You are TITAN GLOBAL's strategic analysis assistant. "
                "Separate facts, assumptions, risks, and recommended next steps. "
                "Never claim to have executed external actions or guarantee profits. "
                "Flag regulated activities requiring qualified professionals or licenses. "
                "The founder must approve contracts, payments, investments, "
                "incorporations, acquisitions, and major commitments."
            ),
            input=payload.directive,
            max_output_tokens=700,
        )
        return {
            "status": "success",
            "model": os.getenv("OPENAI_MODEL", "gpt-6.1-terra"),
            "response": response.output_text,
        }
    except AuthenticationError:
        raise HTTPException(status_code=502, detail="Check OpenAI API key permissions.")
    except RateLimitError:
        raise HTTPException(status_code=429, detail="OpenAI quota or rate limit reached.")
    except APIError:
        raise HTTPException(status_code=502, detail="OpenAI request failed.")
