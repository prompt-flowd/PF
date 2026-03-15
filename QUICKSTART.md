# PromptGenius - Quick Start Guide

## ⚡ 5-Minute Setup

### 1️⃣ Get Groq API Key (2 minutes)
- Go to: https://console.groq.com/keys
- Create a new API key
- Copy it

### 2️⃣ Set Environment Variable (1 minute)

**Windows PowerShell:**
```powershell
$env:GROQ_API_KEY="paste_your_key_here"
python -m http.server 8000
```

**Windows Command Prompt:**
```bash
set GROQ_API_KEY=paste_your_key_here
python -m http.server 8000
```

**Mac/Linux Terminal:**
```bash
export GROQ_API_KEY="paste_your_key_here"
python3 -m http.server 8000
```

### 3️⃣ Open Application (10 seconds)
- Open browser
- Go to: `http://localhost:8000`
- You should see the PromptGenius website! 🎉

### 4️⃣ Test It Out (1 minute)
- Type something like: "Create a prompt for writing professional emails"
- Click "Generate Prompt"
- See your AI-generated prompt!
- Click "Copy to Clipboard" to copy it

## 📝 Example Prompts to Try

### Marketing
"Create a prompt for writing compelling product descriptions"

### Development
"Write a prompt for generating clean, well-commented Python code"

### Content Creation
"Build a prompt for brainstorming blog post ideas on AI trends"

### Education
"Create a prompt for explaining complex programming concepts"

## 🎨 Customizing Your Site

### Change Colors
Edit `index.html`, look for color classes like:
- `from-blue-400` → change to `from-cyan-400`
- `bg-slate-950` → change to `bg-gray-950`

### Add Your Articles
1. Click "Admin" button
2. Fill in article details
3. Click "Add Article"
4. Your articles are saved automatically!

### Change AI Model
Edit `script.js`, find:
```javascript
MODEL: 'llama-3.1-70b-versatile'
```

Change to any of:
- `llama-3.1-8b-instant` (faster)
- `mixtral-8x7b-32768` (bigger)

## ❓ Troubleshooting

### "API Key not configured" warning
→ Make sure you set the environment variable BEFORE starting the server

### Button doesn't work
→ Check browser console (F12 → Console) for errors

### Copying doesn't work
→ Try a different browser, some older ones have limitations

### Articles don't save
→ Check if localStorage is enabled in browser settings

## 🚀 Next Steps

1. **Customize colors** - Make it match your brand
2. **Add real articles** - Use the Admin panel
3. **Deploy it** - Host on Vercel, Netlify, or GitHub Pages
4. **Add your contact** - Update footer links
5. **Optimize SEO** - Add meta tags for your keywords

## 📖 More Information

- Full README: See `README.md`
- API Setup Details: See `API_SETUP.md`
- Groq Documentation: https://console.groq.com/docs

## 🎯 Common Questions

### Can I use this without an API key?
No, you need Groq API key to generate prompts.

### Is my data saved?
Only articles are saved (in browser's localStorage). Prompts aren't saved.

### Can I deploy this?
Yes! Works great on Vercel, Netlify, GitHub Pages, or any web host.

### Can I add user authentication?
Yes, you'd need a backend service. The frontend is ready for it.

### Can I use a different AI model?
Yes, any OpenAI-compatible API will work with modifications.

## 🎓 Learning Resources

- **Prompt Engineering**: https://www.promptengineering.org
- **Groq API**: https://console.groq.com/docs
- **Tailwind CSS**: https://tailwindcss.com
- **Vanilla JavaScript**: https://developer.mozilla.org/en-US/docs/Web/JavaScript

## 🤝 Need Help?

1. Check the browser console (F12)
2. Read `API_SETUP.md` for detailed setup
3. Visit `https://console.groq.com/docs`
4. Check your internet connection

---

👏 **You're all set! Start generating amazing prompts!**

Made with ❤️ by PromptGenius
