import {spawn as shell} from 'child_process'
import * as Promise from 'bluebird'
import isJson from './is-json'
import * as path from 'path'

const phantomCLIPath: string[] = [__dirname, '..', 'node_modules', '.bin', 'phantomjs']
const phantomCLI: string = path.resolve(...phantomCLIPath)

function screenshot(chunkFilepath: string, domain: string, environment: string): Promise<any> {

    const screenshotScriptPath: string = path.resolve(__dirname, 'screenshot.phantomjs.js')

	return new Promise((resolve, reject) => {
        const phantom = shell(phantomCLI, [screenshotScriptPath, chunkFilepath, domain, environment])

        let paths: string[]

        phantom.stdout.on('data', (data: NodeBuffer) => {
            var out: string = data.toString('utf8')

            if (isJson(out)) {
                paths = JSON.parse(out)
            } else {
            	console.log('Processing: ', out)
            }
        })

        phantom.stderr.on('data', (data: NodeBuffer) => {
            var message: string = data.toString('utf8')
            reject(message)
        })

        phantom.on('close', (code: number) => {
            resolve(paths)
        })

    })
}

export default screenshot