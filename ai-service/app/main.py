from fastapi import FastAPI
from app.routes import wait_time, recommendation

app = FastAPI(title="KisanProcure AI Service")

app.include_router(wait_time.router, prefix="/ai", tags=["wait-time"])
app.include_router(recommendation.router, prefix="/ai", tags=["recommendation"])


@app.get("/health")
def health():
    return {"status": "ok"}