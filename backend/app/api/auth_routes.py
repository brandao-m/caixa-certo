from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.security import create_access_token, verify_password
from app.db.session import get_session
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter(prefix='/auth', tags=['Auth'])

@router.post('/login', response_model=TokenResponse)
def login(login_data: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(
        select(User).where(User.email == login_data.email)
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail='Credenciais invalidas.')
    
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail='Credenciais invalidas.')
    
    access_token = create_access_token(subject=user.email)

    return {
        'access_token': access_token,
        'token_type': 'bearer',
    }