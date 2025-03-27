type CacheItem = {
    value: any;
    expiry: number;
};

class CacheService {
    private items = new Map<string, CacheItem>();

    set(key: string, value: any, ttlSeconds: number): void {
        const expiry = Date.now() + ttlSeconds * 1000;
        this.items.set(key, { value, expiry });
    }

    get(key: string): any {
        const item = this.items.get(key);
        if (!item) return null;

        // Check if expired
        if (Date.now() > item.expiry) {
            this.items.delete(key);
            return null;
        }

        return item.value;
    }

    delete(key: string): void {
        this.items.delete(key);
    }

    clear(): void {
        this.items.clear();
    }
}

export const cache = new CacheService();
