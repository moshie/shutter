declare var phantom: any;
// Phantomjs doesn't like the way typescript compiles es6 module imports
const webpage = require('webpage');
const system = require('system');
const fs = require('fs');

const isJson = require('./is-json').default;
const sanitizePath = require('./sanitize-path').default;

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

var paths: string[] = [];

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

page.settings.resourceTimeout = 10000;
page.onError = function(msg: string, trace: string|any[]) {}
phantom.onError = function(msg, trace) {
    var msgStack = ['PHANTOM ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t: any) {
            msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
        });
    }
    console.error(msgStack.join('\n'));
    phantom.exit(1);
};

var pathCollection: string[] = []

var count: number = 0

function handlePage() {

    var url: string = domain + paths[count]

    console.log(url)

    page.open(url, (status: string) => {
        if (status !== 'success') {
            console.error(url)
            nextPage()
        }

        var id: string = sanitizePath(paths[count])
        var output: string = `${fs.workingDirectory}/${environment}/${id}_${page_width}x${page_height}.png`
        
        try {
            page.render(output)
        } catch (e) {
            console.error(e);
        }
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