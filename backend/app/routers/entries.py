from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
import os

from .. import models, schemas, database, auth

router = APIRouter(
    prefix="/entries",
    tags=["Entries"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("", response_model=schemas.EntryResponse, status_code=status.HTTP_201_CREATED)
def create_entry(entry: schemas.EntryCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    # Check if an entry already exists for this date and user
    existing_entry = db.query(models.Entry).filter(
        models.Entry.user_id == current_user.id,
        models.Entry.date == entry.date
    ).first()
    
    if existing_entry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An entry already exists for this date. Use PUT to update it."
        )

    new_entry = models.Entry(**entry.model_dump(), user_id=current_user.id)
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

@router.get("", response_model=List[schemas.EntryResponse])
def read_entries(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Entry).filter(models.Entry.user_id == current_user.id).order_by(models.Entry.date.desc()).all()

@router.put("/{entry_id}", response_model=schemas.EntryResponse)
def update_entry(entry_id: int, entry_update: schemas.EntryUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    db_entry = db.query(models.Entry).filter(models.Entry.id == entry_id, models.Entry.user_id == current_user.id).first()
    if not db_entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    
    db_entry.content = entry_update.content
    db.commit()
    db.refresh(db_entry)
    return db_entry