import * as ora from 'ora'
import * as path from 'path'
import * as fileSystem from 'fs'
import * as Promise from 'bluebird'
import * as BlinkDiff from 'blink-diff'
const fs: any = Promise.promisifyAll(fileSystem)

export default class Compare {

	/**
	 * original
	 * @type {string}
	 */
	original: string

	/**
	 * comparison
	 * @type {string}
	 */
	comparison: string

	/**
	 * base
	 * @type {string}
	 */
	base: string

	/**
	 * Full original path
	 * @type {string}
	 */
	originalPath: string

	/**
	 * Full comparison path
	 * @type {string}
	 */
	comparisonPath: string

	/**
	 * Comparison folder path
	 * @type {string}
	 */
	comparisonFolderPath: string

	/**
	 * removed slashes for _
	 * @type {string}
	 */
	sanatizedOriginal: string

	/**
	 * removed slashes for _
	 * @type {string}
	 */
	sanatizedComparison: string

	/**
	 * Compare constructor
	 * 
	 * @param {string} original
	 * @param {string} comparison
	 * @param {string} base
	 */
	constructor(original: string, comparison: string, base: string = process.cwd()) {
		this.original = original
		this.comparison = comparison
		this.sanatizedOriginal = original.replace(/^\/|\/$/g, '').replace(/\//g, '_');
		this.sanatizedComparison = comparison.replace(/^\/|\/$/g, '').replace(/\//g, '_');
		this.base = base
		this.originalPath = path.resolve(this.base, this.original)
		this.comparisonPath = path.resolve(this.base, this.comparison)
		this.comparisonFolderPath = path.resolve(this.base, `${this.sanatizedOriginal}_${this.sanatizedComparison}_comparisons`)
	}

	/**
	 * Begin Comparison
	 */
	run(): Promise<any> {

		const spinner = ora(`Comparing ${this.original} with ${this.comparison} 🏞  <=> 🏞`).start()
		
		return this.areDirectories(this.originalPath, this.comparisonPath)
			.then((paths: string[]) => this.makeComparisonFolder(paths))
			.then((comparisonPath: string) => this.compareFolder(comparisonPath))
			.then(() => spinner.succeed(`Comparison complete ${this.comparisonFolderPath}`))
			.catch((error: any) => spinner.fail(error.message))
	}

	/**
	 * Create the folder to place comparisons into
	 * 
	 * @param  {string[]} paths
	 * @return {Promise<any>}
	 */
	protected makeComparisonFolder(paths: string[]): Promise<any> {
		return new Promise((resolve, reject) => {
			return fs.statAsync(this.comparisonFolderPath, (error: any, stat: any) => {
				if (error && error.code !== 'ENOENT') {
					reject(error)
				} else if (error && error.code === 'ENOENT') {
					return fs.mkdir(this.comparisonFolderPath, (_error: any) => {
						if (_error) {
							reject(_error)
						}
						resolve(this.comparisonFolderPath)
					})
				} else {
					resolve(this.comparisonFolderPath)
				}
			})
		})
	}

	/**
	 * Check the paths are directories
	 * 
	 * @param  {string[]} paths
	 * @return {Promise<any>}
	 */
	protected areDirectories(...paths: string[]): Promise<any> {
		return new Promise((resolve, reject) => {
			Promise.map(paths, (path: string) => {
				return fs.statAsync(path)
					.then((stat: any) => stat.isDirectory())
					.catch((error: any) => {
						if (error.code == 'ENOENT') {
							return false
						}
						reject(error)
					})
			}, {concurrency: 6})
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

	/**
	 * Compare Images in a folder
	 * 
	 * @param  {string}       original   [description]
	 * @param  {string}       comparison [description]
	 * @return {Promise<any>}            [description]
	 */
	protected compareFolder(comparisonPath: string): Promise<any> {
		return Promise.map(fs.readdirAsync(this.originalPath), (filename: string) => {
			let originalResolved: string = path.resolve(this.originalPath, filename)
			let comparisonResolved: string = path.resolve(this.comparisonPath, filename)

			// TODO: Check the filename is not a directory and is a png
			return fs.accessAsync(originalResolved, fileSystem.constants.F_OK | fileSystem.constants.R_OK)
				.then(() => fs.accessAsync(comparisonResolved, fileSystem.constants.F_OK | fileSystem.constants.R_OK))
				.then(() => this.compare(originalResolved, comparisonResolved))
		}, {concurrency: 10})
	}

	/**
	 * Compare one image against another
	 * 
	 * @param  {string} original
	 * @param  {string} comparison
	 * @return {Promise<any>}
	 */
	protected compare(original: string, comparison: string): Promise<any> {
		let diff: BlinkDiff = new BlinkDiff({
			imageAPath: original,
			imageBPath: comparison,
			thresholdType: BlinkDiff.THRESHOLD_PERCENT,
			threshold: 0.05, // 5% Threshold
			outputBackgroundBlue: 255,
			outputBackgroundGreen: 255,
			outputBackgroundRed: 255,
			outputBackgroundOpacity: 0.8,
			composition: false,
			outputMaskOpacity: 1,
			imageOutputPath: path.join(this.base, `${this.original}_${this.comparison}_comparisons`, path.basename(original))
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

}
