from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select

from app.core.dependencies import get_current_user
from app.db.session import get_session
from app.models.client import Client
from app.models.expense import Expense
from app.models.service import Service
from app.models.service_record import ServiceRecord
from app.models.user import User
from app.schemas.dashboard import DashboardSummary

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    paid_statement = select(ServiceRecord).where(
        ServiceRecord.user_id == current_user.id,
        ServiceRecord.payment_status == "pago",
    )

    pending_statement = select(ServiceRecord).where(
        ServiceRecord.user_id == current_user.id,
        ServiceRecord.payment_status == "pendente",
    )

    expense_statement = select(Expense).where(
        Expense.user_id == current_user.id
    )

    if start_date:
        paid_statement = paid_statement.where(ServiceRecord.service_date >= start_date)
        pending_statement = pending_statement.where(ServiceRecord.service_date >= start_date)
        expense_statement = expense_statement.where(Expense.expense_date >= start_date)

    if end_date:
        paid_statement = paid_statement.where(ServiceRecord.service_date <= end_date)
        pending_statement = pending_statement.where(ServiceRecord.service_date <= end_date)
        expense_statement = expense_statement.where(Expense.expense_date <= end_date)

    paid_records = session.exec(paid_statement).all()
    pending_records = session.exec(pending_statement).all()
    expenses = session.exec(expense_statement).all()

    clients_count = len(
        session.exec(
            select(Client).where(Client.user_id == current_user.id)
        ).all()
    )

    services_count = len(
        session.exec(
            select(Service).where(Service.user_id == current_user.id)
        ).all()
    )

    service_records_count = len(
        session.exec(
            select(ServiceRecord).where(ServiceRecord.user_id == current_user.id)
        ).all()
    )

    total_received = sum(record.amount for record in paid_records)
    total_pending = sum(record.amount for record in pending_records)
    total_expenses = sum(expense.amount for expense in expenses)
    profit = total_received - total_expenses

    return DashboardSummary(
        total_received=total_received,
        total_pending=total_pending,
        total_expenses=total_expenses,
        profit=profit,
        clients_count=clients_count,
        services_count=services_count,
        service_records_count=service_records_count,
    )