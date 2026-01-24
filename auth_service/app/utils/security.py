import bcrypt
from jose import jwt, JWTError
import uuid
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# Khai báo OAuth2 scheme để lấy token từ header Authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )

def create_access_token(user_id: int, username: str, email: str, role: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "username": username,
        "email": email,
        "role": role,
        "exp": expire,
        "iat": datetime.utcnow(),   # thời điểm tạo
        "jti": str(uuid.uuid4())    # mã ngẫu nhiên
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(user_id: int, username: str, email: str, role: str):
    expire = datetime.utcnow() + timedelta(days=7)  # refresh token thường dài hơn
    payload = {
        "sub": str(user_id),
        "username": username,
        "email": email,
        "role": role,
        "exp": expire,
        "iat": datetime.utcnow(),
        "jti": str(uuid.uuid4()),
        "type": "refresh"
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        username: str = payload.get("username")
        email: str = payload.get("email")
        role: str = payload.get("role")

        if user_id is None or username is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return {
            "user_id": int(user_id),
            "username": username,
            "email": email,
            "role": role
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")