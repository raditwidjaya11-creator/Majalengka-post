class SafeStorage implements Storage {
  private memoryStore: Record<string, string> = {};

  get length(): number {
    try {
      return window.localStorage.length;
    } catch {
      return Object.keys(this.memoryStore).length;
    }
  }

  clear(): void {
    this.memoryStore = {};
    try {
      window.localStorage.clear();
    } catch (e) {
      console.warn("localStorage.clear failed:", e);
    }
  }

  getItem(key: string): string | null {
    try {
      const val = window.localStorage.getItem(key);
      if (val !== null) return val;
    } catch (e) {
      // Ignore and fallback to memoryStore
    }
    return this.memoryStore[key] !== undefined ? this.memoryStore[key] : null;
  }

  key(index: number): string | null {
    try {
      return window.localStorage.key(index);
    } catch {
      const keys = Object.keys(this.memoryStore);
      return keys[index] !== undefined ? keys[index] : null;
    }
  }

  removeItem(key: string): void {
    delete this.memoryStore[key];
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn("localStorage.removeItem failed:", e);
    }
  }

  setItem(key: string, value: string): void {
    // Always keep in memory fallback
    this.memoryStore[key] = String(value);

    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[safeLocalStorage] localStorage.setItem failed for "${key}" (QuotaExceeded or restricted). Kept in memory fallback.`, e);
      // Attempt to clean up temporary cache items if quota exceeded
      try {
        for (let i = window.localStorage.length - 1; i >= 0; i--) {
          const k = window.localStorage.key(i);
          if (k && (k.startsWith("temp_") || k.includes("draft") || k.includes("autosave"))) {
            window.localStorage.removeItem(k);
          }
        }
        window.localStorage.setItem(key, value);
      } catch (err2) {
        // Safe silence - already stored in memoryStore so the application will continue smoothly
      }
    }
  }
}

export const safeLocalStorage: Storage = new SafeStorage();

