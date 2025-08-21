const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Claude API proxy endpoint
app.post('/api/claude/generate', async (req, res) => {
  try {
    const { prompt, model = 'claude-3-5-sonnet-20241022', maxTokens = 4000 } = req.body;
    
    console.log('Claude API request:', { prompt: prompt.substring(0, 100) + '...', model, maxTokens });
    console.log('API Key:', process.env.VITE_ANTHROPIC_API_KEY ? 'Present' : 'Missing');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    console.log('Claude API response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error response:', error);
      return res.status(response.status).json({ error: error });
    }

    const data = await response.json();
    console.log('Claude API success, content length:', data.content?.[0]?.text?.length || 0);
    res.json(data);
  } catch (error) {
    console.error('Claude API error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Google Custom Search API proxy endpoint
app.get('/api/google/search', async (req, res) => {
  try {
    const { q, key, cx } = req.query;
    
    console.log('Google Search request:', { q, key: key ? 'Present' : 'Missing', cx: cx ? 'Present' : 'Missing' });
    
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&q=${encodeURIComponent(q)}&num=10`
    );

    console.log('Google API response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('Google API error response:', error);
      return res.status(response.status).json({ error: error });
    }

    const data = await response.json();
    console.log('Google API success, results count:', data.items?.length || 0);
    res.json(data);
  } catch (error) {
    console.error('Google API error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Serve index.html for all other routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// For development, still listen on port 3001
if (process.env.NODE_ENV !== 'production') {
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
