class Mutex {
    constructor() {
        this.queue = [];
        this.locked = false;
    }

    lock() {
        return new Promise(resolve => {
            if (!this.locked) {
                this.locked = true;
                resolve();
            } else {
                this.queue.push(resolve);
            }
        });
    }

    unlock() {
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            next(); // 🔥 pasa el lock al siguiente
        } else {
            this.locked = false;
        }
    }
}

module.exports = Mutex;