# Pydantic schemas for centre recommendation
from typing import List, Optional
from pydantic import BaseModel, Field


class RecommendCentresRequest(BaseModel):
    latitude: float
    longitude: float
    crop: str
    quantity: float = Field(gt=0)
    preferredTime: str


class Recommendation(BaseModel):
    centreId: int
    centre: str
    distanceKm: float
    availableCapacity: float
    estimatedWaitMinutes: int
    score: float


class RecommendCentresResponse(BaseModel):
    recommendations: List[Recommendation]