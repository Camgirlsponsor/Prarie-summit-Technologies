# Prairie Summit Technologies

The official marketing website for **Prairie Summit Technologies** — a Wichita, Kansas company working across 3D printing, general commerce, and tech & crypto tooling.

Live site: `https://<your-username>.github.io/<repo-name>/` *(update this once published — see [Deploying to GitHub Pages](#deploying-to-github-pages))*

---

## About this site

A fast, dependency-free static website: four pages of plain HTML, one shared stylesheet, and a small vanilla-JS file for interactivity. No framework, no build step, no `node_modules` — clone it and it just works, which also makes it a perfect fit for GitHub Pages.

**Features**

- A modern, dark "web3" design system — a blue-to-amber gradient accent on a near-black background, glass-panel cards, and drifting glow orbs
- A full-viewport animated particle-network background (drifting nodes connected by faint lines, rendered on `<canvas>`) that pauses on hidden tabs and drops to a single static frame for visitors with `prefers-reduced-motion` set
- Gradient headline text, glowing status-pill badges, and an animated light-sweep divider between the header and page content
- Scroll-reveal animations — cards and section headers fade/slide in as you scroll (skipped automatically for visitors with `prefers-reduced-motion` set)
- Fully responsive, with a collapsing mobile nav
- Four pages: Home, Services, About, Contact
- A contact form (front-end only — see [Wiring up the contact form](#wiring-up-the-contact-form))
- Clean, semantic HTML with descriptive `<title>` and `<meta description>` tags per page for SEO

## Project structure

```
index.html       Home
services.html    Services — 3D printing, general commerce, tech & crypto tools
about.html       About — company story
contact.html     Contact — info card + form
css/style.css    All styles (palette, layout, components, animations)
js/background.js  Animated canvas particle-network background
js/main.js       Mobile nav toggle, active-link highlighting, scroll-reveal, contact form handling
assets/logo.svg  Logo mark (gradient mountain-peak icon)
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

## Before you launch — things to update

A couple of placeholders need swapping out before this goes live for real:

- **Phone number** — `(316) 555-0100` is still a placeholder and appears in the footer of every page and on `contact.html`. Find and replace it across all four HTML files. (The email address is already set to the real one.)
- **Contact form** — see below.
- **Social links** — the footer icons (`𝕏`, `in`, `GH`) currently link to `#`. Point them at your real profiles, or delete the ones you don't use.

### Wiring up the contact form

The form on `contact.html` is front-end only right now — submitting it just shows a confirmation message (handled in `js/main.js`), but nothing is actually sent anywhere, since GitHub Pages can't run server-side code. Two easy ways to fix that without standing up your own backend:

- **[Formspree](https://formspree.io)** — add `action="https://formspree.io/f/your-form-id"` and `method="POST"` to the `<form class="contact-form">` tag in `contact.html`. Free tier covers small sites.
- **Netlify Forms** — if you host on Netlify instead of (or in addition to) GitHub Pages, add `data-netlify="true"` to the same `<form>` tag and Netlify handles the rest.

Or simplest of all: remove the form and link the "Get in Touch" buttons straight to `mailto:you@yourdomain.com`.

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
