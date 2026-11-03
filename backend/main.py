from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TITAN GLOBAL API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://incredible-bonbon-d369ee.netlify.app"
    ],
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"company": "TITAN GLOBAL", "status": "online"}

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "ai_connected": False,
        "mode": "prototype"
    }