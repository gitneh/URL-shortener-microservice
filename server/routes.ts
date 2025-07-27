import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { lookup as dnsLookup } from "dns";
import { promisify } from "util";

const lookup = promisify(dnsLookup);

export async function registerRoutes(app: Express): Promise<Server> {
  // Endpoint para acortar URL
  app.post("/api/shorturl", async (req, res) => {
    const { url } = req.body;

    if (!url || !/^https?:\/\/.+\..+/.test(url)) {
      return res.json({ error: "invalid url" });
    }

    try {
      const parsedUrl = new URL(url);
      await lookup(parsedUrl.hostname); // Verifica DNS válido
    } catch (err) {
      return res.json({ error: "invalid url" });
    }

    const result = await storage.createUrl({ original_url: url });
    res.json(result);
  });

  // Endpoint para redirigir
  app.get("/api/shorturl/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const urlEntry = await storage.getUrlByShortId(id);

    if (urlEntry) {
      return res.redirect(urlEntry.original_url);
    }

    res.status(404).json({ error: "No short URL found for given input" });
  });

  const httpServer = createServer(app);
  return httpServer;
}