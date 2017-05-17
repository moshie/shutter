import * as path from 'path'
import { Duplex } from 'stream'
import * as queue from 'queue'
import * as Promise from 'bluebird'

import { comparisonInterface } from './interfaces'

class Compare extends Duplex {

    /**
     * Queue system
     * @type {queue}
     */
    queue: queue

    constructor(directory: string = process.cwd(), concurrency: number = 10) {
        super({ writableObjectMode: true, readableObjectMode: true })
        directory = directory[0] === '~' ? path.join(process.env.HOME, directory.slice(1)) : directory;
        this.queue = queue({ concurrency, autostart: true })
    }

    _write(screenshots: comparisonInterface, encoding: null|string, callback: () => void) {
        // screenshots = \/
        // {
        //     original: ['/path/'],
        //     comparison: ['/path/'],
        //     develop: ['/']
        // }

        this.queue((next) => {
            this.compare(screenshots).then(() => next())
        })
    }

    compare(screenshots: comparisonInterface): any {
        
    }

}

export default Compare