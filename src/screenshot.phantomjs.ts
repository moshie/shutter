import * as webpage from 'webpage'
import * as system from 'system'
import * as fs from 'fs'

import isJson from './is-json'
import sanitizePath from './sanitize-path'

var page: any = webpage.create()

console.error = (error: string) => {
    system.stderr.write(error + '\n')
}

const pathsFilepath: string = system.args[1] || ''
const domain: string = system.args[2] || ''
const environment: string = system.args[3] || ''

if (!environment) {
    console.error('Please specify a environment!')
    phantom.exit()
}

if (!domain) {
    console.error('Please specify a domain!')
    phantom.exit()
}

if (!pathsFilepath) {
    console.error('Please specify a filepath to paths!')
    phantom.exit()
}

var rawPaths: string = fs.read(pathsFilepath)

if (!rawPaths) {
    console.error('No content found inside ' + pathsFilepath)
    phantom.exit()
}

var paths: string[]

if (isJson(rawPaths)) {
    paths = JSON.parse(rawPaths)
} else {
    console.error('Parsing JSON Failed!')
    phantom.exit()
}

if (!Array.isArray(paths)) {
    console.error('paths content must be a type of [Object array]')
}

const page_width = 1600
const page_height = 1800

page.viewportSize = { width: page_width, height: page_height }
page.clipRect = { top: 0, left: 0, width: page_width, height: page_height }
page.onError = (messageStack: string, trace: string|any[]) => {}

var pathCollection: string[] = []

var count: number = 0

function handlePage() {

    var url: string = domain + paths[count]

    console.log(url)

    page.open(url, (status: string) => {
        if (status !== 'success') {
            console.error('Failed loading: ' + url)
            nextPage()
        }

        // This needs work!

        // Set page height
        // var height: number = page.evaluate(() => {
        //     var body = document.body,
        //         html = document.documentElement

        //     return Math.max(
        //         body.scrollHeight, 
        //         body.offsetHeight, 
        //         html.clientHeight, 
        //         html.scrollHeight, 
        //         html.offsetHeight
        //     )
        // })

        // page.viewportSize['height'] = height
        // page.clipRect['height'] = height

        var id: string = sanitizePath(paths[count])
        var output: string = `screenshots/${environment}/${id}_${page_width}x${page_height}.png`
		
        page.render(output)
        pathCollection.push(output)

		count++
        nextPage()
    })
}

function nextPage() {
    if (typeof paths[count] === 'undefined') {
        console.log(JSON.stringify(pathCollection))
        phantom.exit()
    }

    handlePage()
}

nextPage()