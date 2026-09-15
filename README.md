# ktoll.dev

Personal portfolio site for Kirk Tolleshaug, a senior backend software engineer.

The site is a Jekyll-generated static site using plain HTML, CSS, and JavaScript.

## About

Visit [ktoll.dev](https://ktoll.dev) for experience, selected work, technical focus, and résumé downloads.

For senior backend engineering opportunities involving architecture, modernization, performance, and high-volume systems, reach out at [kirk@ktoll.dev](mailto:kirk@ktoll.dev).

## Local Development

Requires Ruby and Bundler. Install the project dependencies once:

```bash
make install
```

Start the local server with LiveReload:

```bash
make serve
```

Open [http://localhost:4000](http://localhost:4000). `make install` stores Bundler configuration in the ignored `.bundle/` directory and gems in `~/.local/share/ktoll.dev-bundle` by default.

To create a local build without starting a server:

```bash
make build
```

Jekyll writes rendered files to `_site/`; that directory is generated locally and ignored by Git.

Validate formatting and create a local build with:

```bash
make check
```

Create a clean production-style build with:

```bash
make clean-build
```

Remove generated Jekyll output with:

```bash
make clean
```

## Publishing Blog Posts

Blog posts are a standard Jekyll `_posts` collection: each one is a single file,
`_posts/YYYY-MM-DD-post-slug.md`. The filename alone determines the post's date and URL (via the
global `permalink: /blog/:year/:month/:day/:title/` pattern in `_config.yml`) — no per-post
`permalink` front matter is needed. `published` defaults to `true` for every post (see `defaults`
in `_config.yml`), so a new post needs no `published` line at all once it's ready; to keep a
completed post out of the built site, set:

```yaml
published: false
```

Separately, a post dated after the current build's clock is never built either, regardless of
`published` — Jekyll's `future: false` default (never overridden here) excludes it automatically.
Either condition means the post's `index.html` is never generated at all, not merely hidden from
the blog index and sitemap, so a draft isn't reachable at its URL even directly. Change
`published` to `true` (or just remove the line) and push to `master`, or wait for its `date` to
pass and rebuild, to release the post.

Read time is computed from the post body at build time, so no front matter is needed for it. Add
`last_modified_at` when published content changes so the sitemap can report its modification
date.

The post's raw Markdown source is still visible in this public repository's git history regardless
of `published` or `date` — hiding a post from the built site doesn't hide its source from anyone
browsing the repo on GitHub.

To preview a hidden or future-dated post locally exactly as it will eventually render, run `make
serve-drafts` instead of `make serve` (it passes Jekyll's `--future --unpublished` flags, which
only affect the local build, never a real deploy).

Create `_posts/YYYY-MM-DD-post-slug.md` by copying `_templates/blog-post-template.md`. Store all
post-specific images, video clips, and social-preview assets in a matching `assets/blog/post-slug/`
folder (kept separate from the content file since `_posts` entries are single files, not folders).
Copy `_source-assets/images/blog-social-preview-template.svg` into that folder as
`social-preview.svg`, customize it, and export a 1200×630 `social-preview.png` for the post's
`social_image` field. The `.svg` stays in the repo as the editable source but is excluded from the
build (see `exclude` in `_config.yml`); only the `.png` ships.

## Projects Section

The homepage Projects section is driven by `_data/projects.yml`. Each entry needs `name`, `description`, and `url`; `tags` (a list of labels) and `featured: true` (renders the card full-width) are optional. List order is page order. The section is hidden entirely when the file has no entries.

## Structure

```text
_config.yml            Jekyll and site configuration
_data/projects.yml     Curated repo list for the homepage Projects section
_layouts/              Page layouts (default, post)
_includes/             Shared markup: <head>, header, footer, blog partials
_templates/            Starter file for a new blog post
_source-assets/        Editable design sources; excluded from the build
_posts/                YYYY-MM-DD-slug.md — one file per post; date/URL come from the filename
blog/
  index.html           Blog index (the only file left under blog/)
index.html             Homepage
404.html               Not-found page
sitemap.xml            Built from the published posts
robots.txt             Crawler policy
CNAME                  Custom domain (ktoll.dev)
Gemfile / Gemfile.lock Ruby dependencies (github-pages gem)
Makefile               install / build / check / serve / serve-drafts / clean
.github/workflows/     CI: runs "make check" on push and PR
assets/
  css/                 styles.css site-wide; blog.css on blog and posts
  js/script.js         Theme toggle, menus, post UX, fun mode
  images/              Favicon, icon masks, photo, social-preview PNG, shared brand icons
  documents/           Résumé (PDF / DOCX / MD) and vCard
  blog/slug/           Per-post media: video clips (mp4 only), social-preview.svg/.png
```

## Fun Mode

Use `?personality=on` to enable the rotating "Not open to..." status and the Orbitron/Space Grotesk font pairing:

```text
https://ktoll.dev/?personality=on
```

## Deployment

Deploy with GitHub Pages from the `master` branch root. GitHub Pages builds the Jekyll source and deploys its generated output; `_site/` is not committed. The `CNAME` file preserves the `ktoll.dev` custom domain.

The site opts out of the default GitHub Pages theme (`theme: null` in `_config.yml`) and ships its own layouts, includes, and CSS. The `exclude` list in `_config.yml` keeps development files (`Gemfile`, `Makefile`, `LICENSE`, `README.md`) and design-source SVGs out of the deployed output.

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs `make check` on every push and pull request, catching whitespace issues and Jekyll build failures before they reach `master`. It validates only; it does not deploy the site.

## License

All rights reserved. See [LICENSE](LICENSE).
