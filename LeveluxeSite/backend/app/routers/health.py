from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

router = APIRouter(prefix="/health", tags=["health"])

@router.get("")
def health_check(db: Session = Depends(get_db)):
    db_status = "unhealthy"
    error_detail = None
    try:
        # Perform a quick SELECT 1 query to check db connectivity
        db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception as e:
        error_detail = str(e)

    response = {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "database": db_status,
        "api": "ok"
    }
    if error_detail:
        response["error"] = error_detail
        
    return response
