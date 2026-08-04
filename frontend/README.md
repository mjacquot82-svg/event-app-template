# Frontend

This directory contains the Expo Router application used for the event web and mobile experience.

## Install dependencies

```bash
npm install
```

## Run locally

Start the Expo development server:

```bash
npm run start
```

Start the web target directly:

```bash
npm run web
```

## Available scripts

- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run web`
- `npm run lint`
- `npm run test:dashboard`
- `npm run reset-project`

## Production web export

Generate the static web build used by Netlify:

```bash
npx expo export --platform web
```

The exported site is written to `dist/`.
