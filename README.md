# CNHDNKAT Website

Astro-сайт для публичного протокола синдиката CNHDNKAT.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Автодеплой на VPS через SSH при push в `main`.

- **GitHub Actions** → SSH → `/opt/syndicate-website` → `scripts/deploy/deploy.sh`
- Релизы хранятся в `/var/www/syndicate-website/releases/`, nginx раздаёт `current` symlink
- Health check + автооткат при ошибке

Публичный URL: `https://cnhdnkat.com`

### Secrets (GitHub)

| Secret | Значение |
|--------|----------|
| `DEPLOY_HOST` | IP VPS |
| `DEPLOY_PORT` | SSH port |
| `DEPLOY_USER` | SSH user |
| `DEPLOY_SSH_KEY` | ED25519 private key |
