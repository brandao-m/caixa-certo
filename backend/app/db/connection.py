from sqlmodel import create_engine

from app.core.config import settings

DATABASE_URL = (
    f'postgresql://{settings.DATABASE_USER}:{settings.DATABASE_PASSWORD}'
    f'@{settings.DATABASE_HOST}:{settings.DATABASE_PORT}/{settings.DATABASE_NAME}'
)

engine = create_engine(DATABASE_URL, echo=True)