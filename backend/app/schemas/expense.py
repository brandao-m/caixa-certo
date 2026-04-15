from datetime import date, datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class ExpenseCreate(SQLModel):
    description: str = Field(max_length=255)
    amount: float = Field(ge=0)
    expense_date: date
    category: Optional[str] = Field(default=None, max_length=100)


class ExpenseUpdate(SQLModel):
    description: str = Field(max_length=255)
    amount: float = Field(ge=0)
    expense_date: date
    category: Optional[str] = Field(default=None, max_length=100)


class ExpenseResponse(SQLModel):
    id: int
    description: str
    amount: float
    expense_date: date
    category: Optional[str]
    created_at: datetime