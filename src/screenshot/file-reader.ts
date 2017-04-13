"use strict"

import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import { Readable } from 'stream'
import * as indexOf from 'lodash/indexOf'

class FileReader extends Readable {

    /**
     * Filepath to YAML / JSON file
     * @param {string}
     */
    filepath: string

    /**
     * Permitted file types
     * @param {string[]}
     */
    allowedFiletypes: string[] = ['.yml', '.yaml', '.json']

    /**
     * File reader constructor
     * 
     * @param {string} filepath 
     */
    constructor(filepath: string) {
        super({objectMode: true})
        this.filepath = path.resolve(filepath)
        this.checkFilePath()
    }

    /**
     * Ensure the file is of the correct type
     */
    protected checkFilePath(): void {
        if (indexOf(this.allowedFiletypes, path.extname(this.filepath)) === -1) {
            console.log(`${this.filepath} must be a valid JSON or YAML file`) //TODO: Replace with logger
            process.exit(1)
        }
    }

    /**
     * File reader path implementation
     * 
     * @param {number} size 
     */
    _read(size: number): void {
        this.handlePaths()
    }

    /**
     * Handle paths
     */
    protected handlePaths(): void {
        var paths: string[] = this.getPaths()

        if (paths instanceof Array) {
            for (var i = paths.length - 1; i >= 0; i--) {
                if (typeof paths[i] === 'string') {
                    this.push(paths[i])
                }
            }
        }

        this.push(null)
    }

    /**
     * Get the paths from the file
     * 
     * @return {string[]|void} paths
     */
    protected getPaths(): string[] {
        try {
            return yaml.safeLoad(fs.readFileSync(this.filepath, 'utf8'))
        } catch (e) {
            console.log(e.message) //TODO: Replace with logger
            process.exit(1)
        }
    }

}

export default FileReader