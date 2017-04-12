import { Transform } from 'stream'

class Collector extends Transform {

    /**
     * Collection size
     * @type {number}
     */
    size: number

    /**
     * Collection of items
     * @type {string[]}
     */
    collection: string[] = []

    /**
     * Collector constructor
     * 
     * @param {number} size
     */
    constructor(size: number) {
        super({ objectMode: true })
        this.size = size
    }

    /**
     * Transformation stream implementation
     * 
     * @param {Buffer|string|any}  chunk
     * @param {string}             encoding
     * @param {() => void}         done
     */
    _transform(chunk: Buffer | string | any, encoding: string, done: () => void): void {
        if (this.collection.length == this.size) {
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