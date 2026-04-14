from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class ClientCreate(SQLModel):
    full_name: str = Field(max_length=255)
    email: Optional[str] = Field(default=None, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=20)
    notes: Optional[str] = Field(default=None, max_length=500)


class ClientResponse(SQLModel):
    id: int
    full_name: str
    email: Optional[str]
    phone: Optional[str]
    notes: Optional[str]
    created_at: datetime