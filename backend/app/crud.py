from sqlalchemy.orm import Session
from . import models

def create_waiting(db: Session, phone: str, people: int):
    new = models.Waiting(phone=phone, people=people)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

def get_all_waiting(db: Session):
    return db.query(models.Waiting).order_by(models.Waiting.id.asc()).all()

def update_status(db: Session, waiting_id: int, status: str):
    item = db.query(models.Waiting).filter(models.Waiting.id == waiting_id).first()
    if item:
        item.status = status
        db.commit()
        db.refresh(item)
    return item

def delete_waiting(db: Session, waiting_id: int):
    item = db.query(models.Waiting).filter(models.Waiting.id == waiting_id).first()
    if item:
        db.delete(item)
        db.commit()
    return item
