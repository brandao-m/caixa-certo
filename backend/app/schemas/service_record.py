from datetime import date, datetime
from typing import Literal, Optional

from sqlmodel import Field, SQLModel


class ServiceRecordCreate(SQLModel):
    description: Optional[str] = Field(default=None, max_length=500)
    service_date: date
    amount: float = Field(ge=0)
    payment_status: Literal['pendente', 'pago'] = 'pendente'
    client_id: int
    service_id: int


class ServiceRecordResponse(SQLModel):
    id: int
    description: Optional[str]
    service_date: date
    amount: float
    payment_status: str
    client_id: int
    service_id: int
    created_at: datetime