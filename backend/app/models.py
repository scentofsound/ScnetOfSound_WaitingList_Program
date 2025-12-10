from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class WaitingService(Base):
    __tablename__ = "waiting_service"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    last_number = Column(Integer, default=0)   # 서비스별 최종 발급 번호

    created_at = Column(DateTime, default=datetime.now)

    # 관계
    waitings = relationship("Waiting", back_populates="service")


class Waiting(Base):
    __tablename__ = "waiting"

    id = Column(Integer, primary_key=True, index=True)

    service_id = Column(Integer, ForeignKey("waiting_service.id"))
    ticket_number = Column(Integer)  # 서비스별 번호

    people = Column(Integer)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.now)

    service = relationship("WaitingService", back_populates="waitings")

    __table_args__ = (
        UniqueConstraint("service_id", "ticket_number", name="uq_service_ticket"),
    )
