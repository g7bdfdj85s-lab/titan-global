from fastapi import FastAPI

app = FastAPI(title="TITAN GLOBAL API")

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
