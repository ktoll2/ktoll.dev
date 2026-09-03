#!/usr/bin/env bash

set -euo pipefail

readonly project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "${project_root}"

if ! command -v bundle >/dev/null 2>&1; then
  printf 'Bundler is not installed. Run scripts/install.sh after installing Ruby and Bundler.\n' >&2
  exit 1
fi

if [[ ! -f .bundle/config ]]; then
  printf 'Dependencies are not configured. Run scripts/install.sh first.\n' >&2
  exit 1
fi

exec bundle exec jekyll serve --livereload "$@"
