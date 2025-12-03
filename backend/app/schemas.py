from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class WaitingCreate(BaseModel):
    phone: str

class Waiting(BaseModel):
    id: int
    phone: str
    people: int   # 🔥 이렇게 잠깐 완화

    status: str
    created_at: datetime

    class Config:
        orm_mode = True


class WaitingCreate(BaseModel):
    phone: str
    people: int

class SMSRequest(BaseModel):
    phone: str
    people: int

class SMSResponse(BaseModel):
    message: str
    sms_status: Any = None
    data: Any = None