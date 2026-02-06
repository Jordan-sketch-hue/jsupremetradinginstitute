# Quick Start Guide - J Supreme Market Institute

Welcome! This guide will help you get your trading education platform up and running.

## Prerequisites

Make sure you have:
- ✅ Node.js 18 or higher ([Download](https://nodejs.org))
- ✅ A code editor (VS Code recommended)
- ✅ Git installed ([Download](https://git-scm.com))

Check versions:
```bash
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher
```

---

## Installation (5 minutes)

### Step 1: Install Dependencies

Open PowerShell in your project folder:

```powershell
cd c:\Users\jader\jsuprememarketinsititue
npm install
```

Wait for installation to complete (2-3 minutes).

### Step 2: Start Development Server

```powershell
npm run dev
```

You should see:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

### Step 3: Open in Browser

Go to: **http://localhost:3000**

You should see the J Supreme Market Institute homepage! 🎉

---

## Project Tour

### Main Pages

1. **Home** (`/`) - Landing page with hero, philosophy, and features
2. **Doctrine** (`/doctrine`) - Trading philosophy and core beliefs
3. **Learning Path** (`/learning-path`) - 7-level course curriculum
4. **Dashboard** (`/dashboard`) - Interactive trading analysis
5. **Community** (`/community`) - Social features and leaderboard

### Key Features

- 🤖 **AI Chatbot** - Click the green button in bottom-right corner
- 🎤 **Voice Input** - Click the microphone icon to speak
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- ⚡ **Fast** - Optimized with Next.js 14

---

## Customization

### Update Brand Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  royal: {
    green: '#014421',    // Change this
    emerald: '#046307',  // And this
  },
  accent: {
    gold: '#C9A227',     // Your accent color
  },
}
```

### Update Content

Main content files:
- `components/Hero.tsx` - Landing page hero text
- `components/Philosophy.tsx` - Core trading principles
- `app/doctrine/page.tsx` - Full doctrine page

### Add Your Logo

1. Place logo in `public/logo.png`
2. Update `components/Navigation.tsx`:

```tsx
<Image src="/logo.png" width={48} height={48} alt="Logo" />
```

---

## Development Tips

### Hot Reload

When you save files, the browser auto-refreshes. No need to restart the server!

### Check for Errors

```powershell
npm run lint
```

### Build for Production

Test production build:
```powershell
npm run build
npm run start
```

---

## Deploy to Vercel (10 minutes)

### Option 1: GitHub + Vercel (Easiest)

1. **Create GitHub repository**:
   - Go to [github.com/new](https://github.com/new)
   - Name: `jsupreme-market-institute`
   - Click "Create repository"

2. **Push code to GitHub**:
```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jsupreme-market-institute.git
git push -u origin main
```

3. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repo
   - Click "Deploy"
   - Done! Your site is live in 2 minutes 🚀

### Option 2: Vercel CLI

```powershell
npm install -g vercel
vercel login
vercel
```

Follow prompts, then:
```powershell
vercel --prod
```

Your site is live!

---

## Common Issues

### Port Already in Use

If you see "Port 3000 is already in use":

```powershell
# Kill the process
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### Voice Input Not Working

Voice input requires:
- ✅ HTTPS (works on Vercel automatically)
- ✅ Chrome, Edge, or Safari browser
- ✅ Microphone permissions granted

### Build Errors

Clear cache and rebuild:
```powershell
Remove-Item -Recurse -Force .next
npm run build
```

---

## Next Steps

1. ✅ Customize colors and branding
2. ✅ Update trading content
3. ✅ Add your social media links in Footer
4. ✅ Deploy to Vercel
5. ✅ Set up custom domain (optional)
6. ✅ Add analytics (Vercel Analytics)
7. ✅ Enable OpenAI API for advanced chatbot

---

## Resources

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Framer Motion**: [framer.com/motion](https://www.framer.com/motion)

---

## Get Help

- 📧 Email: support@jsupreme.com
- 💬 Discord: [Join Community](https://discord.gg/jsupreme)
- 🐦 Twitter: [@jsupreme](https://twitter.com/jsupreme)

---

## What's Included

✅ Modern Next.js 14 app with App Router
✅ TypeScript for type safety
✅ Tailwind CSS for styling
✅ Framer Motion animations
✅ AI chatbot with trading knowledge
✅ Voice-to-text input (Web Speech API)
✅ Interactive trading dashboard
✅ 7-level learning system
✅ Community features
✅ Responsive design
✅ SEO optimized
✅ Vercel-ready deployment

---

**You're all set!** 🎉

Start building your trading education empire.

*Questions? Check DEPLOYMENT.md for advanced deployment options.*
