# Prairie Summit Technologies

The official marketing website for **Prairie Summit Technologies** — a Wichita, Kansas company working across 3D printing, general commerce, and tech & crypto tooling.

Live site: [https://prairiesummittech.net](https://prairiesummittech.net)

---

## About this site

A fast, dependency-free static website: four pages of plain HTML, one shared stylesheet, and a small vanilla-JS file for interactivity. No framework, no build step, no `node_modules` — clone it and it just works, which also makes it a perfect fit for GitHub Pages.

**Features**

- A modern, dark "web3" design system — a blue-to-amber gradient accent on a near-black background, glass-panel cards, and drifting glow orbs
- A full-viewport animated particle-network background (drifting nodes connected by faint lines, rendered on `<canvas>`) that pauses on hidden tabs and drops to a single static frame for visitors with `prefers-reduced-motion` set
- Gradient headline text, glowing status-pill badges, and an animated light-sweep divider between the header and page content
- Scroll-reveal animations — cards and section headers fade/slide in as you scroll (skipped automatically for visitors with `prefers-reduced-motion` set)
- Fully responsive, with a collapsing mobile nav
- Four pages: Home, Services, About, Contact, plus a custom 404
- A contact form that opens a pre-filled email to `prairiesummittech@outlook.com`
- Search-ready markup: unique titles and descriptions, canonical URLs, Open Graph/Twitter cards, JSON-LD, `robots.txt`, and `sitemap.xml`

## Project structure

```
index.html              Home
services.html           Services — 3D printing, general commerce, tech & crypto tools
about.html              About — company story
contact.html            Contact — info card + form
404.html                Custom not-found page (used by GitHub Pages)
robots.txt              Allow crawling; points crawlers at the sitemap
sitemap.xml             All public URLs for Google / Bing
site.webmanifest        Name, theme color, and icons
css/style.css           All styles (palette, layout, components, animations)
js/background.js        Animated canvas particle-network background
js/main.js              Mobile nav toggle, active-link highlighting, scroll-reveal, contact form
assets/logo.svg         Logo mark (gradient mountain-peak icon)
assets/og-image.png     1200×630 image for link previews
assets/apple-touch-icon.png  Home-screen / search icon
```

Every page links the same `css/style.css`, `js/background.js`, and `js/main.js`, and all internal links are relative (`services.html`, not `/services.html`), so the site works whether it's hosted at the root of a domain or in a subpath like `/repo-name/`.

## Local preview

No build tools needed.

**Option 1 — just open it:** double-click `index.html`, or open it from your browser's File menu.

**Option 2 — run a local server** (recommended, avoids occasional path quirks with `file://`):

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploying to GitHub Pages

1. Create a new GitHub repository (or use an existing one) and push these files to it.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch".
4. Choose the branch (usually `main`) and the `/` (root) folder, then save.
5. GitHub publishes the site at `https://<your-username>.github.io/<repo-name>/` within a minute or two — check the Pages settings page for the exact URL and a "your site is live" confirmation.

**Want it at the root of `<your-username>.github.io`** (a personal/organization page) instead of a subpath? Name the repository exactly `<your-username>.github.io` and push these files to its `main` branch — no other changes needed, since all links are already relative.

**Custom domain?** Add a `CNAME` file to the repo root containing just your domain (e.g. `prairiesummit.tech`), then point your domain's DNS at GitHub Pages per [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Getting listed in search engines

The site is already crawlable once these files are live on `prairiesummittech.net`:

- `robots.txt` tells crawlers they may index the site and where the sitemap lives
- `sitemap.xml` lists Home, Services, About, and Contact
- Each page has a unique title, meta description, canonical URL, Open Graph tags, and JSON-LD

Search engines will not pick the site up automatically just because those files exist. After this version is deployed:

1. Open [Google Search Console](https://search.google.com/search-console) and add `https://prairiesummittech.net` as a URL-prefix property.
2. Verify the domain (HTML file, DNS TXT, or meta tag — any of the options Google offers).
3. Under **Sitemaps**, submit `https://prairiesummittech.net/sitemap.xml`.
4. Use **URL Inspection** on the homepage and click **Request indexing**.
5. Repeat the sitemap submit at [Bing Webmaster Tools](https://www.bing.com/webmasters) if you want Bing/DuckDuckGo coverage too.

First-time indexing often takes a few days. Local queries like “3D printing Wichita” usually need a handful of real pages plus Search Console verification before they start ranking.

Optional later: add a real phone number and social profile URLs to the footer and the JSON-LD block in `index.html` once those exist. Placeholder numbers and empty `#` social links were removed so they would not be indexed.

### Contact form

Submitting the form on `contact.html` opens the visitor’s email app with a message addressed to `prairiesummittech@outlook.com`. If you later want submissions to land in the inbox without opening a mail client, connect [Formspree](https://formspree.io) or Netlify Forms and drop the JavaScript `preventDefault` in `js/main.js`.

## Customizing the design

Everything visual lives in `css/style.css`, mostly as CSS custom properties at the top of the file under `:root`:

| Variable | Used for |
|---|---|
| `--bg`, `--bg-alt` | Page background / footer background |
| `--surface`, `--surface-hover`, `--surface-solid` | Glass card backgrounds |
| `--blue`, `--blue-light`, `--amber`, `--amber-light` | The gradient accent pair — buttons, links, glows, gradient text |
| `--gradient-brand` | The signature blue→amber gradient used on primary buttons and icons |
| `--gradient-text` | The lighter gradient used for headline/stat text (`.grad-text`) |
| `--ink`, `--ink-soft`, `--ink-faint` | Primary, secondary, and tertiary text color |
| `--border`, `--border-strong` | Glass-panel borders and dividers |

Change a value once and it updates everywhere that variable is used. The large soft gradient orbs drifting behind the page content are defined in the `body::before` / `body::after` rules near the top of the file; the matching pair inside each page header live under `.hero::before` / `.hero::after`. The full-page moving particle network sits on the `#bg-canvas` element and is entirely generated by `js/background.js` — tweak the `COLORS` array there to change the dot/line colors, or `linkDistance` and `particleCount()` to change how dense and connected it looks. The animated light-sweep under each page header is `.glow-divider`.

Fonts are loaded from Google Fonts in each page's `<head>`: **Space Grotesk** for headings/display text, **Inter** for body copy.

To make an element fade/slide in as the visitor scrolls to it, just add the `reveal` class — `js/main.js` handles the rest via `IntersectionObserver`.

## Browser support

Built with standard, well-supported CSS and JS (including `backdrop-filter` for the glass-panel effect) — works in all current versions of Chrome, Firefox, Safari, and Edge. No polyfills required. On the rare browser without `backdrop-filter` support, cards simply render without the blur — everything stays fully legible.

## License

© Prairie Summit Technologies. All rights reserved. This code was built for Prairie Summit Technologies' own use; reuse, copy, or adapt it as you see fit for your own projects.
