const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Claude API proxy endpoint
  if (pathname === '/api/claude/generate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const { prompt, model = 'claude-3-7-sonnet-20250219', maxTokens = 4000 } = JSON.parse(body);
        
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
          res.writeHead(response.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error }));
          return;
        }

        const data = await response.json();
        console.log('Claude API success, content length:', data.content?.[0]?.text?.length || 0);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      } catch (error) {
        console.error('Claude API error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message || 'Internal server error' }));
      }
    });
    return;
  }

  // Google Custom Search API proxy endpoint
  if (pathname === '/api/google/search' && req.method === 'GET') {
    (async () => {
      try {
        const { q, key, cx } = parsedUrl.query;
        
        console.log('Google Search request:', { q, key: key ? 'Present' : 'Missing', cx: cx ? 'Present' : 'Missing' });
        
        const response = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&q=${encodeURIComponent(q)}&num=10`
        );

        console.log('Google API response status:', response.status);

        if (!response.ok) {
          const error = await response.text();
          console.error('Google API error response:', error);
          res.writeHead(response.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error }));
          return;
        }

        const data = await response.json();
        console.log('Google API success, results count:', data.items?.length || 0);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      } catch (error) {
        console.error('Google API error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message || 'Internal server error' }));
      }
    })();
    return;
  }

  // Serve static files
  let filePath = path.join(__dirname, 'dist', pathname === '/' ? 'index.html' : pathname);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    // If file doesn't exist, serve index.html for SPA routing
    filePath = path.join(__dirname, 'dist', 'index.html');
  }

  const extname = path.extname(filePath);
  let contentType = 'text/html';
  
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found, serve index.html for SPA routing
        fs.readFile(path.join(__dirname, 'dist', 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
