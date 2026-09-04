.PHONY: build check clean clean-build install serve

BUNDLE_PATH ?= $(HOME)/.local/share/ktoll.dev-bundle

install:
	@command -v ruby >/dev/null || { printf 'Ruby must be installed before running make install.\n' >&2; exit 1; }
	@command -v bundle >/dev/null || { printf 'Bundler must be installed before running make install.\n' >&2; exit 1; }
	bundle config set --local path "$(BUNDLE_PATH)"
	bundle install

build:
	bundle exec jekyll build

check:
	git diff --check -- . ':(exclude)**/*.vcf'
	@issues="$$(git ls-files --others --exclude-standard -z -- ':(exclude)**/*.vcf' | xargs -0 -r -n 1 sh -c 'git diff --no-index --check /dev/null "$$1" 2>&1 || true' sh | grep -E 'trailing whitespace|space before tab' || true)"; test -z "$$issues" || { printf '%s\n' "$$issues" >&2; exit 1; }
	bundle exec jekyll build

clean:
	bundle exec jekyll clean

clean-build: clean build

serve:
	bundle exec jekyll clean
	bundle exec jekyll serve --livereload
