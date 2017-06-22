import * as path from 'path'
import { Duplex } from 'stream'
import * as queue from 'queue'
import * as Promise from 'bluebird'
import { defaults } from 'lodash/object'
import * as BlinkDiff from 'blink-diff'

import * as mkdirp from 'mkdirp'
const mkdir: any = Promise.promisifyAll(mkdirp)

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
            options.directory = path.join(process.env.HOME, options.directory.slice(1)) // Ensure mac's ~/ works
        }
        this.options = defaults(options, this.options)
        this.queue = queue({ concurrency: this.options.concurrency, autostart: true })
    }

    _write(screenshots: any, encoding: null|string, callback: () => void) {

        this.run(screenshots)

        callback()
    }

    run(screenshots: any): any {
        screenshots = this.arrayPaths(screenshots)
        let [originalEnvironmentName, comparisonEnvironmentName]: string[] = Object.keys(screenshots)
        let comparisonFolder: string = path.resolve(
            this.options.directory, 
            `${originalEnvironmentName}_${comparisonEnvironmentName}_comparisons`
        )

        this.queue.push((next) => {
            mkdir(comparisonFolder)
                // .map() <- possibly map over the paths
                    // .then(() => ) <- Check the files exist before we compare them
                    // .then(() => ) <- Compare the files
                    // return back object with information about the comparison
                .catch((error) => console.log(error))

            next();
        })
        
    }

    protected compare(screenshots: any): any {

    }

    checkFilesExist(screenshots: any): any {
        new Promise((resolve, reject) => {
            let [originalEnvironmentName, comparisonEnvironmentName] = Object.keys(screenshots)
            var originalPaths = screenshots[originalEnvironmentName];
            var comparisonPaths = screenshots[comparisonEnvironmentName];
            for (var i = 0; i < originalPaths.length; ++i) {
                
            }
            fs.access()
        })
    }

    arrayPaths(screenshots: any): any {
        let [originalEnvironmentName, comparisonEnvironmentName] = Object.keys(screenshots)
        let originals: string[]|string = screenshots[originalEnvironmentName]
        let comparisons: string[]|string = screenshots[comparisonEnvironmentName]

        if (!Array.isArray(originals)) {
            screenshots[originalEnvironmentName] = [originals]
        }

        if (!Array.isArray(comparisons)) {
            screenshots[comparisonEnvironmentName] = [comparisons]
        }

        return screenshots;
    }



}

export default Compare