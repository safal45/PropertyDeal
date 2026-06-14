# create-migration

Create an Alembic migration file for a schema change, following safe migration practices.

## Usage

```
/create-migration description="<what changes>" change="<add-column|drop-column|add-table|alter-column|add-index>"
```

## Behavior

1. Read `CLAUDE.md`, `docs/database.md`, `flask_server/app.py`.
2. Verify Alembic is installed (`flask_server/requirements.txt`). If not — stop, report that Alembic must be added first (V2 roadmap item 2.8).
3. Generate the migration file using `flask db migrate -m "<description>"` or equivalent.
4. Review the auto-generated migration for correctness — Alembic often misses renames and type changes.
5. Add a downgrade path (`op.drop_column`, `op.drop_table`, etc.) — migrations without a downgrade are not acceptable.
6. Update `docs/database.md` to reflect the schema change.

## Safety Rules

- **Never** use `op.drop_table` or `op.drop_column` on a table/column that still has application code reading it — verify first.
- **Never** add a `NOT NULL` column without a `server_default` or a data backfill step — it will fail on existing rows.
- **Never** run a migration against production without a backup.
- For SQLite (V1): Alembic has limited SQLite support (no `ALTER COLUMN`). Use `batch_alter_table` context manager for all SQLite schema changes.
- Rename operations must be two migrations: add new column → backfill data → drop old column. Never a single rename.

## SQLite Batch Alter Template

```python
with op.batch_alter_table('user') as batch_op:
    batch_op.add_column(sa.Column('new_field', sa.String(100), nullable=True))
```

## Output

- Migration file path
- Up migration summary
- Down migration summary
- Data loss risk assessment
- `docs/database.md` updated
- Files changed
