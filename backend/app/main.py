from fastapi import FastAPI
from .database import Base, engine
from .routers import waiting, admin, send_sms


from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests  # 알리고 요청용
from . import models
from .database import engine, SessionLocal


# Create database tables
Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 나중엔 특정 도메인만 허용해도 됨
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(waiting.router)
app.include_router(admin.router)
app.include_router(send_sms.router)











# 4. DB 세션 의존성 함수



