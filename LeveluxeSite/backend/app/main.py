from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import health, courses, instructors, schedule

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Leveluxe Modern Music Academy",
    version="1.0.0"
)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router)
app.include_router(courses.router, prefix="/api/v1")
app.include_router(instructors.router, prefix="/api/v1")
app.include_router(schedule.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {
        "message": f"Welcome to the {settings.PROJECT_NAME}!",
        "docs_url": "/docs",
        "health_check_url": "/health"
    }

