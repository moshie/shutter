const page = require("webpage").create();
const fs = require('fs');
const system = require('system');
console.error = function () {
    require("system").stderr.write(Array.prototype.join.call(arguments, ' ') + '\n');
};

const chunkPath = system.args[1] || '';
const domain = system.args[2] || '';
const environment = system.args[3] || '';

if (!chunkPath || !domain || !environment) {
    console.log('Please specify a chunkPath / Domain / Environment!');
    phantom.exit();
}

var rawChunks = fs.read(chunkPath);

if (!rawChunks) {
    console.error('No content found');
    phantom.exit();
}

var paths;
try {
    paths = JSON.parse(rawChunks);
} catch (e) {
    console.error('json parsing Failed!');
    console.error(e);
    phantom.exit();
}

var page_width = 1600;
var page_height = 1800;
page.viewportSize = { width: page_width, height: page_height };
page.clipRect = { top: 0, left: 0, width: page_width, height: page_height };
page.onError = function (messageStack, trace) {}

var final = [];

var count = 0;

var sanitizeUri = function (uri) {
    var path = uri.substr(domain.length);
    path = path.replace(/^\/|\/$/g, '');
    path = path.replace(/\//g, '_');
    return !path ? 'home' : path;
}

function handlePage(url, index) {
    console.log(url);
    page.open(url, function (status) {
        count++;
        if (status !== "success") {
            console.error('Failed loading: ' + url);
            nextPage();
        }

        page.render("screenshots/" + environment + "/" + sanitizeUri(url) + "_" + page_width + "x" + page_height + ".png");
        final.push("screenshots/" + environment + "/" + sanitizeUri(url) + "_" + page_width + "x" + page_height + ".png");
        nextPage();
    });
}


function nextPage() {
    if (typeof paths[count] === "undefined") {
        console.log(JSON.stringify(final));
        phantom.exit();
    }
    handlePage(domain + paths[count], count);
}

nextPage();