from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, ExpiredSignatureError, JWTError
from typing import Dict, Any, Optional
import app.config as config

# Scheme bắt buộc (Mặc định báo lỗi nếu thiếu token)
bearer_scheme = HTTPBearer(auto_error=True)

# Scheme tùy chọn (Không báo lỗi nếu thiếu token, trả về None)
bearer_scheme_optional = HTTPBearer(auto_error=False)

def decode_and_validate_token(token: str) -> Dict[str, Any]:
    """Hàm phụ trợ để giải mã và kiểm tra token"""
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        user_id = payload.get("sub")
        username = payload.get("username")
        email = payload.get("email")
        role = payload.get("role")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )

        return {
            "user_id": int(user_id),
            "username": username,
            "email": email,
            "role": role
        }
    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

def get_current_user(auth: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> Dict[str, Any]:
    """Dùng cho các route BẮT BUỘC đăng nhập"""
    return decode_and_validate_token(auth.credentials)

def get_current_user_optional(auth: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme_optional)) -> Optional[Dict[str, Any]]:
    """Dùng cho các route cho phép cả GUEST (quét mã QR) và USER"""
    if auth is None:
        return None
    try:
        return decode_and_validate_token(auth.credentials)
    except HTTPException:
        # Nếu gửi token nhưng token lỗi (hết hạn/sai), vẫn trả về None 
        # để coi như là khách chưa login
        return None