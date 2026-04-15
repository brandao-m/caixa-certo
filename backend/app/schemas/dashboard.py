from sqlmodel import SQLModel


class DashboardSummary(SQLModel):
    total_received: float
    total_pending: float
    total_expenses: float
    profit: float
    clients_count: int
    services_count: int
    service_records_count: int