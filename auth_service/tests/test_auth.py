import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.user import User
from app.utils.db import Base, SessionLocal, engine, get_db
from sqlalchemy.orm import Session

client = TestClient(app)

@pytest.fixture(name="db", scope="function")
def database_fixture():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    app.dependency_overrides[get_db] = lambda: db
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
        del app.dependency_overrides[get_db]

def test_signup_success(db: Session):
    response = client.post("/auth/signup", json={"username":"testuser","password":"123"})
    assert response.status_code == 200
    assert "id" in response.json()

def test_signup_duplicate(db: Session):
    client.post("/auth/signup", json={"username":"dupuser","password":"123"})
    response = client.post("/auth/signup", json={"username":"dupuser","password":"123"})
    assert response.status_code == 400
    assert response.json()["detail"] == "User already exists"

def test_login_success(db: Session):
    client.post("/auth/signup", json={"username":"loginuser","password":"123"})
    response = client.post("/auth/login", json={"username":"loginuser","password":"123"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_failure(db: Session):
    response = client.post("/auth/login", json={"username":"nouser","password":"wrong"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"

def test_me_with_token(db: Session):
    signup_response = client.post("/auth/signup", json={"username":"meuser","password":"123"})
    user_id = signup_response.json()["id"]

    token = client.post("/auth/login", json={"username":"meuser","password":"123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/auth/me", headers=headers)

    assert response.status_code == 200
    assert response.json()["username"] == "meuser"
    assert response.json()["user_id"] == user_id

def test_me_without_token(db: Session):
    response = client.get("/auth/me")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

def test_refresh_token_success(db: Session):
    client.post("/auth/signup", json={"username":"refreshuser","password":"123"})
    login_response = client.post("/auth/login", json={"username":"refreshuser","password":"123"})
    refresh_token = login_response.json()["refresh_token"]

    response = client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["access_token"] != login_response.json()["access_token"]

def test_refresh_token_invalid(db: Session):
    response = client.post("/auth/refresh", json={"refresh_token": "invalidtoken"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid refresh token"

def test_password_is_hashed(db: Session):
    client.post("/auth/signup", json={"username":"hashuser","password":"123"})
    user = db.query(User).filter(User.username=="hashuser").first()
    assert user.password != "123"
    from app.utils.security import verify_password
    assert verify_password("123", user.password)