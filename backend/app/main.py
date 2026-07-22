from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import users, entries

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="done. - Minimal Productivity Calendar API",
    description="A lightweight, intentional backend for logging daily completions.",
    version="1.0.0"
)

# Configure CORS for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this later when frontend port is set
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(entries.router)

@app.get("/")
def root():
    return {"status": "healthy", "message": "Welcome to the Done. API"}