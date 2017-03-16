import * as Promise from 'bluebird'
import * as fileSystem from 'fs'
const fs: any = Promise.promisifyAll(fileSystem)

function checkPathsAreDirectories(...paths: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
        Promise.map(paths, (path: string) => {
            return fs.statAsync(path)
                .then((stat: any) => stat.isDirectory())
                .catch((error: any) => {
                    if (error.code == 'ENOENT') {
                        return false // File / folder doesn't exist fall back to then validation
                    }
                    reject(error) // If an error occured we reject
                })
        })
        .then((validation: boolean[]) => {
            let failureIndex: number = validation.indexOf(false)
            if (failureIndex !== -1) {
                reject(`${paths[failureIndex]} is not a directory`)
            } else {
                resolve(paths)
            }
        })
    })
}

export default checkPathsAreDirectories