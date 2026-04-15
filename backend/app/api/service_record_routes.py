from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.dependencies import get_current_user
from app.db.session import get_session
from app.models.client import Client
from app.models.service import Service
from app.models.service_record import ServiceRecord
from app.models.user import User
from app.schemas.service_record import ServiceRecordCreate, ServiceRecordResponse

router = APIRouter(prefix="/service-records", tags=["Service Records"])


@router.post("/", response_model=ServiceRecordResponse, status_code=201)
def create_service_record(
    record_data: ServiceRecordCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    client = session.exec(
        select(Client).where(
            Client.id == record_data.client_id,
            Client.user_id == current_user.id,
        )
    ).first()

    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")

    service = session.exec(
        select(Service).where(
            Service.id == record_data.service_id,
            Service.user_id == current_user.id,
        )
    ).first()

    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado.")

    service_record = ServiceRecord(
        description=record_data.description,
        service_date=record_data.service_date,
        amount=record_data.amount,
        payment_status=record_data.payment_status,
        client_id=record_data.client_id,
        service_id=record_data.service_id,
        user_id=current_user.id,
    )

    session.add(service_record)
    session.commit()
    session.refresh(service_record)

    return service_record


@router.get("/", response_model=list[ServiceRecordResponse])
def list_service_records(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(ServiceRecord).where(ServiceRecord.user_id == current_user.id)
    records = session.exec(statement).all()

    return records


@router.get("/{record_id}", response_model=ServiceRecordResponse)
def get_service_record(
    record_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(ServiceRecord).where(
        ServiceRecord.id == record_id,
        ServiceRecord.user_id == current_user.id,
    )
    record = session.exec(statement).first()

    if not record:
        raise HTTPException(status_code=404, detail="Lançamento não encontrado.")

    return record