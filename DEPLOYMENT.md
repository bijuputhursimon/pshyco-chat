# 🚀 Deployment Guide - Psychology Bot Swarm

## Overview

Psychology Bot Swarm is a **zero-deployment** application that runs entirely in the browser. No server setup, no build process, no installation required!

---

## Option 1: Local Use (Recommended for Personal Use)

### Windows
```powershell
# Simply double-click the HTML file, or run:
start psychology-bot-swarm.html
```

### macOS
```bash
open psychology-bot-swarm.html
```

### Linux
```bash
xdg-open psychology-bot-swarm.html
```

**That's it!** The application will open in your default browser and is ready to use.

---

## Option 2: Local Development Server (Optional)

If you want to run a local server for development or testing:

### Using Python
```bash
# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000/psychology-bot-swarm.html
```

### Using Node.js
```bash
npx serve .
# Or
npx http-server .

# Then visit the URL provided (usually http://localhost:3000)
```

### Using PHP
```bash
php -S localhost:8000
# Then visit: http://localhost:8000/psychology-bot-swarm.html
```

---

## Option 3: GitHub Pages (Free Hosting)

1. **Create a GitHub repository** and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/pshyco-chat.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main, Root: / (root)
   - Click Save

3. **Access your app** at: `https://yourusername.github.io/pshyco-chat/psychology-bot-swarm.html`

---

## Option 4: Netlify (Free Hosting with Drag & Drop)

1. Go to [netlify.com](https://www.netlify.com/)
2. Sign up for a free account
3. Drag and drop your project folder into Netlify
4. Your app will be live instantly at `https://your-app-name.netlify.app/psychology-bot-swarm.html`

**Bonus:** Netlify provides HTTPS automatically!

---

## Option 5: Vercel (Free Hosting)

1. Go to [vercel.com](https://vercel.com/)
2. Sign up with GitHub
3. Import your repository
4. Deploy! Your app will be at `https://your-app.vercel.app/psychology-bot-swarm.html`

---

## Option 6: Static Hosting Services

Psychology Bot Swarm works on any static hosting platform:

- **Cloudflare Pages** - Free, fast CDN
- **AWS S3 + CloudFront** - Scalable enterprise solution
- **Azure Static Web Apps** - Microsoft's free tier
- **DigitalOcean App Platform** - Simple deployment
- **Render** - Free static site hosting

---

## Mobile Deployment

### Progressive Web App (PWA) Ready

The application is already configured as a PWA with meta tags. Users can:

1. Open the app in mobile browser
2. Tap "Add to Home Screen" 
3. Launch like a native app!

### Build Native Apps (Optional)

Use wrappers to create native mobile apps:

#### Using Capacitor (iOS & Android)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/core
npx cap init PsychologyBotSwarm com.pshyco.chat
npx cap add android
npx cap add ios
```

#### Using Cordova
```bash
npm install -g cordova
cordova create pshyco com.pshyco.chat PsychologyBotSwarm
cd pshyco
cordova platform add android
cordova platform add ios
# Copy psychology-bot-swarm.html to www/ folder
```

---

## Environment Variables (Optional)

If you want to pre-configure API keys for users (not recommended for security):

### HTML Configuration
Edit `psychology-bot-swarm.html` and add default values:

```javascript
// In the Settings section
const apiKeyInput = document.getElementById('apiKey');
apiKeyInput.value = window.DEFAULT_API_KEY || ''; // Set via environment
```

**⚠️ Warning:** Never commit real API keys to version control!

---

## Security Considerations

### For Public Deployments

1. **API Key Management**: Users must provide their own Gemini API keys
2. **CORS**: The app makes direct browser-to-API calls (no proxy needed)
3. **HTTPS Required**: Always deploy with HTTPS for security
4. **No Server-Side Code**: Everything runs client-side, no backend vulnerabilities

### Rate Limiting

Google's free tier limits:
- 60 requests per minute
- 15,000 requests per day (varies by account)

For production use with many users, consider:
- Using Google Cloud Platform paid plans
- Implementing request queuing
- Adding user authentication and rate limiting per user

---

## Performance Optimization

### CDN Usage
The app already uses CDNs for dependencies:
- `marked.js` - Markdown parsing
- `highlight.js` - Code syntax highlighting  
- `@google/generative-ai` - Gemini SDK via esm.run

### Caching
Browsers will automatically cache these resources. For better control:

```html
<!-- Add to HTML head for aggressive caching -->
<meta http-equiv="Cache-Control" content="max-age=31536000, public">
```

---

## Monitoring & Analytics (Optional)

Since this is a privacy-focused app with no server-side code, traditional analytics don't apply. If you want to add analytics:

### Google Analytics
```html
<!-- Add to HTML head -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**⚠️ Note:** This would compromise the privacy-focused nature of the app. Use with caution and user consent.

---

## Troubleshooting Deployment Issues

### Issue: "CORS Error" when loading modules
**Solution**: Run a local server instead of opening file directly:
```bash
python -m http.server 8000
```

### Issue: API calls fail on some hosts
**Solution**: Ensure you're using HTTPS. Some browsers block certain APIs on HTTP.

### Issue: LocalStorage not working
**Solution**: Check browser settings - third-party cookies/storage might be blocked.

### Issue: Slow loading times
**Solution**: Use a CDN-hosted deployment (Netlify, Vercel, GitHub Pages all use CDNs).

---

## Update Checklist for Production

Before deploying updates:

- [ ] Test locally with `npm start` or direct file open
- [ ] Run test suite: `npm test` or open `tests/index.html`
- [ ] Check browser console for errors
- [ ] Verify all modals work (Settings, Personas, Groups)
- [ ] Test API key save/retrieve functionality
- [ ] Confirm markdown rendering works
- [ ] Update version number in package.json if needed
- [ ] Update CHANGELOG.md with changes

---

## Version History Template

```markdown
# Changelog

## [1.0.0] - 2026-04-24
### Added
- Initial production release
- Multi-persona chat system
- Google Gemini API integration
- LocalStorage persistence
- Trait-based persona customization

### Fixed
- CSS selector bug in loading indicator removal
- API provider alignment across all modules

### Changed
- Migrated from OpenAI to Google Gemini API
- Unified documentation for consistency
```

---

## Support Contacts

For deployment assistance:
- **Documentation**: See README.md and other .md files in project root
- **Issues**: Open GitHub issue with details
- **Browser Console**: Check F12 console for error messages

---

## Quick Deploy Commands Summary

### Local Testing
```bash
# Windows
start psychology-bot-swarm.html

# Mac/Linux  
open psychology-bot-swarm.html
```

### Development Server
```bash
python -m http.server 8000
# Visit: http://localhost:8000/psychology-bot-swarm.html
```

### GitHub Pages
```bash
git init && git add . && git commit -m "v1.0"
git push origin main
# Enable in GitHub Settings → Pages
```

### Netlify (Drag & Drop)
```bash
# Just drag the project folder to netlify.com/drop
```

---

**🎉 Your Psychology Bot Swarm is ready for deployment! Choose the method that best fits your needs and start sharing with users!**
