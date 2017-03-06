import {environmentsInterface} from './environments-interface'
import screenshot from './screenshot'
import * as Promise from 'bluebird'
import * as fileSystem from 'fs'

const fs: any = Promise.promisifyAll(fileSystem)

function multiShot(environments: environmentsInterface, chunkFilename: string): Promise<string> {
	var promises: Promise<string[]>[] = []
	Object.keys(environments).forEach((env: string) => {
		// Scope is important here!
		promises.push(
			screenshot(chunkFilename, environments[env], env)
		)
	})

	return Promise.join(...promises)
		.then(() => chunkFilename)
		.catch((errors: any) => {
			console.log(errors)
		})
}

export default multiShot