from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()


# =========================================================
# CORS - Allow React Frontend
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# HOME API
# =========================================================

@app.get("/")
def home():
    return {
        "message": "AVALERT Backend is running successfully!"
    }


# =========================================================
# USER REGISTRATION
# =========================================================

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


# Temporary user storage
# Later we can replace this with a real database.
users = []


@app.post("/register")
def register_user(user: RegisterRequest):

    # Check whether email already exists
    for existing_user in users:
        if existing_user["email"] == user.email:
            return {
                "success": False,
                "message": "Email already registered."
            }

    # Create user
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": user.password
    }

    users.append(new_user)

    print("NEW USER REGISTERED:", user.email)

    return {
        "success": True,
        "message": "Account created successfully!",
        "user": {
            "name": user.name,
            "email": user.email
        }
    }


# =========================================================
# LOGIN
# =========================================================

class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/login")
def login_user(user: LoginRequest):

    for existing_user in users:

        if (
            existing_user["email"] == user.email
            and existing_user["password"] == user.password
        ):

            return {
                "success": True,
                "message": "Login successful!",
                "user": {
                    "name": existing_user["name"],
                    "email": existing_user["email"]
                }
            }

    return {
        "success": False,
        "message": "Invalid email or password."
    }


# =========================================================
# SOS
# =========================================================

class SOSRequest(BaseModel):
    name: str
    location: str
    people: int
    injured: int
    description: str


@app.post("/sos")
def handle_sos(sos: SOSRequest):

    print("SOS RECEIVED:", sos)

    return {
        "success": True,
        "message": "SOS received successfully!",
        "sos_data": {
            "name": sos.name,
            "location": sos.location,
            "people": sos.people,
            "injured": sos.injured,
            "description": sos.description
        }
    }


# =========================================================
# I'M SAFE
# =========================================================

class SafeRequest(BaseModel):
    name: str
    location: str


@app.post("/safe")
def mark_safe(safe: SafeRequest):

    print("SAFE STATUS RECEIVED:", safe)

    return {
        "success": True,
        "message": "Safe status received successfully!",
        "safe_data": {
            "name": safe.name,
            "location": safe.location
        }
    }