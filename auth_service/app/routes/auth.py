from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel
from jose import jwt, JWTError
from app.config import SECRET_KEY, ALGORITHM
from app.models.user import User
from app.utils.db import get_db, Base, engine
from app.utils.security import create_refresh_token, create_access_token, verify_token, hash_password, verify_password

# Tạo bảng nếu chưa có
Base.metadata.create_all(bind=engine, checkfirst=True)

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    password: str

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_pw = hash_password(user.password)
    new_user = User(username=user.username, password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "User created", "id": new_user.id}

@router.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(db_user.id, db_user.username)
    refresh_token = create_refresh_token(db_user.id, db_user.username)
    return {"access_token": access_token, "refresh_token": refresh_token}

@router.get("/me")
def me(user: dict = Depends(verify_token)):
    return {"user_id": user["user_id"], "username": user["username"]}

@router.post("/refresh")
def refresh(refresh_token: str = Body(..., embed=True)):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user_id = payload.get("sub")
        username = payload.get("username")
        new_access_token = create_access_token(user_id, username)
        return {"access_token": new_access_token}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")