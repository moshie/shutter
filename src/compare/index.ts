import * as path from 'path'
import { Duplex } from 'stream'
import * as queue from 'queue'
import * as Promise from 'bluebird'
import { defaults } from 'lodash/object'

import * as fileSystem from 'fs'
const fs: any = Promise.promisifyAll(fileSystem)

import { optionsInterface } from '../screenshot/interfaces'

class Compare extends Duplex {

    options: optionsInterface = {
        directory: process.cwd(),
        paths: undefined,
        chunkSize: 10,
        concurrency: 10
    }

    comparisonFolderPath: string

    queue: queue

    constructor(options: optionsInterface) {
        super({ writableObjectMode: true, readableObjectMode: true })
        if (typeof options.directory !== 'undefined' && options.directory[0] === '~') {
            options.directory = path.join(process.env.HOME, options.directory.slice(1))
        }
        this.options = defaults(options, this.options)
        this.queue = queue({ concurrency: this.options.concurrency, autostart: true })
    }

    _write(screenshots: any, encoding: null|string, callback: () => void) {

        //this.compare(screenshots)

        callback()
    }



    compare(screenshots: any): any {
        let [originalEnvironmentName, comparisonEnvironmentName] = Object.keys(screenshots);
        let originals = Array.from(screenshots[originalEnvironmentName]);
        let comparisons = Array.from(screenshots[comparisonEnvironmentName]);

        // this.queue.push((next) => {
            
        // })

        // Create comparison directory
    }



}

export default Compare