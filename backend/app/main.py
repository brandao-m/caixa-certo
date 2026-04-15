from fastapi import FastAPI

from app.api.auth_routes import router as auth_router
from app.api.client_routes import router as client_router
from app.api.dashboard_routes import router as dashboard_router
from app.api.expense_routes import router as expense_router
from app.api.service_record_routes import router as service_record_router
from app.api.service_routes import router as service_router
from app.api.user_routes import router as user_router
from app.db.init_db import create_db_and_tables

app = FastAPI(
    title='CaixaCerto-API',
    version='0.1.0',
)

@app.on_event('startup')
def on_startup():
    create_db_and_tables()

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(client_router)
app.include_router(service_router)
app.include_router(service_record_router)
app.include_router(expense_router)
app.include_router(dashboard_router)


@app.get('/')
def read_root():
    return {'message:' 'CaixaCerto API online'}