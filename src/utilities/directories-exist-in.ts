import * as fs from 'fs'
import * as path from 'path'

export default function directoriesExistIn(base: string, ...paths: string[]): boolean {
	for (var i = paths.length - 1; i >= 0; i--) {
		let resolvedPath: string = path.resolve(base, paths[i])

		try {
			if (!fs.lstatSync(resolvedPath).isDirectory()) {
				return false
			}
		} catch (e) {
			return false
		}

	}

	return true
}