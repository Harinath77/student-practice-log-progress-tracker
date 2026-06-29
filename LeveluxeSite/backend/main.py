from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.routers import health, courses, instructors, schedule, enrollments, auth, admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run startup tasks: create DB tables and seed default admin."""
    try:
        from init_db import init_db
        init_db()
    except Exception as e:
        print(f"[Startup] DB initialization warning: {e}")
    yield  # Server runs here

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
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router)
app.include_router(courses.router, prefix="/api/v1")
app.include_router(instructors.router, prefix="/api/v1")
app.include_router(schedule.router, prefix="/api/v1")
app.include_router(enrollments.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {
        "message": f"Welcome to the {settings.PROJECT_NAME}!",
        "docs_url": "/docs",
        "health_check_url": "/health"
    }
