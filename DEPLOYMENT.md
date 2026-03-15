# PromptGenius - Deployment Guide

## 🚀 Deploying Your AI Prompt Generator

Choose your preferred hosting platform and follow the steps below.

---

## 1. ⚡ Vercel (Recommended - Easiest)

### Why Vercel?
- ✅ Easiest deployment
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Environment variables support
- ✅ GitHub integration

### Steps:

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/promptgenius.git
git branch -M main
git push -u origin main
```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Choose PromptGenius
   - Click "Import"

3. **Set Environment Variables**
   - In Vercel dashboard: Settings → Environment Variables
   - Add: `GROQ_API_KEY` = `your_api_key_here`
   - Click "Add"
   - Redeploy project

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site is live! 🎉

### After Deployment
- Your site automatically deploys on every push to main
- Custom domain support
- Preview URLs for each branch
- Analytics included

---

## 2. 🌐 Netlify

### Why Netlify?
- ✅ Easy Git integration
- ✅ Free tier included
- ✅ Build with environment variables
- ✅ Great documentation
- ✅ Continuous deployment

### Steps:

1. **Push to GitHub** (same as Vercel)

2. **Login to Netlify**
   - Go to https://netlify.com
   - Click "Log in with GitHub"
   - Authenticate

3. **New Site from Git**
   - Click "New site from Git"
   - Choose GitHub
   - Select promptgenius repository
   - Click "Deploy site"

4. **Configure Environment Variables**
   - Site settings → Build & Deploy → Environment
   - Click "Edit variables"
   - Add: `GROQ_API_KEY` = `your_api_key_here`
   - Trigger redeploy

5. **Redeploy**
   - Deploys → Trigger deploy → Deploy site

### Custom Domain
- Site settings → Domain management
- Add your domain
- Follow DNS instructions

---

## 3. 📘 GitHub Pages (Free Static Hosting)

### Why GitHub Pages?
- ✅ Completely free
- ✅ GitHub native
- ✅ No build step needed
- ✅ Includes .github.io domain
- ⚠️ Static only (no environment variables)

### Limitation
⚠️ **GitHub Pages doesn't support environment variables. You'll need to:**
1. Add API key directly to script.js (not recommended), OR
2. Use a different hosting service, OR
3. Access via GitHub Actions (advanced)

### Steps (if using direct API key):

1. **Push to GitHub**
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

2. **Enable GitHub Pages**
   - Repository → Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Click "Save"

3. **Access Your Site**
   - Your site will be at: `https://username.github.io/promptgenius`
   - Shows in Settings → Pages after a minute

### Recommended Alternative
If you need environment variables with GitHub, use Vercel or Netlify instead.

---

## 4. 🔷 Azure Static Web Apps

### Steps:

1. **Push to GitHub** (as above)

2. **Create Azure Account**
   - Go to https://portal.azure.com
   - Create account or login

3. **Create Static Web App**
   - New → Azure Static Web Apps
   - Enter details:
     - Name: promptgenius
     - Region: Closest to you
     - Resource Group: Create new

4. **GitHub Integration**
   - Sign in with GitHub
   - Select repository
   - Build preset: Custom
   - App location: ./
   - Output location: ./

5. **Environment Variables**
   - Go to Configuration
   - Add environment variable:
     - Name: GROQ_API_KEY
     - Value: your_api_key

6. **Deploy**
   - GitHub Actions automatically deploys
   - Check Actions tab for status

---

## 5. 🐳 Docker (For Advanced Users)

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy files
COPY . .

# Install http-server
RUN npm install -g http-server

# Expose port
EXPOSE 8080

# Set environment and start
CMD ["sh", "-c", "http-server -p 8080"]
```

### Build & Run

```bash
# Build
docker build -t promptgenius .

# Run
docker run -p 8080:8080 \
  -e GROQ_API_KEY=your_key_here \
  promptgenius
```

### Deploy to Docker Hub

```bash
# Tag image
docker tag promptgenius username/promptgenius

# Login
docker login

