from datetime import datetime   
from typing import Optional

from sqlmodel import Field, SQLModel


class Service(SQLModel, table=True):
    __tablename__ = 'services'

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=500)
    default_price: float = Field(default=0)
    user_id: int = Field(foreign_key='users.id', index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)