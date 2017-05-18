import * as path from 'path'
import { Duplex } from 'stream'
import * as queue from 'queue'
import * as Promise from 'bluebird'

import { optionsInterface } from '../screenshot/interfaces'

class Compare extends Duplex {

    options: optionsInterface = {
        directory: process.cwd(),
        paths: undefined,
        chunkSize: 10,
        concurrency: 10
    }

    constructor(options: optionsInterface) {
        super({ writableObjectMode: true, readableObjectMode: true })
        //this.options = defaults(options, this.options)
    }

    _write(screenshots: any, encoding: null|string, callback: () => void) {

        console.log(screenshots);

        // screenshots = \/
        // {
        //     original: ['/path/'],
        //     comparison: ['/path/'],
        //     develop: ['/']
        // }

        // {
        //     original: '/path/original.png',
        //     comparison: '/path/comparison.png'
        // }

        //this.compare(screenshots)

        callback();
    }



    compare(screenshots: any): any {

        // this.queue.push((next) => {


        // })

    }

}

export default Compare