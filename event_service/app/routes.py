from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.db import get_db
from app.models import Event
from app.schemas import EventCreate, EventRead, EventUpdate, QRResponse
from app.auth import get_current_user
from app.qr import generate_qr_token, build_share_url

router = APIRouter(prefix="/events", tags=["events"])

@router.post("", response_model=EventRead, status_code=status.HTTP_201_CREATED)
def create_event(payload: EventCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    ev = Event(
        title=payload.title,
        description=payload.description,
        event_date=payload.event_date,
        location=payload.location,
        access_level=payload.access_level or "private",
        created_by=user["user_id"]
    )
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev

@router.get("/{event_id}", response_model=EventRead)
def get_event(event_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    ev = db.query(Event).filter(Event.id == event_id).first()
    if not ev:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    # Private event: chỉ người tạo xem; Public: ai có token xem qua share flow
    if ev.access_level == "private" and ev.created_by != user["user_id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    return ev

@router.get("", response_model=List[EventRead])
def list_events(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None
):
    q = db.query(Event).filter(Event.created_by == user["user_id"])
    if date_from:
        q = q.filter(Event.event_date >= date_from)
    if date_to:
        q = q.filter(Event.event_date <= date_to)
    return q.order_by(Event.event_date.desc()).all()

@router.patch("/{event_id}", response_model=EventRead)
def update_event(event_id: int, payload: EventUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    ev = db.query(Event).filter(Event.id == event_id).first()
    if not ev:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    if ev.created_by != user["user_id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(ev, field, value)
    db.commit()
    db.refresh(ev)
    return ev

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    ev = db.query(Event).filter(Event.id == event_id).first()
    if not ev:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    if ev.created_by != user["user_id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    db.delete(ev)
    db.commit()
    return

@router.post("/{event_id}/qr", response_model=QRResponse)
def generate_event_qr(event_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    ev = db.query(Event).filter(Event.id == event_id).first()
    if not ev:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    if ev.created_by != user["user_id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    token = generate_qr_token()
    ev.qr_token = token
    db.commit()
    db.refresh(ev)

    share_url = build_share_url(ev.id, token)
    return QRResponse(event_id=ev.id, qr_token=token, share_url=share_url)

@router.get("/share/{event_id}", response_model=EventRead)
def access_event_via_qr(event_id: int, token: str, db: Session = Depends(get_db)):
    ev = db.query(Event).filter(Event.id == event_id).first()
    if not ev:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    # Chỉ cho phép truy cập nếu event public hoặc token khớp
    if ev.access_level != "public":
        if not ev.qr_token or ev.qr_token != token:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid or missing QR token")

    return ev