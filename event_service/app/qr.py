import secrets
import app.config as config

def generate_qr_token() -> str:
    # 96-bit random token, URL-safe
    return secrets.token_urlsafe(16)

def build_share_url(event_id: int, qr_token: str) -> str:
    # Frontend/gateway sẽ đọc token này để hiển thị album event
    return f"{config.SERVICE_BASE_URL}/share/events/{event_id}?token={qr_token}"