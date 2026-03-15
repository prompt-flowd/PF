// Configuration
const CONFIG = {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || 'YOUR_OPENROUTER_API_KEY_HERE',
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    MODEL: 'mistralai/mistral-small-3.1-24b-instruct:free',
    GITHUB_USERNAME: 'prompt-flowd' // Replace with your GitHub username
};

// Default articles for first-time users
const DEFAULT_ARTICLES = [
    {
        id: 1,
        title: "Mastering Prompt Engineering Fundamentals",
        description: "Learn the core principles of writing effective AI prompts. Understand how to structure your requests for better results.",
        link: "#"
    },
    {
        id: 2,
        title: "Advanced Techniques for Complex Prompts",
        description: "Explore advanced strategies like few-shot learning, role-playing, and chain-of-thought prompting.",
        link: "#"
    },
    {
        id: 3,
        title: "Using PromptGenius for Content Creation",
        description: "Discover how to leverage our AI prompt generator for marketing, blogging, and social media content.",
        link: "#"
    }
];

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
    setupEventListeners();
    checkAPIKey();
});

// Setup all event listeners
function setupEventListeners() {
    const generateBtn = document.getElementById('generate-btn');
    const userInput = document.getElementById('user-input');

    generateBtn.addEventListener('click', generatePrompt);
    
    // Allow Enter key to generate (Ctrl+Enter in textarea)
    userInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            generatePrompt();
        }
    });
}

// Check if API key is set
function checkAPIKey() {
    if (CONFIG.OPENROUTER_API_KEY === 'YOUR_OPENROUTER_API_KEY_HERE') {
        showToast('⚠️ API Key not configured. Please set your OPENROUTER_API_KEY environment variable.', 5000);
        console.warn('OpenRouter API Key not configured. To use this feature:');
        console.warn('1. Get your API key from https://openrouter.ai/keys');
        console.warn('2. Set it as an environment variable: OPENROUTER_API_KEY');
        console.warn('3. Or update CONFIG.OPENROUTER_API_KEY in script.js');
    }
}

