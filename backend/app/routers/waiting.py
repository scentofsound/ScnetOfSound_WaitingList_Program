# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from ..database import SessionLocal
# from .. import schemas, crud

# router = APIRouter(prefix="/waiting", tags=["Waiting"])

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# @router.post("/", response_model=schemas.Waiting)
# def create_waiting(req: schemas.WaitingCreate, db: Session = Depends(get_db)):
#     return crud.create_waiting(db, req.people)

# @router.get("/", response_model=list[schemas.Waiting])
# def get_waiting_list(db: Session = Depends(get_db)):
#     return crud.get_all_waiting(db)

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


# -------------------------------------
# 1) 특정 서비스 대기 등록
# POST /waiting/{service_name}
# -------------------------------------
@router.post("/{service_name}", response_model=schemas.Waiting)
def create_waiting(service_name: str, req: schemas.WaitingCreate, db: Session = Depends(get_db)):
    return crud.create_waiting(db, service_name, req.people)


# -------------------------------------
# 2) 특정 서비스 대기 리스트 조회
# GET /waiting/{service_name}
# -------------------------------------
@router.get("/{service_name}", response_model=list[schemas.Waiting])
def get_list(service_name: str, db: Session = Depends(get_db)):
    return crud.get_waiting_list(db, service_name)


# -------------------------------------
# 3) 특정 번호 상태 변경 (call / skip / delete)
# PUT /waiting/{service_name}/{ticket_number}/{action}
# -------------------------------------
@router.put("/{service_name}/{ticket_number}/{action}")
def update_state(service_name: str, ticket_number: int, action: str, db: Session = Depends(get_db)):
    mapping = {
        "call": "called",
        "skip": "skipped",
        "delete": "deleted",
    }

    if action not in mapping:
        return {"error": "Invalid action"}

    return crud.update_status(db, service_name, ticket_number, mapping[action])
