import {environmentsInterface} from './environments-interface'
import writeChunkToFile from './write-chunk-to-file'
import multiShot from './multi-shot'
import * as path from 'path'
import * as Promise from 'bluebird'
import * as fileSystem from 'fs'
const fs: any = Promise.promisifyAll(fileSystem)

function screenshotChunk(environments: environmentsInterface, chunk: string[], index: number) {
	let filename: string = path.join(__dirname, `chunk-${index}.json`);
	return writeChunkToFile(filename, JSON.stringify(chunk))
	    .then((chunkFilename: string) => multiShot(environments, chunkFilename))
	    .then((chunkFilename: string) => fs.unlinkAsync(chunkFilename))
}

export default screenshotChunk