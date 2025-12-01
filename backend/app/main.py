from fastapi import FastAPI
from .database import Base, engine
from .routers import waiting, admin

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
