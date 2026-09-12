# Centre recommendation route
import os
import httpx
from fastapi import APIRouter, HTTPException
from app.schemas.recommendation_schema import RecommendCentresRequest, RecommendCentresResponse
from app.services.recommendation_service import score_centres

router = APIRouter()

BACKEND_BASE_URL = os.environ.get("BACKEND_BASE_URL", "http://localhost:8080")


@router.post("/recommend-centres", response_model=RecommendCentresResponse)
def recommend(request: RecommendCentresRequest):
    try:
        with httpx.Client(timeout=5.0) as client:
            resp = client.get(
                f"{BACKEND_BASE_URL}/api/centres/nearby",
                params={"latitude": request.latitude, "longitude": request.longitude, "radius": 50},
            )
            resp.raise_for_status()
            centres = resp.json().get("centres", [])
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Could not reach backend for centre list: {exc}")

    scored = score_centres(request.latitude, request.longitude, request.quantity, centres)
    return RecommendCentresResponse(recommendations=scored)