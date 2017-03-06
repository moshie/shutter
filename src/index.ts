import {environmentsInterface} from './environments-interface'
import writeChunkToFile from './write-chunk-to-file'
import multiShot from './multi-shot'
import chunk from './chunk'

import * as Promise from 'bluebird'
import * as fileSystem from 'fs'
const fs: any = Promise.promisifyAll(fileSystem)

// TBA
// compare copy master


// screenshot master https://www.google.com/ copy https://dev.google.com/ test https://test.google.com/


const environments: environmentsInterface = {
	'master': 'https://www.serentipi.co.uk',
	'develop': 'https://www.serentipi.co.uk',
	'test': 'https://www.serentipi.co.uk'
}

// Crawl first domain get back list of paths

const paths: string[] = [
	'/',
	'/contact/',
	'/home',
	'/your-event/',
	'/weddings/',
	'/corporate/',
	'/private-functions/',
	'/our-story',
	'/gallery/',
	'/friends-venues/',
	'/open-days/',
	'/quote-me/'
]

// Chunk paths 

const chunks: string[][] = chunk(paths, 6);

// loop through each chunk add it to a file `chunk-{index}.json` then for each environment run screenshot:

Promise.map(chunks, (chunk: string[], index: number): Promise<string> => {
	let filename: string = `chunk-${index}.json`;
	return writeChunkToFile(filename, JSON.stringify(chunk))
		.then((chunkFilename: string) => multiShot(environments, chunkFilename))
		.then((chunkFilename: string) => fs.unlinkAsync(chunkFilename))
}, {concurrency: 6})
	.catch((errors: any) => {
		console.log(errors)
	})
