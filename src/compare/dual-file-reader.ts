"use strict"

import * as fs from 'fs'
import * as path from 'path'
import { Readable } from 'stream'
import { defaults } from 'lodash/object'

import { optionsInterface } from '../screenshot/interfaces'

class DualFileReader extends Readable {

    /**
     * Default options
     * @param {optionsInterface}
     */
    options: optionsInterface = {
        directory: process.cwd(),
        paths: undefined,
        chunkSize: 10,
        concurrency: 10
    }

    constructor(original, comparison, options) {
        super({objectMode: true})
        this.options = defaults(options, this.options)
    }

    _read(size: number): void {
        fs.readdir(this.original, )
    }

}