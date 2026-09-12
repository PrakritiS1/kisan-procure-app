# Wait-time prediction service
import os
import joblib
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "wait_time_model.joblib")

_model = None
_model_loaded = False


def _load_model():
    global _model, _model_loaded
    if not _model_loaded:
        _model_loaded = True
        if os.path.exists(MODEL_PATH):
            _model = joblib.load(MODEL_PATH)
    return _model


def predict_wait_time(queue_size: int, average_processing_time: float, active_counters: int) -> tuple[int, float]:
    model = _load_model()

    if model is not None:
        X = np.array([[queue_size, average_processing_time, active_counters]])
        minutes = max(0, float(model.predict(X)[0]))
        return round(minutes), 0.8

    # Fallback formula, used only if train_wait_time.py hasn't been run yet
    minutes = (queue_size * average_processing_time) / max(active_counters, 1)
    return round(max(0, minutes)), 0.5