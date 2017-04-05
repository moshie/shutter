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
        super({})
        this.environments = environments
        this.capturer = new Phantom(environments)
        this.base = base
    }

    _write(chunk, encoding, callback) {
        let filename: string = path.resolve(this.base, `chunk-${this.index}.json`);
        var stream = fs.createWriteStream(filename)
        stream.write(chunk)
        stream.end();

        this.screenshotChunk(filename)
            .then((chunkFilename: string) => this.removeChunk(chunkFilename))
            .then(() => {this.index++})
            .then(() => callback())
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