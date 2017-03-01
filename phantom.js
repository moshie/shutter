const page = require("webpage").create();
var system = require('system');

var url = system.args[1] || '';
var environment = system.args[2] || '';
var id = system.args[3] || '';

if (!url || !environment || !id) {
    console.log('Please specify a Url / Environment / id!');
    phantom.exit();
}

var page_width = 1600;
var page_height = 1800;
page.viewportSize = { width: page_width, height: page_height };
page.clipRect = { top: 0, left: 0, width: page_width, height: page_height };
page.onError = function (messageStack, trace) {}

page.open(url, function (status) {
    if (status !== "success") {
        console.log('Failed loading: ' + url);
        phantom.exit();
    }
    page.render("screenshots/" + environment + "/" + id + "_" + page_width + "x" + page_height + ".png");
    console.log(JSON.stringify(["screenshots/" + environment + "/" + id + "_" + page_width + "x" + page_height + ".png"]));
    phantom.exit();
});