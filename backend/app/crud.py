from sqlalchemy.orm import Session
from . import models


# ------------------------------------------
# 서비스 조회 또는 생성
# ------------------------------------------
def get_or_create_service(db: Session, service_name: str):
    svc = db.query(models.WaitingService).filter(models.WaitingService.name == service_name).first()

    if svc:
        return svc

    # 없으면 새 서비스 생성
    svc = models.WaitingService(name=service_name, last_number=0)
    db.add(svc)
    db.commit()
    db.refresh(svc)
    return svc


# ------------------------------------------
# 대기 등록
# ------------------------------------------
def create_waiting(db: Session, service_name: str, people: int):
    svc = get_or_create_service(db, service_name)

    # 서비스별 새로운 번호 배정
    new_ticket = svc.last_number + 1
    svc.last_number = new_ticket  # 업데이트

    entry = models.Waiting(
        service_id=svc.id,
        ticket_number=new_ticket,
        people=people,
        status="active"
    )

    db.add(entry)
    db.commit()
    db.refresh(entry)
    db.commit()

    return entry


# ------------------------------------------
# 특정 서비스의 전체 대기열
# ------------------------------------------
def get_waiting_list(db: Session, service_name: str):
    svc = get_or_create_service(db, service_name)

    items = (
        db.query(models.Waiting)
        .filter(models.Waiting.service_id == svc.id)
        .order_by(models.Waiting.ticket_number.asc())
        .all()
    )

    return items


# ------------------------------------------
# 상태 변경
# ------------------------------------------
def update_status(db: Session, service_name: str, ticket_number: int, new_status: str):
    svc = get_or_create_service(db, service_name)

    item = (
        db.query(models.Waiting)
        .filter(models.Waiting.service_id == svc.id)
        .filter(models.Waiting.ticket_number == ticket_number)
        .first()
    )

    if not item:
        return None

    item.status = new_status
    db.commit()
    db.refresh(item)
    return item


# def create_waiting(db: Session, people: int):
#     new = models.Waiting(people=people)
#     db.add(new)
#     db.commit()
#     db.refresh(new)
#     return new

def get_all_waiting(db: Session):
    return db.query(models.Waiting).order_by(models.Waiting.id.asc()).all()

# def update_status(db: Session, waiting_id: int, status: str):
#     item = db.query(models.Waiting).filter(models.Waiting.id == waiting_id).first()
#     if item:
#         item.status = status
#         db.commit()
#         db.refresh(item)
#     return item

def delete_waiting(db: Session, waiting_id: int):
    item = db.query(models.Waiting).filter(models.Waiting.id == waiting_id).first()
    if item:
        db.delete(item)
        db.commit()
    return item