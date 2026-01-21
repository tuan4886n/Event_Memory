from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.staticfiles import StaticFiles
from app.db import Base, engine
from app.routes import album, media, health

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine, checkfirst=True)
    yield

app = FastAPI(title="Gallery Service", version="0.1.0", lifespan=lifespan)

app.include_router(health.router)
app.include_router(album.router)
app.include_router(media.router)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")