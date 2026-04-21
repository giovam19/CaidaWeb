class Mutex {
    private queue: Array<() => void>;
    private locked: boolean;

    public constructor() {
        this.queue = [];
        this.locked = false;
    }

    public lock(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.locked) {
                this.locked = true;
                resolve();
            } else {
                this.queue.push(resolve);
            }
        });
    }

    public unlock() {
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            
            if (next){
                next(); // 🔥 pasa el lock al siguiente
            }
        } else {
            this.locked = false;
        }
    }
}

export = Mutex;