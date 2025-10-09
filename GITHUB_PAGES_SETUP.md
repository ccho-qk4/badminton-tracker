# GitHub Pages Setup - Fix Blank Page

## ✅ Your site was deployed successfully!

The `gh-pages` branch has been created and your code is there. Now you need to enable GitHub Pages in your repository settings.

## 🔧 Steps to Enable GitHub Pages:

### 1. Go to Repository Settings
- Open your browser and go to: https://github.com/ccho-qk4/badminton-tracker
- Click the **Settings** tab (near the top right)

### 2. Navigate to Pages
- In the left sidebar, click **Pages** (under "Code and automation")

### 3. Configure Source
- Under **"Build and deployment"** → **"Source"**
- Select **"Deploy from a branch"**
- Under **"Branch"**:
  - Select branch: **`gh-pages`**
  - Select folder: **`/ (root)`**
- Click **Save**

### 4. Wait 1-2 Minutes
- GitHub will deploy your site
- You'll see a message: "Your site is live at https://ccho-qk4.github.io/badminton-tracker/"

### 5. Visit Your Site
After a couple minutes, visit:
**https://ccho-qk4.github.io/badminton-tracker/**

---

## 🎯 Your Live Site URL

Once configured, your badminton tracker will be at:
### **https://ccho-qk4.github.io/badminton-tracker/**

---

## 🔄 Making Updates

Whenever you make changes to your app:

```bash
# 1. Commit changes
git add .
git commit -m "Your update message"
git push origin main

# 2. Deploy
npm run deploy
```

Wait 1-2 minutes and your changes will appear on the live site!

---

## ⚠️ Still Seeing a Blank Page?

If you've enabled GitHub Pages and still see a blank page:

1. **Hard refresh** your browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. **Clear browser cache** and try again
3. **Check the browser console** for errors (Press F12)
4. Wait a full 5 minutes - sometimes GitHub Pages takes time
5. Make sure the branch in Settings → Pages is set to `gh-pages`

---

## 📞 Quick Check

Open this URL to verify GitHub Pages is enabled:
https://github.com/ccho-qk4/badminton-tracker/settings/pages

You should see a green box saying "Your site is live at..."
