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

Blog posts live in `blog/YYYY/MM/DD/post-slug/` and use Jekyll front matter in `index.md`. To keep a completed post out of the published site until it is ready, set:

```yaml
published: false
```

Read time is computed from the post body at build time, so no front matter is needed for it. Add `last_modified_at` when published content changes so the sitemap can report its modification date. Jekyll excludes unpublished posts from the blog index, post URLs, and sitemap. Change `published` to `true` and push to `master` to release the post.

Unpublished posts remain visible in this public repository.

Create `blog/YYYY/MM/DD/post-slug/`, then copy `_templates/blog-post-template.md` to its `index.md`. Store all post-specific images and social-preview assets in that same folder. Copy `_source-assets/images/blog-social-preview-template.svg` into the folder as `social-preview.svg`, customize it, and export a 1200×630 `social-preview.png` for the post's `social_image` field. The `.svg` stays in the repo as the editable source but is excluded from the build (see `exclude` in `_config.yml`); only the `.png` ships.

## Structure

```text
_config.yml            Jekyll and site configuration
_layouts/              Page layouts (default, post)
_includes/             Shared markup: <head>, header, footer, blog partials
_templates/            Starter file for a new blog post
_source-assets/        Editable design sources; excluded from the build
blog/
  index.html           Blog index
  YYYY/MM/DD/slug/      One self-contained folder per post
index.html             Homepage
404.html               Not-found page
sitemap.xml            Built from the published posts
robots.txt             Crawler policy
CNAME                  Custom domain (ktoll.dev)
Gemfile / Gemfile.lock Ruby dependencies (github-pages gem)
Makefile               install / build / check / serve / clean
.github/workflows/     CI: runs "make check" on push and PR
assets/
  css/                 styles.css site-wide; blog.css on blog and posts
  js/script.js         Theme toggle, menus, post UX, fun mode
  images/              Favicon, icon masks, photo, social-preview PNG
  documents/           Résumé (PDF / DOCX / MD) and vCard
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
