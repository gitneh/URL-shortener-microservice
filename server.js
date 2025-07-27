const express = require('express');
const dns = require('dns');
const url = require('url');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// In-memory storage for URLs
const urlDatabase = new Map();
let urlCounter = 1;

// Helper function to validate URL format
function isValidUrl(urlString) {
  try {
    const urlObj = new URL(urlString);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

// Helper function to verify URL exists using DNS lookup
function verifyUrlExists(urlString) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(urlString);
      const hostname = urlObj.hostname;
      
      dns.lookup(hostname, (err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } catch (e) {
      resolve(false);
    }
  });
}

// POST /api/shorturl - Create shortened URL
app.post('/api/shorturl', async (req, res) => {
  const { url: originalUrl } = req.body;

  // Check if URL is provided
  if (!originalUrl) {
    return res.json({ error: 'invalid url' });
  }

  // Validate URL format
  if (!isValidUrl(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Verify URL exists using DNS lookup
  const urlExists = await verifyUrlExists(originalUrl);
  if (!urlExists) {
    return res.json({ error: 'invalid url' });
  }

  // Check if URL already exists in database
  for (const [shortUrl, storedUrl] of urlDatabase.entries()) {
    if (storedUrl === originalUrl) {
      return res.json({
        original_url: originalUrl,
        short_url: shortUrl
      });
    }
  }

  // Store the URL with incremental counter
  const shortUrl = urlCounter;
  urlDatabase.set(shortUrl, originalUrl);
  urlCounter++;

  res.json({
    original_url: originalUrl,
    short_url: shortUrl
  });
});

// GET /api/shorturl/:short_url - Redirect to original URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url, 10);

  // Check if short_url is a valid number
  if (isNaN(shortUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Check if short URL exists in database
  const originalUrl = urlDatabase.get(shortUrl);
  if (!originalUrl) {
    return res.json({ error: 'No short URL found for the given input' });
  }

  // Redirect to original URL
  res.redirect(originalUrl);
});

// Health check endpoint
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('URL Shortener Microservice - API Running');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
