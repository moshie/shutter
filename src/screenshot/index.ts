import * as path from 'path'
import * as fileSystem from 'fs'
import Phantom from './phantom'
import * as Promise from 'bluebird'
const fs: any = Promise.promisifyAll(fileSystem)

import chunk from '../utilities/chunk'
import {environmentsInterface} from '../cli/environments-interface'

class Screenshot {

    environments: environmentsInterface
    capturer: Capturer
    base: string

	constructor(environments: environmentsInterface, base: string = process.cwd()) { 
        this.environments = environments;
        this.capturer = new Phantom(environments)
        this.base = base;
    }

	run(paths: string[]) : Promise<environmentsInterface> {
		let chunkedPaths: string[][] = chunk(paths, 6)

        return this.multiScreenshot(chunkedPaths)
	}

    multiScreenshot(chunkedPaths: string[][]): Promise<string[]> {
        return Promise.map(chunkedPaths, (chunk: string[], index: number): Promise<string[]> => this.screenshot(chunk, index))
    }

    screenshot(chunk: string[], index: number) {
        let filename: string = path.resolve(this.base, `chunk-${index}.json`);

        return this.writeChunkFile(filename, chunk)
                .then(this.screenshotChunk)
                .then(this.removeChunk)
                .catch((error: string) => console.log(error));
    }

    writeChunkFile(filename: string, chunk: string[]): Promise<string> {
        return fs.writeFileAsync(filename, JSON.stringify(chunk)).then(() => filename)
    }

    screenshotChunk(chunkFilename: string): Promise<string> {
        let chunkQueue: Promise<string[]>[] = []
        let environments: string[] = Object.keys(this.environments)

        for (let environment in environments) {
            chunkQueue.push(
                this.capturer.capture(chunkFilename, environment)
            )
        }

        return Promise.all(chunkQueue).then(() => chunkFilename)
    }

    removeChunk(chunkFilename: string): Promise<environmentsInterface> {

    }

}

export default Screenshot