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
reading_time: 4
```

Set `reading_time` to the intended whole-minute estimate. Add `last_modified_at` when published content changes so the sitemap can report its modification date. Jekyll excludes unpublished posts from the blog index, post URLs, and sitemap. Change `published` to `true` and push to `master` to release the post.

Unpublished posts remain visible in this public repository.

Create `blog/YYYY/MM/DD/post-slug/`, then copy `_templates/blog-post-template.md` to its `index.md`. Store all post-specific images and social-preview assets in that same folder. Copy `_templates/blog-social-preview-template.svg` into the folder, customize it, and export a 1200×630 PNG for the post's `social_image` field.

## Structure

```text
_config.yml             Jekyll configuration
_layouts/               Shared page layouts
_includes/              Shared head, header, and footer markup
_templates/             Reusable Markdown and social-preview templates
_source-assets/         Design-source files (business card, resume icons) kept
                         in the repo but excluded from the Jekyll build
blog/
  index.html            Blog index source
  YYYY/MM/DD/slug/      Self-contained post Markdown and assets
index.html              Homepage source
404.html                GitHub Pages not-found page
Gemfile                 Local GitHub Pages/Jekyll dependencies
Makefile                Local install, build, validation, cleanup, and server commands
CNAME                   Custom domain configuration
robots.txt              Crawler policy
sitemap.xml             Search-engine sitemap
assets/
  css/styles.css         Shared site and homepage styles
  css/header.css         Header, navigation, and menu styles
  css/footer.css         Footer styles
  css/blog.css           Blog index and post styles
  js/script.js           Theme and optional fun-mode behavior
  images/                Profile, favicon, and social-preview assets
  documents/             Resume formats and vCard
```

## Fun Mode

Use `?personality=on` to enable the rotating "Not open to..." status and the Orbitron/Space Grotesk font pairing:

```text
https://ktoll.dev/?personality=on
```

## Deployment

Deploy with GitHub Pages from the `master` branch root. GitHub Pages builds the Jekyll source and deploys its generated output; `_site/` is not committed. The `CNAME` file preserves the `ktoll.dev` custom domain.

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs `make check` on every push and pull request, catching whitespace issues and Jekyll build failures before they reach `master`. It validates only; it does not deploy the site.

## License

All rights reserved. See [LICENSE](LICENSE).
