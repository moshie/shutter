import {spawn as shell} from 'child_process'
import * as path from 'path'
import * as Promise from 'bluebird'
import isJson from '../utilities/is-json'

import CapturerInterface from './capturer-interface'
import {environmentsInterface} from '../cli/environments-interface'

class Phantom implements CapturerInterface {

    environments: environmentsInterface

    static executable: string = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'phantomjs')

    static script: string = path.resolve(__dirname, 'screenshot.phantom.js')

    constructor(environments: environmentsInterface) {
        this.environments = environments;
    }

    capture(chunkFilename: string, environment: string): Promise<any> {
        let domain: string = this.environments[environment]
        return new Promise((resolve, reject): void => {
            const phantom = shell(Phantom.executable, [Phantom.script, chunkFilename, domain, environment])

            let paths: string[]

            phantom.stdout.on('data', (data: NodeBuffer) => {
                var out: string = data.toString('utf8')
                paths = isJson(out) ? JSON.parse(out) : [];
            })

            phantom.stderr.on('data', (data: NodeBuffer) => {
                var message: string = data.toString('utf8')
                reject(message)
            })

            phantom.on('close', (code: number) => resolve(paths))
        })
    }

}

export default Phantom