// Phantomjs doesn't like the way typescript compiles es6 module imports
const system = require('system');
const fs = require('fs');

const isJson = require('../../utilities/is-json').default;
const sanitizePath = require('./sanitize-path').default;

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

var URLS: string[] = [];

if (isJson(rawPaths)) {
    URLS = JSON.parse(rawPaths)
} else {
    console.error('Parsing JSON Failed!')
    phantom.exit()
}

if (!Array.isArray(URLS)) {
    console.error('paths content must be a type of [Object array]')
}

var SCREENSHOT_WIDTH = 1280; 
var SCREENSHOT_HEIGHT = 900; 
var LOAD_WAIT_TIME = 1000;

var getPageTitle = function(page){
    var documentTitle = page.evaluate(function(){
        return document.title; 
    })
    return documentTitle; 
}

var getPageHeight = function(page){
    var documentHeight = page.evaluate(function() { 
        return document.body.offsetHeight; 
    })
    return documentHeight; 
}

var renderPage = function(page){

    var title =  getPageTitle(page);

    var pageHeight = getPageHeight(page); 

    page.clipRect = {
        top:0,left:0,width: SCREENSHOT_WIDTH, 
        height: pageHeight
    };

    var id = sanitizePath(URLS[index]);
    page.render(`${fs.workingDirectory}/${environment}/${id}_${SCREENSHOT_WIDTH}x${pageHeight}.png`);
}

var exitIfLast = function(index,array){
    if (index == array.length-1){
        phantom.exit();
    }
}

var takeScreenshot = function(element){

    var page = require("webpage").create();

    page.viewportSize = {width:SCREENSHOT_WIDTH, height:SCREENSHOT_HEIGHT};

    page.open(domain + element);

    page.onLoadFinished = function() {
        setTimeout(function(){
            renderPage(page)
            exitIfLast(index,URLS)
            index++; 
            takeScreenshot(URLS[index]);
        },LOAD_WAIT_TIME)
    }

}

var index = 0; 

takeScreenshot(URLS[index]);