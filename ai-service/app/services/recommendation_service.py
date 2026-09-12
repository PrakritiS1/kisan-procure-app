# Centre recommendation service
from app.utils.preprocessing import haversine_km


def score_centres(user_lat: float, user_lng: float, quantity: float, centres: list[dict]) -> list[dict]:
    """
    centres: list of dicts with keys: id, name, latitude, longitude, availableCapacity, estimatedWaitMinutes
    Scores centres by a weighted mix of distance, spare capacity, and wait time (lower is better on all three).
    """
    results = []
    for c in centres:
        distance_km = haversine_km(user_lat, user_lng, c["latitude"], c["longitude"])
        capacity_fit = min(c["availableCapacity"] / max(quantity, 1), 3.0)  # headroom over what farmer needs

        distance_score = max(0.0, 1 - distance_km / 50)
        capacity_score = min(1.0, capacity_fit / 3.0)
        wait_score = max(0.0, 1 - c.get("estimatedWaitMinutes", 30) / 120)

        score = round(0.5 * distance_score + 0.3 * capacity_score + 0.2 * wait_score, 3)

        results.append({
            "centreId": c["id"],
            "centre": c["name"],
            "distanceKm": round(distance_km, 1),
            "availableCapacity": c["availableCapacity"],
            "estimatedWaitMinutes": c.get("estimatedWaitMinutes", 30),
            "score": score,
        })

    results.sort(key=lambda r: r["score"], reverse=True)
    return results