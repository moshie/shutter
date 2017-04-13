"use strict"

import * as fs from 'fs'
import * as path from 'path'
import * as queue from 'queue'
import { Writable } from 'stream'
import * as Promise from 'bluebird'
const unlinkAsync: any = Promise.promisify(fs.unlink)

import Phantom from './capturers/phantom'
import { CapturerInterface, environmentsInterface } from '../interfaces'

class Capture extends Writable {
    
    /**
     * Specifed environments
     * @type {environmentsInterface}
     */
    environments: environmentsInterface

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

    /**
     * Screenshot capture constructor
     * 
     * @param environments 
     * @param base 
     * @param options 
     */
    constructor(environments: environmentsInterface) {
        super({ objectMode: true })
        this.environments = environments
        this.capturer = new Phantom(environments)
        this.queue = queue({ concurrency: 5, autostart: true })
    }

    /**
     * Screenshot write stream implemention
     * 
     * @param {string} filename 
     * @param {null|string} encoding 
     * @param {Function} callback 
     */
    _write(filename: string, encoding: null|string, callback: () => void) {

        this.queue.push((next) => {
            this.screenshotChunk(filename)
                .then((chunkFilename: string) => this.removeChunk(chunkFilename))
                .then(() => next())
        })

        callback()
    }

    /**
     * Remove file
     * 
     * @param {string} filename 
     */
    removeChunk(filename: string): Promise<any> {
        return unlinkAsync(filename)
    }

    /**
     * Screenshot each environment chunk
     * 
     * @param {string} filename
     */
    screenshotChunk(filename: string): Promise<string> {
        let chunkQueue: Promise<any>[] = []
        let environments: string[] = Object.keys(this.environments)

        for (var i = environments.length - 1; i >= 0; i--) {
            chunkQueue.push(
                this.capturer.capture(filename, environments[i])
            )
        }

        return Promise.join(...chunkQueue).then(() => filename)
    }

}

export default Capture