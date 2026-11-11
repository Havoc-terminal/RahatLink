from fastapi import APIRouter
from pydantic import BaseModel
from haversine import haversine, Unit
from typing import Optional

router = APIRouter()

# Dummy nearby NGOs in DB (mirrors frontend dummy data)
DUMMY_NGOS = [
    {"id": 1, "name": "Red Relief Foundation", "lat": 28.6139, "lng": 77.2090, "phone": "+91 98100 11234"},
    {"id": 2, "name": "Sahayata Sewa Sangh", "lat": 19.0760, "lng": 72.8777, "phone": "+91 98200 55678"},
    {"id": 3, "name": "Hope Bridge India", "lat": 12.9716, "lng": 77.5946, "phone": "+91 99001 77890"},
    {"id": 4, "name": "Raksha Volunteer Corps", "lat": 13.0827, "lng": 80.2707, "phone": "+91 97400 22345"},
    {"id": 5, "name": "Aasha Children Fund", "lat": 22.5726, "lng": 88.3639, "phone": "+91 96300 44567"},
]

# Dummy storage for victim requests (in-memory for demo)
DUMMY_VICTIM_REQUESTS = [
    {"id": "REQ-001", "type": "Food", "qty": "50 packets", "status": "accepted", "ngo": "Sahayata Sewa Sangh", "time": "2 hours ago"},
    {"id": "REQ-002", "type": "Medicine", "qty": "10 kits", "status": "pending", "ngo": "Red Relief Foundation", "time": "4 hours ago"},
    {"id": "REQ-003", "type": "Water", "qty": "200 liters", "status": "rejected", "ngo": "Hope Bridge India", "time": "1 day ago"},
]

class HelpRequest(BaseModel):
    lat: float
    lng: float
    message: Optional[str] = "Help needed"
    radius_km: Optional[float] = 500  # default 500km radius

class VictimRequest(BaseModel):
    type: str
    qty: str
    urgency: str
    notes: Optional[str] = ""
    phone: str
    lat: Optional[float] = None
    lng: Optional[float] = None

@router.post("/request-help")
def request_help(req: HelpRequest):
    user_loc = (req.lat, req.lng)
    nearby = []
    for ngo in DUMMY_NGOS:
        ngo_loc = (ngo["lat"], ngo["lng"])
        dist = haversine(user_loc, ngo_loc, unit=Unit.KILOMETERS)
        if dist <= req.radius_km:
            nearby.append({**ngo, "distance_km": round(dist, 1)})

    # Sort by distance
    nearby.sort(key=lambda x: x["distance_km"])

    return {
        "status": "notified",
        "message": f"Notified {len(nearby)} nearby NGOs about your request",
        "user_location": {"lat": req.lat, "lng": req.lng},
        "notified_ngos": nearby,
        "request_message": req.message,
    }

@router.post("/victim-request")
def victim_request(req: VictimRequest):
    new_req = {
        "id": f"REQ-00{len(DUMMY_VICTIM_REQUESTS) + 1}",
        "type": req.type,
        "qty": req.qty,
        "status": "pending",
        "ngo": "Nearby NGOs",
        "time": "just now"
    }
    DUMMY_VICTIM_REQUESTS.insert(0, new_req)
    return {"status": "success", "request": new_req}

@router.get("/victim-requests")
def get_victim_requests():
    return DUMMY_VICTIM_REQUESTS

class StatusUpdate(BaseModel):
    status: str
    ngo: Optional[str] = None

@router.patch("/victim-requests/{req_id}")
def update_victim_request(req_id: str, update: StatusUpdate):
    for req in DUMMY_VICTIM_REQUESTS:
        if req["id"] == req_id:
            req["status"] = update.status
            if update.ngo is not None:
                req["ngo"] = update.ngo
            return {"status": "success", "request": req}
    return {"status": "error", "message": "Request not found"}
