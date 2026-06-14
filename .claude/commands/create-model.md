# create-model

Add or update a SQLAlchemy model in `flask_server/app.py` following project type conventions, and update `docs/database.md`.

## Usage

```
/create-model name="<ModelName>" fields="<field:type, ...>" [relationships="<rel>"] [reason="<why>"]
```

## Behavior

1. Read `CLAUDE.md`, `docs/database.md`, `flask_server/app.py`.
2. Check if the model already exists — if so, update rather than replace.
3. Check if the change requires a migration (Alembic) — flag if Alembic is not yet installed.
4. Implement the model using the type rules below.
5. Update `docs/database.md` schema table.
6. If Alembic is installed, generate a migration via `create-migration`.

## Type Rules

| Data | SQLAlchemy Type |
|---|---|
| Short string (name, label) | `String(100)` or `String(150)` |
| Email | `String(150)`, add `unique=True` if identity field |
| Long text | `Text` |
| Boolean (yes/no, true/false) | `Boolean` — never `String` |
| Integer count / ID | `Integer` |
| Money / price | `Numeric(12, 2)` — never `String` |
| Timestamp | `DateTime`, default `func.now()` |
| Enum / fixed choices | `String(N)` with a comment listing valid values (full Enum type in V2) |
| Foreign key | `Integer, ForeignKey('table.id')` with `relationship()` |

## Required Columns (all new tables)

```python
created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=False)
```

## Rules

- Never use `String` for booleans or money — this is a known V1 defect, do not perpetuate it.
- Every new table must have `created_at` and `updated_at`.
- Never run `db.drop_all()` — it destroys production data.
- Column removal requires checking all code that reads that column first.
- Schema changes without Alembic in V1 are applied via `db.create_all()` (add-only — cannot drop or alter).

## Output

- Model definition
- Migration note (required / not required / Alembic not installed)
- `docs/database.md` update
- Files changed
