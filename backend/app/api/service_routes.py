from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select

from app.core.dependencies import get_current_user
from app.db.session import get_session
from app.models.service import Service
from app.models.user import User
from app.schemas.service import ServiceCreate, ServiceResponse, ServiceUpdate

router = APIRouter(prefix="/services", tags=["Services"])


@router.post("/", response_model=ServiceResponse, status_code=201)
def create_service(
    service_data: ServiceCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    service = Service(
        name=service_data.name,
        description=service_data.description,
        default_price=service_data.default_price,
        user_id=current_user.id,
    )

    session.add(service)
    session.commit()
    session.refresh(service)

    return service


@router.get("/", response_model=list[ServiceResponse])
def list_services(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(Service).where(Service.user_id == current_user.id)
    services = session.exec(statement).all()

    return services


@router.get("/{service_id}", response_model=ServiceResponse)
def get_service(
    service_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(Service).where(
        Service.id == service_id,
        Service.user_id == current_user.id,
    )
    service = session.exec(statement).first()

    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado.")

    return service


@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    service_data: ServiceUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(Service).where(
        Service.id == service_id,
        Service.user_id == current_user.id,
    )
    service = session.exec(statement).first()

    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado.")

    service.name = service_data.name
    service.description = service_data.description
    service.default_price = service_data.default_price

    session.add(service)
    session.commit()
    session.refresh(service)

    return service


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    service_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(Service).where(
        Service.id == service_id,
        Service.user_id == current_user.id,
    )
    service = session.exec(statement).first()

    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado.")

    session.delete(service)
    session.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)