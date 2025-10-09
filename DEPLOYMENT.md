# Deploying to GitHub Pages

## Quick Deploy Steps

### 1. Commit Your Changes
```bash
git add .
git commit -m "Add player names feature and configure for GitHub Pages"
git push origin main
```

### 2. Deploy to GitHub Pages
```bash
npm run deploy
```

That's it! Your site will be live at: `https://[your-username].github.io/badminton-tracker/`

---

## First Time Setup (if you haven't pushed to GitHub yet)

If this is your first time pushing this project to GitHub:

### 1. Create a new repository on GitHub
- Go to https://github.com/new
- Name it `badminton-tracker`
- Don't initialize with README (you already have one)
- Click "Create repository"

### 2. Connect your local repository to GitHub
```bash
git remote add origin https://github.com/YOUR-USERNAME/badminton-tracker.git
git branch -M main
git push -u origin main
```

### 3. Deploy
```bash
npm run deploy
```

### 4. Enable GitHub Pages
- Go to your repository on GitHub
- Click "Settings" → "Pages"
- Under "Source", select branch: `gh-pages`
- Click "Save"

Your site will be live at: `https://YOUR-USERNAME.github.io/badminton-tracker/`

---

## What Was Configured

✅ **vite.config.ts** - Added base path `/badminton-tracker/` for GitHub Pages
✅ **package.json** - Added `deploy` script using `gh-pages`
✅ **gh-pages package** - Installed for easy deployment

## Updating Your Site

Whenever you make changes:

```bash
git add .
git commit -m "Your update message"
git push origin main
npm run deploy
```

The `npm run deploy` command will:
1. Build your app (create optimized production files)
2. Push the build to a `gh-pages` branch
3. GitHub Pages automatically updates your live site

---

## Troubleshooting

**Site not loading?**
- Make sure GitHub Pages is enabled in repository settings
- Check that the source is set to the `gh-pages` branch
- It can take 1-2 minutes for changes to appear

**404 errors?**
- Verify the `base` path in `vite.config.ts` matches your repo name
- Clear browser cache and try again

**Need to change the URL?**
If you want the site at `username.github.io` instead of `username.github.io/badminton-tracker`:
1. Rename your GitHub repo to `username.github.io`
2. Change `base: '/badminton-tracker/'` to `base: '/'` in `vite.config.ts`
3. Run `npm run deploy` again
