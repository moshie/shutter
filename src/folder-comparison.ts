import * as path from 'path'
import * as Promise from 'bluebird'
import * as fileSystem from 'fs'
const fs: any = Promise.promisifyAll(fileSystem)

import compare from './compare'

function folderComparison(original: string, comparison: string) {
    return Promise.map(fs.readdirAsync(original), (filename: string) => {
        let originalResolved: string = path.resolve(original, filename)
        let comparisonResolved: string = path.resolve(comparison, filename)
        return fs.accessAsync(originalResolved, fs.constants.F_OK | fs.constants.R_OK) // Check file exists in first comparison
            .then(() => fs.accessAsync(comparisonResolved, fs.constants.F_OK | fs.constants.R_OK)) // Check file exists in second comparison
            .then(() => compare(originalResolved, comparisonResolved))
    }, {concurrency: 6})
}

export default folderComparison