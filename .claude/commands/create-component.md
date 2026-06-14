# create-component

Create a React component following PropertyDeal conventions: co-located file, Tailwind styling, env-based API calls, no inline styles.

## Usage

```
/create-component name="<ComponentName>" path="<src/components/dir/>" type="<page|form|ui>" [api="<endpoint>"]
```

## Behavior

1. Read `CLAUDE.md`, `docs/architecture.md` (route map), relevant existing components.
2. Determine if a new route entry is needed in `App.js`.
3. Create `<path>/<ComponentName>.jsx` using the template below.
4. If `type=page`, add route to `App.js` and update the route map in `docs/architecture.md`.
5. If `api` is specified, generate the Axios call using `process.env.REACT_APP_API_URL`.

## Component Template

```jsx
import React, { useState } from 'react';
// import axios from 'axios'; — only if API call needed

function ComponentName() {
  // state

  return (
    <div className="...tailwind classes...">
      {/* content */}
    </div>
  );
}

export default ComponentName;
```

## Rules

- File name matches component name exactly (`ComponentName.jsx`).
- Directory: `src/components/<feature>/ComponentName.jsx` — never dump in `src/` root.
- No inline `style={{}}` — Tailwind classes only; exceptions require a comment explaining why.
- Brand colours via Tailwind classes (`bg-[#122B49]`, `text-[#7A7A7A]`, `bg-[#FCF8F4]`) — never raw hex in style props.
- API calls must use `process.env.REACT_APP_API_URL` as the base — never `http://127.0.0.1:5000`.
- No API calls inside sub-components — fetch at the page-level component and pass data as props.
- Forms must validate client-side before the Axios call fires.
- `useNavigate` for programmatic navigation — never `window.location`.

## Output

- Component file created
- Route entry added (if page)
- `docs/architecture.md` route map updated (if page)
- Files changed
