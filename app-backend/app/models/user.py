from uuid import uuid4
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: f"u_{uuid4().hex[:8]}")
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)

    transactions = relationship("Transaction", back_populates="owner", cascade="all, delete-orphan")
