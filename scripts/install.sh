#!/usr/bin/env bash

set -euo pipefail

readonly project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly bundle_path="${BUNDLE_PATH:-${HOME}/.local/share/ktoll.dev-bundle}"

cd "${project_root}"

if ! command -v bundle >/dev/null 2>&1; then
  printf 'Bundler is not installed. Install Ruby and Bundler before running this script.\n' >&2
  exit 1
fi

bundle config set --local path "${bundle_path}"
bundle install
