#!/usr/bin/env bash
set -euo pipefail

SHA="${1:?Usage: deploy.sh <commit_sha>}"
SHORT_SHA="${SHA:0:7}"

REPO_DIR="${REPO_DIR:-/opt/syndicate-website}"
SITE_PATH="${SITE_PATH:-/var/www/syndicate-website}"
RELEASES_DIR="$SITE_PATH/releases"
CURRENT_LINK="$SITE_PATH/current"
LOGS_DIR="$SITE_PATH/logs"
LOG_FILE="$LOGS_DIR/deploy.log"
MAX_RELEASES="${MAX_RELEASES:-10}"
HEALTHCHECK_URL="${HEALTHCHECK_URL:-http://localhost/}"
BUILD_DIR="${BUILD_DIR:-dist}"
export SITE_URL="${SITE_URL:-https://cnhdnkat.com}"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

mkdir -p "$RELEASES_DIR" "$LOGS_DIR"

log "=== Deploy $SHORT_SHA ==="

cd "$REPO_DIR"
log "Fetching repository state"
git fetch origin --prune
git checkout "$SHA" --force
git clean -fd

log "Installing dependencies"
npm ci

log "Building static site"
npm run build

RELEASE_DIR="$RELEASES_DIR/$SHORT_SHA"
rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR"

log "Copying build output to release directory"
cp -R "$BUILD_DIR"/. "$RELEASE_DIR"/

PREVIOUS=""
if [ -L "$CURRENT_LINK" ]; then
  PREVIOUS=$(readlink "$CURRENT_LINK")
fi

log "Switching current symlink -> $SHORT_SHA"
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"

if command -v nginx >/dev/null 2>&1; then
  log "Reloading nginx"
  sudo nginx -t && sudo systemctl reload nginx
else
  log "nginx command not found, skipping reload"
fi

log "Running health check: $HEALTHCHECK_URL"
sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: cnhdnkat.com" "$HEALTHCHECK_URL" || echo "000")
if [ "$HTTP_CODE" != "200" ]; then
  log "Health check FAILED ($HTTP_CODE)"
  if [ -n "$PREVIOUS" ] && [ -d "$PREVIOUS" ]; then
    log "Rolling back to $PREVIOUS"
    ln -sfn "$PREVIOUS" "$CURRENT_LINK"
    if command -v nginx >/dev/null 2>&1; then
      sudo systemctl reload nginx || true
    fi
  fi
  exit 1
fi
log "Health check OK ($HTTP_CODE)"

CURRENT_RELEASE=$(readlink "$CURRENT_LINK")
find "$RELEASES_DIR" -mindepth 1 -maxdepth 1 -type d | sort | head -n -"${MAX_RELEASES}" 2>/dev/null | while read -r old; do
  if [ "$old" != "$CURRENT_RELEASE" ]; then
    log "Removing old release: $old"
    rm -rf "$old"
  fi
done

log "=== Deploy $SHORT_SHA complete ==="
