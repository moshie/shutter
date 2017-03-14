import * as fs from 'fs'
import * as Promise from 'bluebird'
const fsA: any = Promise.promisifyAll(fs);

function hasReadAccess(filepath: string): Promise<string> {
	return fsA.accessAsync(filepath, fs.constants.F_OK | fs.constants.R_OK)
		.then(() => filepath)
		.catch((error: string) => {
			return `No Read access to ${filepath}`
		})
}

export default hasReadAccess