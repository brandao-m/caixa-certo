from datetime import date, datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Expense(SQLModel, table=True):
    __tablename__ = 'expenses'

    id: Optional[int] = Field(default=None, primary_key=True)
    description: str = Field(max_length=255)
    amount: float = Field(ge=0)
    expense_date: date
    category: Optional[str] = Field(default=None, max_length=100)
    user_id: int = Field(foreign_key='users.id', index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)