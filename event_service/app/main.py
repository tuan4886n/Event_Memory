from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.db import Base, engine
from app.routes import router as event_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine, checkfirst=True)
    yield

app = FastAPI(title="Event Service", version="0.1.0", lifespan=lifespan)

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(event_router)