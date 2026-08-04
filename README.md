# JDS Event App Repository

This repository contains the Walkerton Homecoming application codebase that is being prepared for reuse as the JDS Event Platform.

## Repository layout

- `frontend/`: Expo Router web/mobile app
- `backend/`: Python backend services and API code
- `docs/`: deployment and project documentation
- `tests/`: Python test suite

## Frontend

Install frontend dependencies:

```bash
npm --prefix frontend install
```

Run the Expo development server:

```bash
npm --prefix frontend run start
```

Create the production web export used by Netlify:

```bash
cd frontend
npx expo export --platform web
```

Run the dashboard test suite:

```bash
npm --prefix frontend run test:dashboard
```

## Backend

Run the Python test suite from the repository root:

```bash
pytest -q
```

## Deployment

Netlify is configured in [`netlify.toml`](netlify.toml) to build from `frontend/` with:

```bash
npm install && npx expo export --platform web
```

See [`docs/homecoming-netlify-deployment.md`](docs/homecoming-netlify-deployment.md) for the current deployment notes.
