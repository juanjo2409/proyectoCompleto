from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, Float, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, default=lambda: f"tx_{uuid4().hex[:8]}")
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)  # 'income' or 'expense'
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    date = Column(String, nullable=False)  # ISO string
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="transactions")
