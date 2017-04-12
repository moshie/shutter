"use strict"

import * as fs from 'fs'
import * as path from 'path'
import * as Promise from 'bluebird'

import { Writable } from 'stream'

const unlinkAsync: any = Promise.promisify(fs.unlink)

import * as queue from 'queue'
import Phantom from './phantom'
import CapturerInterface from './capturer-interface'
import { environmentsInterface } from '../cli/environments-interface'

class Screenshot extends Writable {
    
    /**
     * Specifed environments
     * @type {environmentsInterface}
     */
    environments: environmentsInterface

    /**
     * Filepath base
     * @type {string}
     */
    base: string

    /**
     * Queue system
     * @type {queue}
     */
    queue: queue

    /**
     * Screenshot capturer
     * @type {CapturerInterface}
     */
    capturer: CapturerInterface

    constructor(environments: environmentsInterface, base: string  = process.cwd(), options = {}) {
        super({ objectMode: true })
        this.environments = environments
        this.capturer = new Phantom(environments)
        this.base = base
        this.queue = queue({ concurrency: 3, autostart: true })
    }

    _write(filename, encoding, callback) {

        console.log(filename);

        this.queue.push((next) => {
            this.screenshotChunk(filename)
                .then((chunkFilename: string) => this.removeChunk(chunkFilename))
                .then(() => next())
        })

        callback()
    }

    removeChunk(chunkFilename: string): Promise<any> {
        return unlinkAsync(chunkFilename)
    }

    screenshotChunk(chunkFilename: string): Promise<string> {
        let chunkQueue: Promise<any>[] = []
        let environments: string[] = Object.keys(this.environments)

        for (var i = environments.length - 1; i >= 0; i--) {
            chunkQueue.push(
                this.capturer.capture(chunkFilename, environments[i])
            )
        }

        return Promise.join(...chunkQueue).then(() => chunkFilename)
    }
}

export default Screenshot