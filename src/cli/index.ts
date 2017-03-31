import * as Promise from 'bluebird'

import Compare from '../compare/index'
import crawl from '../crawl'
import sanitize from './sanitizer'
import Screenshot from '../screenshot/index'
import directoriesExistIn from '../utilities/directories-exist-in'
import {environmentsInterface} from './environments-interface'
import {optionsInterface} from './options-interface'
import Crawler from '../crawl/index'

export function handleScreenshots(rawEnvironments: string[], options: optionsInterface): Promise<environmentsInterface> {

	const environments: environmentsInterface = sanitize(rawEnvironments)
	const capture = (new Screenshot(environments, options.directory)).run
	const crawler = new Crawler(environments)
	const operation = options.paths ? capture(options.paths) : crawler.crawl().then(capture)

	return operation.catch((error: any) => console.log(error)) // TODO(David): Create error handler function
}

export function handleCompare(original: string, comparison: string, options: optionsInterface): Promise<any> {

	if (directoriesExistIn(options.directory || process.cwd(), original, comparison)) {
		return (new Compare(original, comparison, options.directory)).run()
	}

	let environments: string[] = [`original=${original}`, `comparison=${comparison}`]

	return handleScreenshots(environments, options)
		.then((environments: environmentsInterface) => handleCompare('original', 'comparison', options))
		.catch((error: any) => console.log(error)) // TODO(David): Create error handler function
}