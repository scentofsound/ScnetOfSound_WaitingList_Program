from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import schemas, crud

router = APIRouter(prefix="/waiting", tags=["Waiting"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Waiting)
def create_waiting(req: schemas.WaitingCreate, db: Session = Depends(get_db)):
    return crud.create_waiting(db, req.phone, req.people)

@router.get("/", response_model=list[schemas.Waiting])
def get_waiting_list(db: Session = Depends(get_db)):
    return crud.get_all_waiting(db)