// Main function to generate prompt
async function generatePrompt() {
    const userInput = document.getElementById('user-input').value.trim();
    const tone = document.getElementById('tone-select').value;
    const generateBtn = document.getElementById('generate-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const outputDiv = document.getElementById('prompt-output');
    const copyBtn = document.getElementById('copy-btn');

    // Validation
    if (!userInput) {
        showToast('❌ Please enter your idea first!', 3000);
        return;
    }

    if (CONFIG.OPENROUTER_API_KEY === 'YOUR_OPENROUTER_API_KEY_HERE') {
        showToast('❌ API Key not configured. Please set OPENROUTER_API_KEY.', 4000);
        return;
    }

    // Disable button and show loading state
    generateBtn.disabled = true;
    loadingSpinner.classList.remove('hidden');
    outputDiv.innerHTML = '<p class="text-slate-400 text-center py-8">⏳ Generating your prompt...</p>';
    copyBtn.classList.add('hidden');

    try {
        const prompt = buildSystemPrompt(userInput, tone);
        const response = await callGroqAPI(prompt);
        
        if (response) {
            outputDiv.innerHTML = `<p class="text-slate-100 whitespace-pre-wrap">${escapeHtml(response)}</p>`;
            copyBtn.classList.remove('hidden');
            showToast('✅ Prompt generated successfully!', 3000);
        }
    } catch (error) {
        console.error('Error generating prompt:', error);
        outputDiv.innerHTML = `<p class="text-red-400">❌ Error: ${escapeHtml(error.message)}</p>`;
        showToast('❌ Error generating prompt. Check console for details.', 4000);
    } finally {
        generateBtn.disabled = false;
        loadingSpinner.classList.add('hidden');
    }
}

// Build the system prompt based on user input and tone
function buildSystemPrompt(userInput, tone) {
    const toneDescriptions = {
        professional: "professional, formal, and business-appropriate",
        casual: "casual, friendly, and conversational",
        technical: "technical, detailed, and comprehensive",
        creative: "creative, imaginative, and engaging"
    };

    const toneDesc = toneDescriptions[tone] || toneDescriptions.professional;

    return `You are an expert prompt engineer. Based on the user's idea, create a detailed, professional, and ${toneDesc} AI prompt that can be used with large language models.

The prompt should:
1. Be clear and specific
2. Include context and background if relevant
3. Specify the desired output format
4. Include any relevant constraints or guidelines
5. Be optimized for best results with AI models

User's idea: "${userInput}"

Generate a complete, ready-to-use prompt that can be directly used with an AI model. Start immediately with the prompt content, no preamble.`;
}

// Call OpenRouter API
async function callGroqAPI(userPrompt) {
    const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CONFIG.OPENROUTER_API_KEY}`,
            'HTTP-Referer': `https://${CONFIG.GITHUB_USERNAME}.github.io`,
            'X-Title': 'AI Prompt Generator',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: CONFIG.MODEL,
            messages: [
                {
                    role: 'user',
                    content: userPrompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// Copy to clipboard
function copyToClipboard() {
    const outputDiv = document.getElementById('prompt-output');
    const text = outputDiv.innerText;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('📋 Copied to clipboard!', 2000);
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fallback copy to clipboard for older browsers
function fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast('📋 Copied to clipboard!', 2000);
    } catch {
        showToast('❌ Failed to copy', 2000);
    }
    document.body.removeChild(textarea);
}

// Reset generator
function resetGenerator() {
    document.getElementById('user-input').value = '';
    document.getElementById('tone-select').value = 'professional';
    document.getElementById('prompt-output').innerHTML = '<p class="text-slate-400 text-center py-8">Your generated prompt will appear here...</p>';
    document.getElementById('copy-btn').classList.add('hidden');
    showToast('🔄 Reset complete!', 2000);
}

// ============== ARTICLE MANAGEMENT ==============

// Load articles from localStorage or use defaults
function loadArticles() {
    const stored = localStorage.getItem('promptgenius_articles');
    const articles = stored ? JSON.parse(stored) : DEFAULT_ARTICLES;
    
    if (!stored) {
        localStorage.setItem('promptgenius_articles', JSON.stringify(articles));
    }

    displayArticles(articles);
    updateArticlesList(articles);
}

// Display articles in the main section
function displayArticles(articles) {
    const container = document.getElementById('articles-container');
    
    if (articles.length === 0) {
        container.innerHTML = '<p class="text-slate-400 col-span-full text-center py-8">No articles yet. Check back soon!</p>';
        return;
    }

    container.innerHTML = articles.map(article => `
        <div class="dark-glass rounded-xl p-6 hover-lift">
            <h3 class="text-lg font-semibold mb-3">${escapeHtml(article.title)}</h3>
            <p class="text-slate-400 mb-4 line-clamp-3">${escapeHtml(article.description)}</p>
            <div class="flex items-center justify-between">
                <span class="text-xs text-slate-500">${new Date().toLocaleDateString()}</span>
                ${article.link && article.link !== '#' ? 
                    `<a href="${escapeHtml(article.link)}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 transition text-sm">Read More →</a>` 
                    : '<span class="text-slate-600 text-sm">Read More →</span>'
                }
            </div>
        </div>
    `).join('');
}

// Update articles list in admin modal
function updateArticlesList(articles) {
    const list = document.getElementById('articles-list');
    
    if (articles.length === 0) {
        list.innerHTML = '<p class="text-slate-400 text-sm">No articles added yet.</p>';
        return;
    }

    list.innerHTML = articles.map((article, index) => `
        <div class="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-700">
            <div class="flex-1">
                <p class="font-medium text-sm">${escapeHtml(article.title)}</p>
                <p class="text-xs text-slate-400 truncate">${escapeHtml(article.description.substring(0, 50))}...</p>
            </div>
            <button 
                type="button"
                onclick="deleteArticle(${article.id})" 
                class="ml-3 px-2 py-1 bg-red-900/50 hover:bg-red-900 text-red-300 rounded text-xs transition"
            >
                Delete
            </button>
        </div>
    `).join('');
}

// Add new article
function addArticle() {
    const title = document.getElementById('article-title').value.trim();
    const desc = document.getElementById('article-desc').value.trim();
    const link = document.getElementById('article-link').value.trim();

    // Validation
    if (!title || !desc) {
        showToast('❌ Please fill in title and description!', 3000);
        return;
    }

    if (title.length > 100) {
        showToast('❌ Title is too long (max 100 characters)', 3000);
        return;
    }

    if (desc.length > 500) {
        showToast('❌ Description is too long (max 500 characters)', 3000);
        return;
    }

    // Get existing articles
    const stored = localStorage.getItem('promptgenius_articles');
    const articles = stored ? JSON.parse(stored) : DEFAULT_ARTICLES;

    // Add new article
    const newArticle = {
        id: Date.now(),
        title,
        description: desc,
        link: link || '#'
    };

    articles.unshift(newArticle);

    // Limit to 50 articles for demo
    if (articles.length > 50) {
        articles.pop();
    }

    // Save to localStorage
    localStorage.setItem('promptgenius_articles', JSON.stringify(articles));

    // Clear form and refresh
    document.getElementById('article-title').value = '';
    document.getElementById('article-desc').value = '';
    document.getElementById('article-link').value = '';

    loadArticles();
    showToast('✅ Article added successfully!', 3000);
}

// Delete article
function deleteArticle(id) {
    if (confirm('Are you sure you want to delete this article?')) {
        const stored = localStorage.getItem('promptgenius_articles');
        let articles = stored ? JSON.parse(stored) : DEFAULT_ARTICLES;

        articles = articles.filter(a => a.id !== id);

        localStorage.setItem('promptgenius_articles', JSON.stringify(articles));
        loadArticles();
        showToast('✅ Article deleted!', 2000);
    }
}

// ============== UTILITY FUNCTIONS ==============

// Show toast notification
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    toastMessage.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============== API KEY SETUP INSTRUCTIONS ==============

console.log('%c PromptGenius - Setup Instructions', 'font-size: 16px; font-weight: bold; color: #3b82f6;');
console.log('%c1. Get your OpenRouter API key from: https://openrouter.ai/keys', 'font-size: 12px; color: #94a3b8;');
console.log('%c2. Set the environment variable: export OPENROUTER_API_KEY="your_key_here"', 'font-size: 12px; color: #94a3b8;');
console.log('%c3. Update CONFIG.GITHUB_USERNAME with your GitHub username in script.js', 'font-size: 12px; color: #94a3b8;');
console.log('%c4. Or update CONFIG.OPENROUTER_API_KEY in script.js (not recommended for production)', 'font-size: 12px; color: #94a3b8;');
console.log('%cFor local testing, you can use: CONFIG.OPENROUTER_API_KEY = "your_key_here";', 'font-size: 12px; color: #f97316; font-weight: bold;');
