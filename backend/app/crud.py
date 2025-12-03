from sqlalchemy.orm import Session
from . import models
import requests
import os

ALIGO_API_KEY = "7fxqriwwmynhxg5q9j1f162c90p8d63s"
ALIGO_USER_ID = "sos925"
ALIGO_SENDER = "010-2736-5015"

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




def send_sms(db: Session, phone: str, people: int):
    new_sms = models.SMS_Log(
        phone=phone,
        people=people,
    )
    db.add(new_sms)
    db.commit()
    db.refresh(new_sms) # DB에서 생성된 ID(대기번호)를 가져오기 위해 새로고침

    sms_url = "https://apis.aligo.in/send/"
    
    # 보낼 메시지 내용 구성
    message = f"[웨이팅 등록 완료]\n대기번호: X번\n인원: {people}명\n잠시만 기다려주세요!"

    payload = {
        "key": ALIGO_API_KEY,
        "user_id": ALIGO_USER_ID,
        "sender": ALIGO_SENDER,
        "receiver": phone,
        "msg": message,
        "testmode_yn": "Y"  # 테스트 모드: Y (실제 발송 안됨). 배포 시 "N"으로 변경!
    }

    try:
        # 알리고 서버로 전송
        response = requests.post(sms_url, data=payload)
        sms_result = response.json()
        print("알리고 응답:", sms_result) # 로그 확인용

    except Exception as e:
        print(f"문자 전송 중 에러 발생: {e}")
        sms_result = {"error": str(e)}

        # 문자가 실패해도 웨이팅 등록은 성공처리 (필요하면 로직 변경 가능)

    return {
        "message": "문자 전송 요청 완료",
        "data": {
            "log_id": new_sms.id,
            "phone": new_sms.phone
        },
        "sms_status": sms_result.get("result_code") 
    }
