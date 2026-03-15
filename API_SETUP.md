# API Setup & Configuration Guide

## 🔑 Getting Your Groq API Key

### Step 1: Visit Groq Console
1. Go to [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up with your Google or GitHub account (or create an account)
3. Verify your email if needed

### Step 2: Create API Key
1. Click "Create API Key"
2. Give it a name (e.g., "PromptGenius")
3. Copy the API key immediately (you won't see it again!)
4. Store it securely

## ⚙️ Environment Variable Setup

### Windows (Command Prompt)

**Temporary (for current session only):**
```bash
set GROQ_API_KEY=sk_your_api_key_here
```

**Permanent (System-wide):**
1. Press `Win + R`
2. Type `sysdm.cpl` and press Enter
3. Go to "Advanced" tab → "Environment Variables"
4. Click "New..." under System variables
5. Variable name: `GROQ_API_KEY`
6. Variable value: `sk_your_api_key_here`
7. Click OK and restart your terminal/IDE

### Windows (PowerShell)

**Temporary:**
```powershell
$env:GROQ_API_KEY="sk_your_api_key_here"
```

**Permanent:**
```powershell
[Environment]::SetEnvironmentVariable("GROQ_API_KEY", "sk_your_api_key_here", "User")
```
Then restart PowerShell.

### Mac/Linux (Terminal)

**Temporary (current session):**
```bash
export GROQ_API_KEY="sk_your_api_key_here"
```

**Permanent (add to ~/.bash_profile or ~/.zshrc):**
```bash
echo 'export GROQ_API_KEY="sk_your_api_key_here"' >> ~/.bash_profile
source ~/.bash_profile
```

For zsh users:
```bash
echo 'export GROQ_API_KEY="sk_your_api_key_here"' >> ~/.zshrc
source ~/.zshrc
```

## 🚀 Running the Application

### Option 1: Python HTTP Server (Recommended for beginners)

**With environment variable set:**

Windows (PowerShell):
```powershell
$env:GROQ_API_KEY="sk_your_api_key_here"
python -m http.server 8000
```

Windows (Command Prompt):
```bash
set GROQ_API_KEY=sk_your_api_key_here
python -m http.server 8000
```

Mac/Linux:
```bash
export GROQ_API_KEY="sk_your_api_key_here"
python3 -m http.server 8000
```

Then open: `http://localhost:8000`

### Option 2: Node.js HTTP Server

```bash
npm install -g http-server
http-server
```

Then open: `http://localhost:8080`

### Option 3: Live Server (VS Code Extension)

1. Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Set environment variable in terminal before launching VS Code:
   ```bash
   # Mac/Linux
   export GROQ_API_KEY="sk_your_api_key_here"
   code .
   
   # Windows
   set GROQ_API_KEY=sk_your_api_key_here && code .
   ```

### Option 4: Using Node.js Express (Advanced)

Create `server.js`:
```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('./'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
```

Run:
```bash
node server.js
```

## 🔒 Direct Configuration (Development Only)

If you don't want to use environment variables (NOT recommended for production):

### Edit script.js

Find this line:
```javascript
GROQ_API_KEY: process.env.GROQ_API_KEY || 'YOUR_GROQ_API_KEY_HERE',
```

Replace with:
```javascript
GROQ_API_KEY: 'sk_your_actual_api_key_here',
```

❌ **WARNING**: This exposes your API key in client-side code. Never do this in production!

## 🧪 Testing Your Setup

### Check if API Key is Available

**In browser console (F12 → Console):**
```javascript
console.log(CONFIG.GROQ_API_KEY);
```

Should show your API key (or the placeholder if not configured).

### Test API Connection

Run this in browser console:
```javascript
fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${CONFIG.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10
    })
}).then(r => r.json()).then(console.log);
```

Expected response: JSON with `choices` array and message content.

## 📋 API Models Available

### Current Options
- **`llama-3.1-70b-versatile`** ⭐ Best for this project
  - 70B parameters
  - Great for detailed prompts
  - ~500-2000ms response time

- **`llama-3.1-8b-instant`** ⚡ Fastest
  - 8B parameters
  - Faster responses (~300-1000ms)
  - Less capable for complex prompts

- **`mixtral-8x7b-32768`** 📊 Largest context
  - 8x7B MoE model
  - Supports 32K tokens
  - Good for long prompts

### Change Model

Edit in `script.js`:
```javascript
MODEL: 'llama-3.1-70b-versatile'
```

Change to one of the available models above.

## 🔧 Groq API Parameters Explained

### Temperature (0.0 - 2.0)
- **0.0**: Deterministic, always same output
- **0.7**: Balanced (current setting)
- **1.5+**: Creative, random outputs

**For prompts**: 0.7 is good. For creative use: try 1.0-1.2

### Max Tokens (1 - varies by model)
- **Current**: 1024
- **For prompts**: 512-2048 usually enough
- **Increase for**: Longer outputs
- **Decrease for**: Faster responses

### Top P (0.0 - 1.0)
- **0.1**: Only most likely tokens
- **1.0**: All tokens possible (current setting)
- **Use 0.9**: For diversity without too much randomness

## 📊 Rate Limits

### Free Tier
- 25 requests per minute
- 5 concurrent requests
- No daily limit mentioned

### Rate Limit Headers
The API returns these headers:
- `RateLimit-Limit-Requests`: Max requests per time window
- `RateLimit-Remaining-Requests`: Requests remaining
- `RateLimit-Reset-Requests`: When limit resets

### If You Hit Rate Limits
```javascript
// Simple retry with delay
async function callWithRetry(prompt, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await callGroqAPI(prompt);
        } catch (error) {
            if (error.status === 429 && i < retries - 1) {
                const delay = Math.pow(2, i) * 1000; // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
}
```

## 🐛 Common Errors & Solutions

### "Error: 401 Unauthorized"
- API key is invalid or expired
- Solution: Get a new API key from console.groq.com

### "Error: 429 Too Many Requests"
- Rate limit exceeded
- Solution: Wait before making new requests

### "Error: 400 Bad Request"
- Invalid request format
- Solution: Check message format and parameters

### "Error: 500 Internal Server Error"
- Groq server issue
- Solution: Try again in a few moments

### "API Key not configured" in console
- Environment variable not set
- Solution: Follow environment setup steps above

## 🌍 Deployment Environment Variables

### Vercel
1. Go to Project Settings → Environment Variables
2. Add `GROQ_API_KEY` with your key
3. Redeploy

### Netlify
1. Site Settings → Build & Deploy → Environment
2. Add `GROQ_API_KEY` with your key
3. Redeploy build

### GitHub Pages (Static)
⚠️ Cannot use environment variables (static only)
Solutions:
- Use Vercel, Netlify, or other hosting
- Build a backend proxy
- Use GitHub Actions to build

### Heroku
```bash
heroku config:set GROQ_API_KEY=sk_your_key_here
```

### AWS Lambda
Set in Lambda environment variables or AWS Secrets Manager

## 🔒 Security Best Practices

1. ✅ Use environment variables, never hardcode keys
2. ✅ Regenerate keys if exposed
3. ✅ Use separate keys for dev/prod
4. ✅ Rotate keys periodically
5. ✅ Monitor API key usage in Groq console
6. ✅ Don't commit keys to version control
7. ✅ Use `.env` files with `.gitignore`

## 📝 .env File Setup (Optional)

Create `.env` file in your project:
```
GROQ_API_KEY=sk_your_api_key_here
```

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
node_modules/
```

Then load it (requires dotenv package with Node.js):
```javascript
require('dotenv').config();
const apiKey = process.env.GROQ_API_KEY;
```

## 📞 Support Resources

- **Groq Docs**: [https://console.groq.com/docs](https://console.groq.com/docs)
- **Groq Status**: [https://status.groq.com](https://status.groq.com)
- **API Models**: [https://console.groq.com/docs/models](https://console.groq.com/docs/models)
- **Rate Limits**: [https://console.groq.com/docs/rate-limits](https://console.groq.com/docs/rate-limits)

## ✅ Quick Checklist

- [ ] API key obtained from Groq console
- [ ] Environment variable set (`GROQ_API_KEY`)
- [ ] Server running locally
- [ ] Browser opened to correct URL
- [ ] No warnings in browser console
- [ ] Test prompt generation works
- [ ] Copy functionality works
- [ ] Articles save to localStorage

If all checked, you're ready to go! 🚀

---

**Last Updated**: March 2026
**Groq Model Tested**: Llama 3.1 70B Versatile
