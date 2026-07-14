from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionResponse, TransactionUpdate
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("", response_model=List[TransactionResponse])
def read_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    if current_user.role == "admin":
        return db.query(Transaction).all()
    return db.query(Transaction).filter(Transaction.user_id == current_user.id).all()

@router.post("", response_model=TransactionResponse)
def create_transaction(
    transaction_in: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    transaction = Transaction(
        **transaction_in.dict(),
        user_id=current_user.id
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

@router.put("/{id}", response_model=TransactionResponse)
def update_transaction(
    id: str,
    transaction_in: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    transaction = db.query(Transaction).filter(Transaction.id == id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if transaction.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = transaction_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(transaction, field, value)
        
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

@router.delete("/{id}")
def delete_transaction(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    transaction = db.query(Transaction).filter(Transaction.id == id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    if transaction.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(transaction)
    db.commit()
    return {"success": True}
