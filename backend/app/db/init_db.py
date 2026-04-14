from sqlmodel import SQLModel

from app.db.base import *
from app.db.connection import engine


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)