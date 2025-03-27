class CacheService {
    constructor() {
        this.items = new Map();
    }
    set(key, value, ttlSeconds) {
        const expiry = Date.now() + ttlSeconds * 1000;
        this.items.set(key, { value, expiry });
    }
    get(key) {
        const item = this.items.get(key);
        if (!item)
            return null;
        // Check if expired
        if (Date.now() > item.expiry) {
            this.items.delete(key);
            return null;
        }
        return item.value;
    }
    delete(key) {
        this.items.delete(key);
    }
    clear() {
        this.items.clear();
    }
}
export const cache = new CacheService();
