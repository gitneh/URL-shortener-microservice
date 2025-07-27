type UrlEntry = {
  original_url: string;
  short_url: number;
};

const urlDatabase = new Map<number, UrlEntry>();
let urlCounter = 0;

export const storage = {
  createUrl({ original_url }: { original_url: string }): UrlEntry {
    const short_url = ++urlCounter;

    const newEntry: UrlEntry = {
      original_url,
      short_url,
    };

    urlDatabase.set(short_url, newEntry);
    return newEntry;
  },

  getUrlByShortId(short_url: number): UrlEntry | undefined {
    return urlDatabase.get(short_url);
  },
};