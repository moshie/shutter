"use strict"

import { Duplex } from 'stream'
import { defaults } from 'lodash/object'
import * as isString from 'lodash/isString'

import Crawler from './crawler'
import Capture from './capture'
import Collector from './collector'
import FileReader from './file-reader'
import FileDivider from './file-divider'

import { environmentsInterface, optionsInterface } from './interfaces'

class Screenshot {

    /**
     * Default options
     * @param {optionsInterface}
     */
    options: optionsInterface = {
        directory: process.cwd(),
        paths: undefined,
        chunkSize: 10,
        concurrency: 10
    }

    /**
     * Environments
     * @param {environmentsInterface}
     */
    environments: environmentsInterface = {}

    /**
     * Screenshot capture constructor
     * 
     * @param {environmentsInterface} environments 
     * @param {optionsInterface} options 
     */
    constructor(environments: environmentsInterface, options: optionsInterface) {
        this.environments = environments
        this.options = defaults(options, this.options)
    }

    /**
     * Capture screenshots
     * 
     * @return {Duplex} capture Continue streaming chain
     */
    capture(): Duplex {
        const source: Crawler|FileReader = this.getSource()
        const collector: Collector = new Collector(this.options.chunkSize)
        const divider: FileDivider = new FileDivider(this.options.directory)
        const capture: Capture = new Capture(this.environments, this.options.directory, this.options.concurrency)

        return source.pipe(collector).pipe(divider).pipe(capture);
    }

    /**
     * Get the source of internal site paths
     * 
     * @return {Crawler|FileReader}
     */
    protected getSource(): Crawler|FileReader {
        if (isString(this.options.paths)) {
            return new FileReader(this.options.paths)
        }

        let firstEnvironmentKey = Object.keys(this.environments)[0],
            firstEnvironmentDomain: string = this.environments[firstEnvironmentKey]

        return new Crawler(firstEnvironmentDomain)
    }

}

export default Screenshot