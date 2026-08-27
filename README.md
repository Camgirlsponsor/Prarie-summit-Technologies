# Prairie Summit Technologies — Website

A static, multi-page website for Prairie Summit Technologies (Wichita, KS), built with plain HTML/CSS/JS so it can be hosted directly on GitHub Pages — no build step required.

## Structure

```
index.html      Home
services.html   Services (3D printing, general commerce, tech & crypto tools)
blog.html       Insights / blog listing (placeholder posts — replace with real ones)
about.html      About / story
contact.html    Contact info + form
css/style.css   Shared styles
js/main.js      Mobile nav toggle, active-link highlighting, contact form handling
assets/logo.svg Site logo mark
```

## Before you launch — things to update

- **Contact info**: email (`hello@prairiesummittech.com`) and phone (`(316) 555-0100`) are placeholders. Find/replace them across all five HTML files.
- **Contact form**: it currently just shows a confirmation message on submit — it doesn't send anywhere. Wire it up with a service like [Formspree](https://formspree.io) or Netlify Forms (add a `action="..."` and `method="POST"` to the `<form>` in `contact.html`), or replace it with a `mailto:` link.
- **Blog posts**: `blog.html` has example post cards. Replace the content, or duplicate the page pattern to create individual post pages later.
- **Social links**: the footer has placeholder icons (`𝕏`, `in`, `GH`) linking to `#`. Point them at real profiles or remove them.

## Deploying to GitHub Pages

1. Create a new GitHub repository (or use an existing one) and push these files to it.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch".
4. Choose the branch (usually `main`) and the root folder (`/`), then save.
5. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

If you want the site at the root of `<your-username>.github.io` (a user/organization page), name the repository exactly `<your-username>.github.io` and push these files to its `main` branch.

All links in this site are relative (e.g. `services.html`, `css/style.css`), so it works correctly whether it's hosted at the root of a domain or in a subpath like `/repo-name/`.

## Local preview

No build tools needed — just open `index.html` in a browser, or run a quick local server from this folder:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
