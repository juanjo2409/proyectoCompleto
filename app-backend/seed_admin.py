import sys
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def seed_admin():
    db = SessionLocal()
    existing_admin = db.query(User).filter(User.username == "admin").first()
    if existing_admin:
        print("Admin ya existe.")
        return
        
    admin_user = User(
        username="admin",
        password_hash=get_password_hash("admin123"),
        role="admin"
    )
    db.add(admin_user)
    db.commit()
    print("Admin creado exitosamente.")

if __name__ == "__main__":
    seed_admin()
