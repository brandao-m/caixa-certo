from fastapi import FastAPI

from app.api.user_routes import router as user_router
from app.db.init_db import create_db_and_tables

app = FastAPI(
    title='CaixaCerto-API',
    version='0.1.0',
)

@app.on_event('startup')
def on_startup():
    create_db_and_tables()

app.include_router(user_router)


@app.get('/')
def read_root():
    return {'message:' 'CaixaCerto API online'}