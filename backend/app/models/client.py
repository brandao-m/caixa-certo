from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel

class Client(SQLModel, table=True):
    __tablename__ = 'clients'

    id: Optional[int] = Field(default=None, primary_key=True)
    full_name : str = Field(max_length=255)
    email: Optional[str] = Field(default=None, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=20)
    notes: Optional[str] = Field(default=None, max_length=500)
    user_id: int = Field(foreign_key='users.id', index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)