import * as Promise from 'bluebird'

import Compare from '../compare'
import sanitize from './sanitizer'
import Screenshot from '../screenshot'
import {directoriesExistIn} from '../utilities'
import environmentsInterface from './environments-interface'

export function handleScreenshot(rawEnvironments: string[], options: any): Promise<string[]> {

	const environments: environmentsInterface = sanitize(rawEnvironments)
	const capture = (new Screenshot(environments, options.directory)).run
	const operation = options.paths ? capture(options.paths) : crawl(environments).then(capture)

	return operation.catch((error: any) => console.log(error)) // TODO(David): Create error handler function
}

export function handleCompare(original: string, comparison: string, options: any): Promise<any> {

	if (directoriesExistIn(options.directory || process.cwd(), original, comparison)) {
		return (new Compare(original, comparison, options.directory)).run()
	}

	let environments: string[] = [`original=${original}`, `comparison=${comparison}`]

	return handleScreenshot(environments, options)
		.then((environments: string[]) => handleCompare('original', 'comparison', options))
		.catch((error: any) => console.log(error)) // TODO(David): Create error handler function
}