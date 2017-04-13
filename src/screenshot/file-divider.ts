import { Transform } from 'stream'

import * as fs from 'fs'
import * as path from 'path'

class FileDivider extends Transform {

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
	 * @param {Function} 			done
	 */
	_transform(chunk: Buffer | string | any, encoding: string, done: () => void): void {
		let filename: string = `chunk-${this.index}.json`
		let resolved: string = path.join(this.directory, filename)
		if (this.directory[0] === '~') {
			resolved = path.join(process.env.HOME, this.directory.slice(1), filename)
		}
		let stream = fs.createWriteStream(resolved)

		stream.write(JSON.stringify(chunk))
		stream.end()
		this.push(resolved)
		this.index++
		done()
	}

}

export default FileDivider