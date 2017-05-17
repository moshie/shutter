"use strict"

import * as fs from 'fs'
import * as path from 'path'
import * as queue from 'queue'
import { Duplex } from 'stream'
import * as Promise from 'bluebird'
const unlinkAsync: any = Promise.promisify(fs.unlink)

import Phantom from './capturers/phantom'
import { CapturerInterface, environmentsInterface } from '../interfaces'

class Capture extends Duplex {
    
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
    constructor(environments: environmentsInterface, directory: string = process.cwd(), concurrency: number = 10) {
        super({ writableObjectMode: true, readableObjectMode: true })
        this.environments = environments
        directory = directory[0] === '~' ? path.join(process.env.HOME, directory.slice(1)) : directory;
        this.capturer = new Phantom(environments, directory)
        this.queue = queue({ concurrency, autostart: true })
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
                .then((paths: any) => {
                    this.removeChunk(filename)
                    return paths;
                })
                .then((paths) => next(false, paths))
                .catch((error) => {
                    console.error(error);
                })
        })

        callback()
    }

    _read(size: number) {
        this.queue.on('success', (result, job) => {
            this.push(result) // Result is passed as the second argument of next we need the file paths to be passed here
        })
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
    screenshotChunk(filename: string): Promise<any> {
        let chunkQueue: Promise<any>[] = []
        let environments: string[] = Object.keys(this.environments)

        for (var i = environments.length - 1; i >= 0; i--) {
            chunkQueue.push(
                this.capturer.capture(filename, environments[i])
            )
        }

        return Promise.join(...chunkQueue).then((screenshotPaths) => this.formatPaths(screenshotPaths))
    }

    /**
     * Format the paths into a readable format
     * 
     * @param screenshotPaths
     */
    formatPaths(screenshotPaths: string[][]): any {

        var formatted = {};

        screenshotPaths.forEach((chunk, index) => {

            let environmentName = Object.keys(this.environments)[index]

            formatted[environmentName] = screenshotPaths[index];
            
        })

        return formatted;
    }

}

export default Capture