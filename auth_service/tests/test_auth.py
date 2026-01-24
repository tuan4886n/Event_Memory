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
    response = client.post("/auth/signup", json={
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "123",
        "role": "user"
    })
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["username"] == "testuser"
    assert data["email"] == "testuser@example.com"

def test_signup_duplicate(db: Session):
    payload = {
        "username": "dupuser",
        "email": "dup@example.com",
        "password": "123",
        "role": "user"
    }
    client.post("/auth/signup", json=payload)
    response = client.post("/auth/signup", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "User already exists"

def test_login_success(db: Session):
    client.post("/auth/signup", json={
        "username": "loginuser",
        "email": "login@example.com",
        "password": "123",
        "role": "user"
    })
    response = client.post("/auth/login", json={
        "username": "loginuser",
        "password": "123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data

def test_login_failure(db: Session):
    response = client.post("/auth/login", json={
        "username": "nouser",
        "password": "wrong"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"

def test_me_with_token(db: Session):
    # Tạo user
    signup_res = client.post("/auth/signup", json={
        "username": "meuser",
        "email": "me@example.com",
        "password": "123",
        "role": "user"
    })
    user_id = signup_res.json()["id"]

    # Lấy token
    login_res = client.post("/auth/login", json={
        "username": "meuser",
        "password": "123"
    })
    token = login_res.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/auth/me", headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "meuser"
    assert data["user_id"] == user_id
    assert data["email"] == "me@example.com"

def test_me_without_token(db: Session):
    response = client.get("/auth/me")
    assert response.status_code == 401
    assert "detail" in response.json()

def test_refresh_token_success(db: Session):
    client.post("/auth/signup", json={
        "username": "refreshuser",
        "email": "refresh@example.com",
        "password": "123",
        "role": "user"
    })
    login_res = client.post("/auth/login", json={
        "username": "refreshuser",
        "password": "123"
    })
    refresh_token = login_res.json()["refresh_token"]

    response = client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_refresh_token_invalid(db: Session):
    response = client.post("/auth/refresh", json={"refresh_token": "invalidtoken"})
    assert response.status_code == 401

def test_password_is_hashed(db: Session):
    client.post("/auth/signup", json={
        "username": "hashuser",
        "email": "hash@example.com",
        "password": "123",
        "role": "user"
    })
    user = db.query(User).filter(User.username == "hashuser").first()
    assert user is not None
    assert user.password != "123"
    from app.utils.security import verify_password
    assert verify_password("123", user.password)