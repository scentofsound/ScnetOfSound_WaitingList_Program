from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import schemas, crud

# router 파일 이름이 send_sms.py라고 가정
router = APIRouter(prefix="/send_sms", tags=["Sendsms"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# [수정 포인트]
# 1. 입력 타입: req: schemas.SMSRequest (id, status 요구 안 함)
# 2. response_model: 일단 제거 (crud에서 딕셔너리를 리턴하므로 자동 변환됨)
@router.post("/")
def send_sms(req: schemas.SMSRequest, db: Session = Depends(get_db)):
    return crud.send_sms(db, req.phone, req.people)