import * as path from 'path'
import * as Promise from 'bluebird'
import * as fileSystem from 'fs'
const fs: any = Promise.promisifyAll(fileSystem)

function makeComparisonFolder(original: string, comparison: string): Promise<any> {
    const comparisonFolder = `${path.basename(original)}_${path.basename(comparison)}_comparisons`
    const comparisonPath = path.join(process.cwd(), comparisonFolder);
    return new Promise((resolve, reject) => {
        return fs.statAsync(comparisonPath, (error: any, stat: any) => {
            if (error && error.code !== 'ENOENT') {
                // Other obscure error
                reject(error)
            } else if (error && error.code === 'ENOENT') {
                // Make directory directory doesn't exist
                return fs.mkdir(comparisonPath, (_error: any) => {
                    if (_error) {
                        reject(error)
                    }
                    resolve(comparisonPath)
                });
            } else {
                resolve(comparisonPath)
            }
        })
    })
}

export default makeComparisonFolder