import * as path from 'path'
import { Duplex } from 'stream'
import * as queue from 'queue'
import * as Promise from 'bluebird'
import { defaults } from 'lodash/object'
import * as BlinkDiff from 'blink-diff'

import * as mkdirp from 'mkdirp'
const mkdir: any = Promise.promisify(mkdirp)

import * as fileSystem from 'fs'
const fs: any = Promise.promisifyAll(fileSystem)

import { optionsInterface } from '../screenshot/interfaces'
import { comparisonInterface, strictComparisonInterface } from './interfaces'

class Compare extends Duplex {

    /**
     * Default options
     * @type {optionsInterface}
     */
    options: optionsInterface = {
        directory: process.cwd(),
        paths: undefined,
        chunkSize: 10,
        concurrency: 10
    }

    /**
     * Environments
     * @type {queue}
     */
    queue: queue

    /**
     * Original environment
     * @type {string}
     */
    originalEnvironment: string

    /**
     * Comparison environment
     * @type {string}
     */
    comparisonEnvironment: string

    /**
     * Comparison directory
     * @type {string}
     */
    comparisonDirectory: string

    /**
     * Original paths
     * @type {string[]}
     */
    originalPaths: string[]

    /**
     * Comparison paths
     * @type {string[]}
     */
    comparisonPaths: string[]

    /**
     * Compare constructor
     * 
     * @param {optionsInterface} options
     */
    constructor(options: optionsInterface) {
        super({ writableObjectMode: true, readableObjectMode: true })
        this.options = defaults(options, this.options)
        this.sanitizeDirectory()
        this.queue = queue({ concurrency: this.options.concurrency, autostart: true })
    }

    /**
     * Duplex stream write implementation
     * 
     * @param {comparisonInterface} screenshots
     * @param {null|string}         encoding
     * @param {() => void}          callback
     */
    _write(screenshots: comparisonInterface, encoding: null|string, callback: () => void) {
        console.log(screenshots);
        //this.run(screenshots)
        callback()
    }

    /**
     * Begin the comparison of screenshots
     * 
     * @param  {comparisonInterface} screenshots
     * @return {any}
     */
    run(screenshots: comparisonInterface): any {
        screenshots = this.setData(screenshots)

        this.queue.push((next) => {
            mkdir(this.comparisonDirectory)
                .then(() => this.compareChunk())
            next()
        })
    }

    /**
     * Set the data needed to compare paths
     * 
     * @param  {comparisonInterface}       screenshots
     * @return {strictComparisonInterface}
     */
    setData(screenshots: comparisonInterface): strictComparisonInterface {
        let sanitizedScreenshots: strictComparisonInterface = this.arrayPaths(screenshots)
        let [originalEnvironment, comparisonEnvironment]: string[] = Object.keys(sanitizedScreenshots)

        this.originalEnvironment = originalEnvironment
        this.comparisonEnvironment = comparisonEnvironment
        this.comparisonDirectory = path.resolve(this.options.directory, `${originalEnvironment}_${comparisonEnvironment}_comparisons`)
        this.originalPaths = sanitizedScreenshots[originalEnvironment]
        this.comparisonPaths = sanitizedScreenshots[comparisonEnvironment]

        return sanitizedScreenshots
    }

    /**
     * Ensure the paths are typeof array
     * 
     * @param  {comparisonInterface} screenshots
     * @return {any}
     */
    arrayPaths(screenshots: comparisonInterface): any {
        let [originalEnvironmentName, comparisonEnvironmentName] = Object.keys(screenshots)
        let originals: string[]|string = screenshots[originalEnvironmentName]
        let comparisons: string[]|string = screenshots[comparisonEnvironmentName]

        if (typeof originals == 'string') {
            screenshots[originalEnvironmentName] = [originals]
        }

        if (typeof comparisons == 'string') {
            screenshots[comparisonEnvironmentName] = [comparisons]
        }

        return screenshots
    }

    /**
     * Compare the comparison data chunk
     * 
     * @return {Promise<any>} [description]
     */
    compareChunk(): Promise<any> {
        return Promise.map(this.originalPaths, (filepath: string, index: number, length: number) => {
            let originalPath: string = path.resolve(this.options.directory, filepath)
            let comparisonPath: string = path.resolve(this.options.directory, this.comparisonPaths[index])

            return fs.accessAsync(originalPath, fileSystem.constants.F_OK | fileSystem.constants.R_OK)
                .then(() => fs.accessAsync(comparisonPath, fileSystem.constants.F_OK | fileSystem.constants.R_OK))
                .then(() => this.compare(originalPath, comparisonPath))
        }, {concurrency: 10})
    }

    /**
     * Compare two screenshots
     * 
     * @param  {string}       original
     * @param  {string}       comparison
     * @return {Promise<any>}
     */
    compare(original: string, comparison: string): Promise<any> {
        let diff: BlinkDiff = new BlinkDiff({
            imageAPath: original,
            imageBPath: comparison,
            thresholdType: BlinkDiff.THRESHOLD_PERCENT,
            threshold: 0.10, // 10% Threshold
            outputBackgroundBlue: 255,
            outputBackgroundGreen: 255,
            outputBackgroundRed: 255,
            outputBackgroundOpacity: 0.8,
            composition: false,
            outputMaskOpacity: 1,
            imageOutputPath: path.join(this.comparisonDirectory, path.basename(original))
        })

        return new Promise((resolve, reject) => {
            diff.run((error: any, result: any) => {
                if (error) {
                    reject(error)
                    return
                }
                resolve(result.code)
            })
        })
    }

    /**
     * Ensure the directory works with ~/ for mac
     */
    sanitizeDirectory() {
        if (typeof this.options.directory !== 'undefined' && this.options.directory[0] === '~') {
            this.options.directory = path.join(process.env.HOME, this.options.directory.slice(1))
        }
    }

}

export default Compare