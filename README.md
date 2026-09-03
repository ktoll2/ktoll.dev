# ktoll.dev

Personal portfolio site for Kirk Tolleshaug, a senior backend software engineer.

The site is a Jekyll-generated static site using plain HTML, CSS, and JavaScript.

## About

Visit [ktoll.dev](https://ktoll.dev) for experience, selected work, technical focus, and résumé downloads.

For senior backend engineering opportunities involving architecture, modernization, performance, and high-volume systems, reach out at [kirk@ktoll.dev](mailto:kirk@ktoll.dev).

## Local Development

Requires Ruby and Bundler. Install the project dependencies once:

```bash
./scripts/install.sh
```

Start the local server with LiveReload:

```bash
./scripts/launch.sh
```

Open [http://localhost:4000](http://localhost:4000). The install script stores Bundler configuration in the ignored `.bundle/` directory and gems in `~/.local/share/ktoll.dev-bundle` by default.

To create a production-style local build without starting a server:

```bash
bundle exec jekyll build
```

Jekyll writes rendered files to `_site/`; that directory is generated locally and ignored by Git.

## Structure

```text
_config.yml             Jekyll configuration
_layouts/               Shared page layouts
_includes/              Shared head, header, and footer markup
index.html              Homepage source
404.html                GitHub Pages not-found page
Gemfile                 Local GitHub Pages/Jekyll dependencies
scripts/
  install.sh            Configure Bundler and install dependencies
  launch.sh             Start Jekyll with LiveReload
CNAME                   Custom domain configuration
robots.txt              Crawler policy
sitemap.xml             Search-engine sitemap
assets/
  css/styles.css         Site styles
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
