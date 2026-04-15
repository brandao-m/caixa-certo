from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select

from app.core.dependencies import get_current_user
from app.db.session import get_session
from app.models.expense import Expense
from app.models.user import User
from app.schemas.expense import ExpenseCreate, ExpenseResponse, ExpenseUpdate

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("/", response_model=ExpenseResponse, status_code=201)
def create_expense(
    expense_data: ExpenseCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    expense = Expense(
        description=expense_data.description,
        amount=expense_data.amount,
        expense_date=expense_data.expense_date,
        category=expense_data.category,
        user_id=current_user.id,
    )

    session.add(expense)
    session.commit()
    session.refresh(expense)

    return expense


@router.get("/", response_model=list[ExpenseResponse])
def list_expenses(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(Expense).where(Expense.user_id == current_user.id)
    expenses = session.exec(statement).all()

    return expenses


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(Expense).where(
        Expense.id == expense_id,
        Expense.user_id == current_user.id,
    )
    expense = session.exec(statement).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Despesa não encontrada.")

    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(Expense).where(
        Expense.id == expense_id,
        Expense.user_id == current_user.id,
    )
    expense = session.exec(statement).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Despesa não encontrada.")

    expense.description = expense_data.description
    expense.amount = expense_data.amount
    expense.expense_date = expense_data.expense_date
    expense.category = expense_data.category

    session.add(expense)
    session.commit()
    session.refresh(expense)

    return expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(Expense).where(
        Expense.id == expense_id,
        Expense.user_id == current_user.id,
    )
    expense = session.exec(statement).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Despesa não encontrada.")

    session.delete(expense)
    session.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)