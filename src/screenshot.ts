import * as Promise from 'bluebird'
import hasReadAccess from './has-read-access'
import phantomScreenshot from './phantom-shell'

function screenshot(chunkFilepath: string, domain: string, environment: string): Promise<string[]> {
	return hasReadAccess(chunkFilepath)
		.then((filepath) => {
			return phantomScreenshot(filepath, domain, environment)
		})
		.catch((error: string) => {
			console.log(error)
		})
}

export default screenshot
