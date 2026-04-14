from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import InvalidTokenError 
from sqlmodel import Session, select

import jwt 

from app.core.config import settings
from app.db.session import get_session
from app.models.user import User

security = HTTPBearer()

def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        session: Session = Depends(get_session),
) -> User:
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        user_email = payload.get('sub')
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail='Token invalido.')
    
    if not user_email:
        raise HTTPException(status_code=401, detail='Token invalido')
    
    user = session.exec(select(User).where(User.email == user_email)).first()

    if not user:
        raise HTTPException(status_code=401, detail='Usuario nao encontrado.')
    
    return user