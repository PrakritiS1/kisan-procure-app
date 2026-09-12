# Training script for wait-time model
"""
Train the wait-time prediction model.
Run from the ai-service/ directory:
    python training/train_wait_time.py
"""
import os
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "training_data.csv")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "app", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "wait_time_model.joblib")


def main():
    df = pd.read_csv(DATA_PATH)
    X = df[["queue_length", "avg_service_time", "active_officers"]]
    y = df["wait_time_minutes"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = LinearRegression()
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    print(f"Validation MAE: {mae:.2f} minutes")

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"Saved model to {MODEL_PATH}")


if __name__ == "__main__":
    main()