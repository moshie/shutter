"use strict";

import * as path from 'path'
import * as Promise from 'bluebird'
import {spawn as shell} from 'child_process'

import isJson from '../../../utilities/is-json'
import {CapturerInterface, environmentsInterface} from '../../interfaces'

export default class Phantom implements CapturerInterface {

    /**
     * Screenshot environments
     * @type {environmentsInterface}
     */
    environments: environmentsInterface

    /**
     * Paths successfully captured
     * @type {string[]}
     */
    paths: string[] = []

    /**
     * Path to the phantomjs executable
     * @param static {string} executable
     */
    static executable: string = path.resolve(__dirname, '..', '..', '..', '..', 'node_modules', '.bin', 'phantomjs')

    /**
     * Path to the phantomjs script 
     * @param {string} script
     */
    static script: string = path.resolve(__dirname, 'phantom', 'screenshot.phantom.js')

    /**
     * Phantom constructor
     * 
     * @param {environmentsInterface} environments
     */
    constructor(environments: environmentsInterface) {
        this.environments = environments;
    }

    /**
     * Capture screenshots of domain paths
     * 
     * @param  {string} chunkFilename
     * @param  {string} environment
     * @return {Promise<any>}
     */
    capture(chunkFilename: string, environment: string): Promise<any> {
        var domain: string = this.environments[environment]

        return new Promise((resolve, reject): void => {
            const phantom = shell(Phantom.executable, [Phantom.script, chunkFilename, domain, environment])

            phantom.stdout.on('data', (data: NodeBuffer) => {
                var out: string = data.toString('utf8')
                if (isJson(out)) {
                    this.paths = JSON.parse(out)
                } else {
                    // Verbose
                    console.log(out)
                }
            })

            phantom.stderr.on('data', (data: NodeBuffer) => {
                var message: string = data.toString('utf8')
                reject('Error: ' + message)
            })

            phantom.on('close', (code: number) => resolve(this.paths))
        })
    }

}