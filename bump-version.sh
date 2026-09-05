#!/usr/bin/env bash
# Bump the ?v= cache-buster on EVERY local asset in index.html at once.
#
# Why this exists: styles.css and app.js were versioned independently, so
# app.js sat at ?v=1001 for many commits while styles.css kept moving.
# Browsers happily served a months-old app.js and renderer changes appeared
# to "not apply". Always bump everything together.
#
# Usage: ./bump-version.sh [version]   (defaults to the current UTC timestamp)
set -euo pipefail
cd "$(dirname "$0")"
V="${1:-$(date -u +%Y%m%d%H%M)}"
perl -pi -e "s/(href=\"styles\.css)\?v=[0-9]+/\1?v=$V/g" index.html
perl -pi -e "s/(src=\"(?:app|data\/[a-z-]+)\.js)(\?v=[0-9]+)?/\1?v=$V/g" index.html
echo "Cache-buster set to ?v=$V"
grep -nE '\?v=' index.html
