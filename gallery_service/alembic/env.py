import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Import Base từ project
from app.db import Base
import app.models

# Alembic Config object
config = context.config

# Lấy URL từ biến môi trường (Docker/Jenkins cấp)
db_url = os.getenv("DATABASE_URL")
if db_url:
    # Nếu có biến môi trường, ghi đè giá trị trong file alembic.ini
    config.set_main_option("sqlalchemy.url", db_url)
# ---------------------------

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata cho autogenerate
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    # Lấy cấu hình từ section [alembic] trong file .ini
    configuration = config.get_section(config.config_ini_section, {})
    
    # Đảm bảo sqlalchemy.url luôn được cập nhật từ biến môi trường nếu có
    if db_url:
        configuration["sqlalchemy.url"] = db_url

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()