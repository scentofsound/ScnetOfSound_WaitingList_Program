from pydantic import BaseModel
from datetime import datetime


class Waiting(BaseModel):
    id: int
    service_id: int         # 🔥 문자열 아님
    ticket_number: int
    people: int
    status: str
    created_at: datetime

    class Config:
        orm_mode = True



class WaitingCreate(BaseModel):
    people: int


class ServiceCreate(BaseModel):
    name: str
