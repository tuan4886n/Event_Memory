from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError, ExpiredSignatureError
from typing import Dict, Any
import app.config as config

bearer_scheme = HTTPBearer(auto_error=True)

def get_current_user(auth: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> Dict[str, Any]:
    token = auth.credentials
    try:
        payload = jwt.decode(
            token,
            config.SECRET_KEY,
            algorithms=[config.ALGORITHM]
        )
        return {
            "user_id": int(payload.get("sub")),
            "username": payload.get("username")
        }
    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")