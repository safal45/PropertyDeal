# create-api

Add a Flask API endpoint that follows project conventions: validated input, consistent response shape, correct HTTP status codes, and a contract entry in docs.

## Usage

```
/create-api method="<GET|POST|PUT|DELETE>" path="</path/<id>>" description="<what it does>" [model="<ModelName>"]
```

## Behavior

1. Read `CLAUDE.md`, `docs/architecture.md` (API table), `flask_server/app.py`.
2. Verify the path and method do not conflict with an existing endpoint.
3. Implement the route in `flask_server/app.py` following the template below.
4. Update the API endpoint table in `docs/architecture.md`.

## Route Template

```python
@app.route('/path', methods=['METHOD'])
def handler_name():
    data = request.json or {}

    # --- validation ---
    required = ['field1', 'field2']
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({'error': f'Missing fields: {missing}'}), 400

    # --- business logic ---

    # --- response ---
    return jsonify({'message': 'Success'}), 200  # or 201 for creates
```

## Rules

- Always validate required fields and return HTTP 400 with a descriptive error on failure.
- Return HTTP 404 with `{"error": "Not found"}` for missing records — not 200.
- Return HTTP 500 with `{"error": "Internal server error"}` for unexpected exceptions — never expose stack traces.
- For creates, return HTTP 201; for updates, return HTTP 200; for deletes, return HTTP 200 or 204.
- Every new endpoint must appear in the `docs/architecture.md` API table before the PR is merged.
- Auth-protected endpoints are V2 scope — do not add auth middleware to V1 endpoints.

## Output

- Contract definition (method, path, request body, response, status codes)
- Files changed
- Risks
