# Pydantic schemas for wait-time prediction
from pydantic import BaseModel, Field


class WaitPredictionRequest(BaseModel):
    queueSize: int = Field(ge=0)
    currentTime: str
    averageProcessingTime: float = Field(gt=0)
    activeCounters: int = Field(gt=0)
    crop: str


class WaitPredictionResponse(BaseModel):
    estimatedWaitMinutes: int
    confidence: float