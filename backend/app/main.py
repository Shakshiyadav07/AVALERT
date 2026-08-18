from fastapi import FastAPI

from app.database.database import Base, engine

from app.models import (
    User,
    SOS,
    RescueAssignment,
    ReliefResource
)

from app.routes.users import router as users_router
from app.routes.sos import router as sos_router
from app.routes.rescue import router as rescue_router
from app.routes.relief import router as relief_router
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AVALERT API",
    description="Backend API for the AVALERT disaster response platform",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(users_router)
app.include_router(sos_router)
app.include_router(
    rescue_router,
    prefix="/api",
)
app.include_router(relief_router)

@app.get("/")
def root():
    return {
        "message": "AVALERT Backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }