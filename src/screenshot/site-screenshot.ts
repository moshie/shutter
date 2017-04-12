import * as fs from 'fs'
import { environmentsInterface } from '../cli/environments-interface'
import { Writable } from 'stream'
import CapturerInterface from './capturer-interface'
import Phantom from './phantom'
import * as Promise from 'bluebird'
const unlinkAsync: any = Promise.promisify(fs.unlink);
import * as path from 'path'

class Screenshot extends Writable {

    environments: environmentsInterface

    base: string

    index: number = 0

    capturer: CapturerInterface

    constructor(environments: environmentsInterface, base: string  = process.cwd(), options = {}) {
        super({ objectMode: true })
        this.environments = environments
        this.capturer = new Phantom(environments)
        this.base = base
    }

    _write(filename, encoding, callback) {

        // TODO IMPLEMENT THE SAME QUEUE FROM site-crawler We dont wont 100s of instances of phantomjs running at the same time

        this.screenshotChunk(filename)
            .then((chunkFilename: string) => this.removeChunk(chunkFilename))

        this.index++;
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