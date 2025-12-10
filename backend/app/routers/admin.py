# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from ..database import SessionLocal
# from .. import crud

# router = APIRouter(prefix="/admin", tags=["Admin"])

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# @router.post("/call/{id}")
# def call_user(id: int, db: Session = Depends(get_db)):
#     return crud.update_status(db, id, "호출됨")

# @router.post("/done/{id}")
# def complete_user(id: int, db: Session = Depends(get_db)):
#     return crud.update_status(db, id, "완료")

# @router.delete("/{id}")
# def delete_user(id: int, db: Session = Depends(get_db)):
#     return crud.delete_waiting(db, id)


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import crud

router = APIRouter(prefix="/admin", tags=["Admin"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------
# 호출
# ---------------------------------------
@router.post("/{service_name}/call/{ticket_number}")
def call_user(service_name: str, ticket_number: int, db: Session = Depends(get_db)):
    return crud.update_status(db, service_name, ticket_number, "호출됨")


# ---------------------------------------
# 완료 처리
# ---------------------------------------
@router.post("/{service_name}/done/{ticket_number}")
def complete_user(service_name: str, ticket_number: int, db: Session = Depends(get_db)):
    return crud.update_status(db, service_name, ticket_number, "완료")


# ---------------------------------------
# 삭제 (soft delete)
# ---------------------------------------
@router.delete("/{service_name}/{ticket_number}")
def delete_user(service_name: str, ticket_number: int, db: Session = Depends(get_db)):
    return crud.update_status(db, service_name, ticket_number, "삭제됨")
