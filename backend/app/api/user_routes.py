from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.security import get_password_hash
from app.db.session import get_session
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix='/users', tags=['Users'])


@router.post('/', response_model=UserResponse, status_code=201)
def create_user(user_data: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(
        select(User).where(User.email == user_data.email)
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail='E-mail ja cadastrado.')
    
    hashed_password = get_password_hash(user_data.password)

    user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=hashed_password,
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return user