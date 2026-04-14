from datetime import datetime

from pydantic import EmailStr
from sqlmodel import Field, SQLModel


class UserCreate(SQLModel):
    full_name: str = Field(max_length=255)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)


class UserResponse(SQLModel):
    id: int
    full_name: str
    email: EmailStr
    created_at: datetime