# Push
docker push username/promptgenius
```

---

## 6. ☁️ AWS S3 + CloudFront

### Steps:

1. **Create S3 Bucket**
   - S3 → Create bucket
   - Name: promptgenius-yourname
   - Unblock public access
   - Create

2. **Upload Files**
   - Upload all files to bucket
   - Set permissions to public

3. **Enable Static Website Hosting**
   - Bucket → Properties
   - Static website hosting → Enable
   - Index document: index.html
   - Save

4. **Create CloudFront Distribution**
   - CloudFront → Create distribution
   - Origin: Your S3 bucket
   - Distribution settings
   - Create

5. **Set Environment Variables**
   - Lambda@Edge function to inject variables
   - (Advanced - consider using Vercel instead)

---

## 7. 🎯 Render (Easy & Free)

### Steps:

1. **Push to GitHub**

2. **Create Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create New Static Site**
   - Dashboard → New → Static Site
   - Connect GitHub repository
   - Deploy promptgenius

4. **Configure**
   - Name: promptgenius
   - Build command: (leave empty)
   - Publish directory: /

5. **Environment Variables**
   - Environment → Environment variables
   - Add: GROQ_API_KEY = your_key
   - Redeploy

---

## 8. 💾 Heroku (Traditional Apps)

### Steps:

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login**
```bash
heroku login
```

3. **Create App**
```bash
heroku create promptgenius-yourname
```

4. **Add Buildpack**
```bash
heroku buildpacks:add heroku/nodejs
```

5. **Set Environment Variable**
```bash
heroku config:set GROQ_API_KEY=your_key_here
```

6. **Deploy**
```bash
git push heroku main
```

---

## 🔒 Environment Variables Security

### For All Platforms:

✅ **DO:**
- Store API key in platform's environment variables
- Use different keys for dev/prod
- Rotate keys regularly
- Monitor API usage

❌ **DON'T:**
- Hardcode API key in JavaScript
- Commit .env file to GitHub
- Share API key publicly
- Use same key for multiple projects

### Setting Environment Variables

**Vercel**: Settings → Environment Variables → Add
**Netlify**: Site settings → Build & Deploy → Environment → Edit
**GitHub Pages**: Cannot use environment variables
**Azure**: Configuration → Environment variables
**Render**: Environment → Environment variables

---

## 🔐 .htaccess for Apache Hosting

If deploying to Apache shared hosting:

```apache
# Enable GZIP compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/html "access plus 0 seconds"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/* "access plus 1 year"
</IfModule>

# Rewrite for pretty URLs
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

---

## 📊 Platform Comparison

| Platform | Cost | Setup Time | Environment Vars | Recommended |
|----------|------|-----------|------------------|-------------|
| Vercel | Free | 2 min | ✅ Yes | ⭐⭐⭐ |
| Netlify | Free | 2 min | ✅ Yes | ⭐⭐⭐ |
| GitHub Pages | Free | 2 min | ❌ No | ⭐⭐ |
| Render | Free | 3 min | ✅ Yes | ⭐⭐⭐ |
| Azure | Free Tier | 5 min | ✅ Yes | ⭐⭐ |
| AWS S3 | $0.50/mo | 10 min | ❌ Complex | ⭐ |
| Heroku | Free | 5 min | ✅ Yes | ⭐⭐ |

**Recommendation**: For beginners → **Vercel** or **Netlify**

---

## 🚠 Troubleshooting Deployments

### "API Key not found" Error
- ✅ Verify environment variable name matches exactly
- ✅ Redeploy after adding variables
- ✅ Check platform's documentation

### "CORS Error"
- ✅ This is client-side, no CORS issue with Groq API
- ✅ Check browser console for actual error
- ✅ Verify API key is correct

### "404 Not Found" on Routes
- ✅ Ensure index.html is in root
- ✅ Configure routing for static site
- ✅ Check platform documentation

### "Blank Page Loading"
- ✅ Check browser console for JS errors
- ✅ Verify all files uploaded correctly
- ✅ Clear browser cache and reload

---

## 📈 Performance Optimization

### Before Deployment:

1. **Minify CSS**
   - Can use Tailwind's PurgeCSS feature
   - Or use online minifiers

2. **Optimize Images** (if added)
   - Use WebP format
   - Compress with imagemin

3. **Enable Compression**
   - Most platforms enable gzip by default
   - Verify in performance settings

### After Deployment:

1. **Monitor Performance**
   - Use Lighthouse
   - Check Core Web Vitals
   - Monitor API response times

2. **Analyze Traffic**
   - Set up analytics
   - Track user behavior
   - Monitor errors

---

## 🎯 Recommended Setup for Most Users

### Best for Speed: **Vercel**
```bash
# 1. Push to GitHub
git push origin main

# 2. On Vercel dashboard
# - Import repository
# - Add GROQ_API_KEY
# - Deploy

# Done! Your site is live 🎉
```

### Best for Features: **Netlify**
- Same as Vercel
- Additional features like forms, functions
- Equal ease of deployment

### Best for Learning: **GitHub Pages**
- Free, simple deployment
- Good for learning
- Limited by environment variables

---

## 🔄 Continuous Deployment

All recommended platforms support continuous deployment:

1. **Push code to GitHub**
2. **Platform automatically**:
   - Builds your site
   - Runs tests (if configured)
   - Deploys to production
   - Updates your live site

No manual deployment needed after setup!

---

## 📞 Support

- **Vercel Support**: https://vercel.com/support
- **Netlify Support**: https://support.netlify.com
- **GitHub Pages**: https://docs.github.com/en/pages
- **Render Support**: https://render.com/docs

---

**Choose Vercel or Netlify for best experience! 🚀**

Happy deploying!
