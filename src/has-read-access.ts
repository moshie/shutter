import * as fs from 'fs'
import * as Promise from 'bluebird'
const fsA: any = Promise.promisifyAll(fs);

function hasReadAccess(chunkFilepath: string): Promise<string> {
	return fsA.accessAsync(chunkFilepath, fs.constants.F_OK | fs.constants.R_OK)
		.then(() => chunkFilepath)
		.catch((error: string) => {
			return `No Read access to ${chunkFilepath}`
		})
}

export default hasReadAccess