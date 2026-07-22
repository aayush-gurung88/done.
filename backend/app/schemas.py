from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, List

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Entry Schemas
class EntryBase(BaseModel):
    date: date
    content: str

class EntryCreate(EntryBase):
    pass

class EntryUpdate(BaseModel):
    content: str

class EntryResponse(EntryBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None