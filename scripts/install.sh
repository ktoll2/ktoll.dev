#!/usr/bin/env bash

set -euo pipefail

readonly project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly bundle_path="${BUNDLE_PATH:-${HOME}/.local/share/ktoll.dev-bundle}"

cd "${project_root}"

if ! command -v ruby >/dev/null 2>&1 || ! command -v bundle >/dev/null 2>&1; then
  if ! command -v apt-get >/dev/null 2>&1; then
    printf 'Ruby and Bundler must be installed before running this script.\n' >&2
    exit 1
  fi

  sudo apt-get update
  sudo apt-get install --yes ruby-full ruby-bundler build-essential
fi

bundle config set --local path "${bundle_path}"
bundle install
