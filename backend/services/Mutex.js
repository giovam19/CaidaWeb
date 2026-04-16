class Mutex {
    constructor() {
        this.locked = false;
    }

    async lock() {
        while (this.locked) {
            await new Promise(resolve => setTimeout(resolve, 10)); // Espera 10 milisegundos
        }
        this.locked = true;
    }

    unlock() {
        this.locked = false;
    }
}

module.exports = Mutex;