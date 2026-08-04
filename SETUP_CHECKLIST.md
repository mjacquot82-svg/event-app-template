# Event App Setup

## 1. Update event configuration
Primary event branding and platform-facing settings live in:

- `frontend/src/data/eventConfig.ts`

Legacy setup data still exists in:

- `frontend/src/setup/eventSetup.ts`

## 2. Replace event imagery
Current app imagery is stored under:

- `frontend/assets/images/whc-logo.png`
- `frontend/assets/images/whc-logo-splash.png`
- `frontend/assets/images/homecoming-splash-poster-proposal.png`
- `frontend/assets/images/icon.png`

## 3. Update sponsors
Sponsor content is maintained in:

- `frontend/src/data/sponsors.ts`

## 4. Install dependencies

```bash
npm --prefix frontend install
```

## 5. Run locally

```bash
npm --prefix frontend run start
```

## 6. Deploy to Netlify
The repository is configured to export the frontend as a static web build with:

```bash
cd frontend
npm install
npx expo export --platform web
```

Netlify uses the equivalent build configuration from `netlify.toml`.
