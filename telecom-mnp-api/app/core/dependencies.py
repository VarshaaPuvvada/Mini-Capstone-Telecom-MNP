from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException,status
from jose import jwt, JWTError
from app.core.config import settings
from app.core.security import decode_access_token

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
def get_current_customer(user=Depends(get_current_user)):
    if user["role"] != "customer":
        raise HTTPException(status_code=403, detail="Customer access only")
    return user


def get_current_agent(user=Depends(get_current_user)):
    if user["role"] != "agent":
        raise HTTPException(status_code=403, detail="Agent access only")
    return user


def get_current_admin(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")
    return user


async def get_current_admin_or_agent(token: str = Depends(security)):
    payload = decode_access_token(token.credentials)
    role = payload.get("role")
    if role not in ["admin", "agent"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Admin or Agent only"
        )
    return payload