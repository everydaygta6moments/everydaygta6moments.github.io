# Everyday GTA6 Moments: website

Public homepage, Terms of Service and Privacy Policy for the Everyday GTA6 Moments / Dzienna Dawka GTA6 channels.
The URLs are what the TikTok and Google app settings point at, and the homepage is the OAuth redirect target
(it shows a "copy the address" note when it receives `?code=`).

Static files, no build step: `index.html`, `terms/index.html` and `privacy/index.html` are the same shell; `assets/app.js`
renders the page for the current path and switches pages without reloading.

Preview locally:
```bash
python -m http.server 8765
```
then open http://127.0.0.1:8765/.

Publish: push to GitHub, then Settings → Pages → Deploy from a branch → `main` / root.
