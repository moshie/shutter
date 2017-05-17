import { Transform } from 'stream'

class Combiner extends Transform {

    /**
     * Collector constructor
     * 
     * @param {number} size
     */
    constructor() {
        super({ objectMode: true })
    }

    /**
     * Transformation stream implementation
     * 
     * @param {Buffer|string|any}   chunk
     * @param {string}              encoding
     * @param {Function}            done
     */
    _transform(chunk: Buffer | string | any, encoding: string, done: () => void): void {
        if (this.collection.length === this.size) {
            this.push(this.collection)
            this.collection = []
        }

        this.collection.push(chunk)

        done()
    }

    /**
     * Flush remaining items in collection
     * 
     * @param {Function} done
     */
    _flush(done): void {
        this.push(this.collection)
        done()
    }

}

export default Collector