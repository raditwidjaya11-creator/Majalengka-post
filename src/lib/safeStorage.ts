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
    } catch {
      // Safe fallback
    }
  }

  getItem(key: string): string | null {
    try {
      const val = window.localStorage.getItem(key);
      if (val !== null) return val;
    } catch {
      // Fallback to memoryStore
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
    } catch {
      // Safe fallback
    }
  }

  setItem(key: string, value: string): void {
    // Always keep full fidelity copy in memory for current session
    const valString = String(value);
    this.memoryStore[key] = valString;

    try {
      window.localStorage.setItem(key, valString);
    } catch {
      // QuotaExceededError or restricted storage in sandboxed iframe
      // 1. Attempt to free up storage by pruning temporary/cached keys
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k !== key && (k.startsWith("temp_") || k.includes("draft") || k.includes("autosave") || k.includes("valas") || k.includes("poll"))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => window.localStorage.removeItem(k));
        window.localStorage.setItem(key, valString);
        return;
      } catch {
        // Proceed to slimmed fallback if quota is still exceeded
      }

      // 2. If payload contains massive base64 images, store a lightweight copy in localStorage
      try {
        if (valString.includes("data:image")) {
          const slimmed = valString.replace(/data:image\/[a-zA-Z]+;base64,[^"']{500,}/g, "");
          window.localStorage.setItem(key, slimmed);
        }
      } catch {
        // 3. Silent fallback - memoryStore safely retains data for current runtime
      }
    }
  }
}

export const safeLocalStorage: Storage = new SafeStorage();


