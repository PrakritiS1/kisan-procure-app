# Wait-time prediction route
from fastapi import APIRouter
from app.schemas.wait_time_schema import WaitPredictionRequest, WaitPredictionResponse
from app.services.wait_time_service import predict_wait_time

router = APIRouter()


@router.post("/predict-wait-time", response_model=WaitPredictionResponse)
def predict(request: WaitPredictionRequest):
    minutes, confidence = predict_wait_time(
        queue_size=request.queueSize,
        average_processing_time=request.averageProcessingTime,
        active_counters=request.activeCounters,
    )
    return WaitPredictionResponse(estimatedWaitMinutes=minutes, confidence=confidence)