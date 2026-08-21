# ktoll.dev

Personal portfolio site for Kirk Tolleshaug, a senior backend software engineer.

The site is intentionally dependency-free: plain HTML, CSS, and JavaScript served as static files.

## About

Visit [ktoll.dev](https://ktoll.dev) for experience, selected work, technical focus, and résumé downloads.

For senior backend engineering opportunities involving architecture, modernization, performance, and high-volume systems, reach out at [kirk@ktoll.dev](mailto:kirk@ktoll.dev).

## Local Preview

Run a static web server from the repository root:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

## Structure

```text
index.html              Main site
404.html                GitHub Pages not-found page
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

Deploy with GitHub Pages from the `master` branch root. The `CNAME` file preserves the `ktoll.dev` custom domain.
