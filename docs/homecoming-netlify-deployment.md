# Homecoming Netlify Deployment

This app supports two web deployment modes from the same repository:

- standalone deployment at `/`
- path-mounted deployment at `/homecoming`

The deployment mode is controlled by the `APP_BASE_PATH` environment variable at build time.

## Homecoming Site

For a standalone Homecoming Netlify site:

- leave `APP_BASE_PATH` unset or set it to `/`
- build command: `npm install && npx expo export --platform web`
- publish directory: `frontend/dist`

For a path-mounted Homecoming Netlify site used behind `jdsstudio.ca/homecoming`:

- set `APP_BASE_PATH` to `/homecoming`
- build command: `npm install && npx expo export --platform web`
- publish directory: `frontend/dist`

## JDS Website Rewrite

Add these rules to the JDS Website Netlify project so `https://jdsstudio.ca/homecoming` proxies to the Homecoming site while keeping the browser URL on `jdsstudio.ca`:

```toml
[[redirects]]
  from = "/homecoming"
  to = "/homecoming/"
  status = 301
  force = true

[[redirects]]
  from = "/homecoming/*"
  to = "https://YOUR-HOMECOMING-SITE.netlify.app/:splat"
  status = 200
```

Use the Homecoming site's `.netlify.app` hostname as the target, not its custom domain.

## Verification

Standalone deployment checks:

- `/` loads successfully
- direct links such as `/vendors` load successfully
- `manifest.json` resolves from the site root

Path-mounted deployment checks:

- `/homecoming/` loads successfully through `jdsstudio.ca`
- direct links such as `/homecoming/vendors` load successfully
- assets load from `/homecoming/_expo/...`
- `manifest.json` resolves from `/homecoming/manifest.json`

## Notes

- The current `frontend/package.json` does not define an `export:web` script. Use the Expo export command shown above.
- If you want both standalone and path-mounted production URLs live at the same time, deploy the same repo to two separate Netlify sites with different `APP_BASE_PATH` values.
