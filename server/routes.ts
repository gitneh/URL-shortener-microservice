import { Router } from 'express';
import { promisify } from 'util';
import { lookup } from 'dns';
import { storage } from './storage';

const router = Router();
const dnsLookup = promisify(lookup);

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

async function verifyDomain(hostname: string): Promise<boolean> {
  try {
    await dnsLookup(hostname);
    return true;
  } catch {
    return false;
  }
}

router.post('/api/shorturl', async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.json({ error: 'invalid url' });
  }

  if (!isValidUrl(url)) {
    return res.json({ error: 'invalid url' });
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Skip DNS lookup for localhost and IP addresses
    const isLocalOrIP = hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname);
    
    if (!isLocalOrIP) {
      const domainExists = await verifyDomain(hostname);
      if (!domainExists) {
        return res.json({ error: 'invalid url' });
      }
    }

    const result = await storage.createUrl({ original_url: url });
    res.json(result);
  } catch (error) {
    res.json({ error: 'invalid url' });
  }
});

router.get('/api/shorturl/:short_url', async (req, res) => {
  const shortId = parseInt(req.params.short_url, 10);

  if (isNaN(shortId)) {
    return res.json({ error: 'No short URL found for given input' });
  }

  try {
    const urlEntry = await storage.getUrlByShortId(shortId);
    
    if (!urlEntry) {
      return res.json({ error: 'No short URL found for given input' });
    }

    res.redirect(urlEntry.original_url);
  } catch (error) {
    res.json({ error: 'No short URL found for given input' });
  }
});

export default router;