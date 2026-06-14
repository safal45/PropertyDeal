# create-test

Create tests for a given feature, component, or endpoint following project testing conventions.

## Usage

```
/create-test target="<file-or-feature>" type="<unit|integration|e2e>" [description="<what to verify>"]
```

## Behavior

1. Read `CLAUDE.md`, the target file, and any related files.
2. Identify the critical paths and edge cases to cover.
3. Create the test file at the appropriate location.
4. For Flask integration tests: use a real SQLite test database (never mock the DB — see ADR-001 rationale).
5. For React unit tests: use `@testing-library/react` (already installed).

## File Locations

| Target | Test file location |
|---|---|
| React component `src/components/foo/Foo.jsx` | `src/components/foo/Foo.test.jsx` |
| Flask route in `app.py` | `flask_server/tests/test_<feature>.py` |
| Utility / helper | Co-located `<file>.test.js` or `<file>_test.py` |

## Flask Test Template

```python
import pytest
from flask_server.app import app, db

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.drop_all()

def test_example(client):
    response = client.post('/submit', json={...})
    assert response.status_code == 200
```

## React Test Template

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentName from './ComponentName';

test('renders correctly', () => {
  render(<ComponentName />);
  expect(screen.getByText('...')).toBeInTheDocument();
});
```

## Rules

- Integration tests use an in-memory SQLite DB — never touch `instance/data.db`.
- Each test must clean up after itself (`db.drop_all()` in teardown, or `afterEach` reset).
- Assert on behaviour and user-visible output — not on DOM structure or internal state.
- Never skip a failing test with `skip` or `xtest` without a comment explaining the blocker.
- The hardcoded `userId = 1` in `About.jsx:581` blocks multi-user E2E testing — document this if it limits test scope.

## Output

- Test file(s) created
- Critical paths covered (list)
- Known gaps (list)
- Files changed
