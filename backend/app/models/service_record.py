from datetime import date, datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class ServiceRecord(SQLModel, table=True):
    __tablename__ = 'services_records'

    id: Optional[int] = Field(default=None, primary_key=True)
    description: Optional[str] = Field(default=None, max_length=500)
    service_date: date
    amount: float = Field(ge=0)
    payment_status: str = Field(default='pending', max_length=20)
    client_id: int = Field(foreign_key='clients.id', index=True)
    service_id: int = Field(foreign_key='services.id', index=True)
    user_id: int = Field(foreign_key='users.id', index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)