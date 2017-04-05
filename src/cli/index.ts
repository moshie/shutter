"use strict"

import * as Promise from 'bluebird'

import sanitize from './sanitizer'

import Compare from '../compare/compare'
import {optionsInterface} from './options-interface'
import {environmentsInterface} from './environments-interface'
import directoriesExistIn from '../utilities/directories-exist-in'

import Screenshot from '../screenshot/site-screenshot'
import Crawler from '../crawl/experiment-crawler'

export function handleScreenshots(rawEnvironments: string[], options: optionsInterface): any {

	//TODO: This needs optimizing too much blocking code seperate each validation check out to its own async
	const environments: environmentsInterface = sanitize(rawEnvironments) 


	const crawler = new Crawler(environments[Object.keys(environments)[0]])
	const chunk = new Chunker(10);
	const file = new JSONFile(options.directory)
	const capture = new Screenshot(environments, options.directory)

	// URL -> BUFFER -> FILE -> SCREENSHOT

	// http://colprint.co.uk/pathname -> 
	// [http://colprint.co.uk/pathname, http://colprint.co.uk/pathtwo]
	// CHUNK GETS PUT IN A FILE passes file name on
	// phantomjs captures the chunk

	crawler // READABLE
		.pipe(chunk) // TRANSFORM | http://stackoverflow.com/questions/38482445/how-to-chunk-a-stream-of-objects
		.pipe(file) // TRANSFORM
		.pipe(capture) // WRITABLE

	
	// If its a file
	fs.createReadStream('paths.json')
		.pipe(chunker)
		.pipe(file)
		.pipe(capture)

	// TODO: Works However could benefit from speed improvement
	// 
	// const capture = new Screenshot(environments, options.directory)
	// const crawler = new Crawler(environments)
	// const operation = options.paths ? capture.run(options.paths) : crawler.crawl().then((paths: string[]) => capture.run(paths))

	// return operation.catch((error: any) => console.log(error)) // TODO(David): Create error handler function
}

export function handleCompare(original: string, comparison: string, options: optionsInterface): Promise<any> {

	// TODO: Implement directoriesExistIn!
	if (directoriesExistIn(options.directory || process.cwd(), original, comparison)) {
		return (new Compare(original, comparison, options.directory)).run()
	}

	let environments: string[] = [`original=${original}`, `comparison=${comparison}`]

	return handleScreenshots(environments, options)
		.then((environments: environmentsInterface) => {
			console.log('Started');
			return handleCompare('original', 'comparison', options)
		})
		.catch((error: any) => console.log(error)) // TODO(David): Create error handler function
}