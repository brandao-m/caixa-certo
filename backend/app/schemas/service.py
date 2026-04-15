from datetime import datetime 
from typing import Optional

from sqlmodel import Field, SQLModel


class ServiceCreate(SQLModel):
    name: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=500)
    default_price: float = Field(ge=0)


class ServiceResponse(SQLModel):
    id: int
    name: str
    description: Optional[str]
    default_price: float
    created_at: datetime