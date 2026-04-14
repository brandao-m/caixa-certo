from datetime import datetime

from pydantic import EmailStr
from sqlmodel import SQLModel


class UserCreate(SQLModel):
    full_name: str
    email: EmailStr
    password: str


class UserResponse(SQLModel):
    id: int
    full_name: str
    email: EmailStr
    created_at: datetime