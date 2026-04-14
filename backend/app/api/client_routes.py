from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.core.dependencies import get_current_user
from app.db.session import get_session
from app.models.client import Client
from app.models.user import User
from app.schemas.client import ClientCreate, ClientResponse

router = APIRouter(prefix='/clients', tags=['Clients'])

@router.post('/', response_model=ClientResponse, status_code=201)
def create_client(
    client_data: ClientCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    client = Client(
        full_name=client_data.full_name,
        email=client_data.email,
        phone=client_data.phone,
        notes=client_data.notes,
        user_id=current_user.id,
    )

    session.add(client)
    session.commit()
    session.refresh(client)

    return client


@router.get('/', response_model=list[ClientResponse])
def list_clients(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    statement = select(Client).where(Client.user_id == current_user.id)
    clients = session.exec(statement).all()

    return clients


@router.get('/{client_id}', response_model=ClientResponse)
def get_client(
    client_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
): 
    statement = select(Client).where(
        Client.id == client_id,
        Client.user_id == current_user.id,
    )
    client = session.exec(statement).first()

    if not client:
        raise HTTPException(status_code=404, detail='Cliente não encontrado.')
    
    return client