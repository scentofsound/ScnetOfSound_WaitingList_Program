from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base


class Waiting(Base):
    __tablename__ = "waiting"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(20))
    people = Column(Integer)  # ← 추가됨
    status = Column(String(20), default="대기중")
    created_at = Column(DateTime, default=datetime.now)


class SMS_Log(Base):

    __tablename__ = "sms_log"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(20))
    people = Column(Integer)  # ← 추가됨
    status = Column(String(20), default="대기중")
    created_at = Column(DateTime, default=datetime.now)
