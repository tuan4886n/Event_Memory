from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from jose import jwt, JWTError
from app.config import SECRET_KEY, ALGORITHM
from app.models.user import User
from app.utils.db import get_db, Base, engine
from app.utils.security import (
    create_refresh_token,
    create_access_token,
    verify_token,
    hash_password,
    verify_password,
)

router = APIRouter()

# ------------------ SCHEMA ------------------
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "user"

class UserLogin(BaseModel):
    username: str
    password: str

# ------------------ ROUTES ------------------
@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = hash_password(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_pw,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "msg": "User created",
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "role": new_user.role
    }

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        db_user.id, db_user.username, db_user.email, db_user.role
    )
    refresh_token = create_refresh_token(
        db_user.id, db_user.username, db_user.email, db_user.role
    )
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "role": db_user.role,
        "email": db_user.email
    }

@router.get("/me")
def me(user: dict = Depends(verify_token)):
    return {
        "user_id": user["user_id"],
        "username": user["username"],
        "email": user["email"],
        "role": user["role"]
    }

@router.post("/refresh")
def refresh(refresh_token: str = Body(..., embed=True)):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")

        user_id = payload.get("sub")
        username = payload.get("username")
        email = payload.get("email")
        role = payload.get("role")

        new_access_token = create_access_token(user_id, username, email, role)
        return {"access_token": new_access_token}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")