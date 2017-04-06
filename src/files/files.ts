import { Transform } from 'stream'

import * as fs from 'fs'
import * as path from 'path'

class Files extends Transform {

	/**
	 * Directory to put files
	 * @type {string}
	 */
	directory: string

	/**
	 * Incrementing file index
	 * @type {number}
	 */
	index: number = 0

	/**
	 * Files constructor
	 * 
	 * @param {string = process.cwd()} directory
	 */
	constructor(directory: string = process.cwd()) {
		super({ objectMode: true })
		this.directory = directory
	}

	/**
	 * Transformation stream implementation
	 * 
	 * @param {Buffer|string|any} 	chunk
	 * @param {string} 				encoding
	 * @param {() => void} 			done
	 */
	_transform(chunk: Buffer | string | any, encoding: string, done: () => void): void {
		let filename: string = `chunk-${this.index}.json`
		let resolved = path.resolve(this.directory, filename)
		let stream = fs.createWriteStream(resolved)

		stream.write(JSON.stringify(chunk))
		stream.end()
		this.push(resolved)
		this.index++
		done()
	}

}

export default Files