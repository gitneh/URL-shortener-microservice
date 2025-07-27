interface UrlEntry {
  original_url: string;
  short_url: number;
}

export interface IStorage {
  createUrl(data: { original_url: string }): Promise<UrlEntry>;
  getUrlByShortId(shortId: number): Promise<UrlEntry | undefined>;
  getUrlByOriginal(originalUrl: string): Promise<UrlEntry | undefined>;
}

export class MemStorage implements IStorage {
  private urls = new Map<number, UrlEntry>();
  private urlsByOriginal = new Map<string, UrlEntry>();
  private nextId = 1;

  async createUrl({ original_url }: { original_url: string }): Promise<UrlEntry> {
    // Check if URL already exists
    const existing = this.urlsByOriginal.get(original_url);
    if (existing) {
      return existing;
    }

    // Create new entry
    const entry: UrlEntry = {
      original_url,
      short_url: this.nextId++
    };

    // Store in both maps
    this.urls.set(entry.short_url, entry);
    this.urlsByOriginal.set(original_url, entry);

    return entry;
  }

  async getUrlByShortId(shortId: number): Promise<UrlEntry | undefined> {
    return this.urls.get(shortId);
  }

  async getUrlByOriginal(originalUrl: string): Promise<UrlEntry | undefined> {
    return this.urlsByOriginal.get(originalUrl);
  }
}

export const storage = new MemStorage();