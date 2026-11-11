from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict

router = APIRouter()

class ChatMessage(BaseModel):
    request_id: str
    sender: str  # 'victim' or 'ngo'
    text: str
    timestamp: str = None

# In-memory store: { request_id: [messages] }
chat_db: Dict[str, List[Dict]] = {}

@router.post("/chat/send")
async def send_message(msg: ChatMessage):
    if not msg.timestamp:
        msg.timestamp = datetime.now().strftime("%I:%M %p")
    
    if msg.request_id not in chat_db:
        chat_db[msg.request_id] = []
    
    chat_db[msg.request_id].append(msg.dict())
    return {"status": "success", "message": msg.dict()}

@router.get("/chat/{request_id}")
async def get_chat_history(request_id: str):
    return chat_db.get(request_id, [])
