# Project: [Python API Name]

## Overview

[Describe the API]

## Tech Stack

- **Language:** Python 3.11+
- **Framework:** [e.g. FastAPI / Django]
- **Database:** [e.g. PostgreSQL via SQLAlchemy]
- **Testing:** pytest
- **Deployment:** [e.g. Docker / Railway]

## Project Structure

```
app/
├── api/          # Route handlers / views
├── models/       # Database models
├── schemas/      # Pydantic schemas / serializers
├── services/     # Business logic layer
├── core/         # Config, database, security
└── tests/        # Tests mirror app structure
```

## Python Conventions

- Type hints everywhere — use `from __future__ import annotations`
- Prefer dataclasses or Pydantic models over raw dicts for structured data
- Use `pathlib` not `os.path`
- f-strings for string formatting
- Context managers for resource management

## FastAPI Specifics (if applicable)

- Put business logic in services, not route handlers
- Use dependency injection for DB sessions and auth
- Validate with Pydantic — don't do manual validation
- Return appropriate HTTP status codes, not just 200 always

## Testing

- Use `pytest` with `pytest-asyncio` for async tests
- Use fixtures for database setup/teardown
- Test the API layer with `httpx.AsyncClient`

## Active Skills

- `code-quality`
- `git-conventions`
- `testing-practices`
