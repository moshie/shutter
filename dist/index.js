"use strict";
var screenshot_1 = require("./screenshot");
var Promise = require("bluebird");
var domain = 'https://www.serentipi.co.uk';
var environment = 'master';
Promise.join(screenshot_1.default(__dirname + '/chunk-0.json', domain, 'master'), screenshot_1.default(__dirname + '/chunk-0.json', domain, 'test'))
    .then(function (response) {
    console.log(response);
})
    .catch(function (errors) {
    console.log(errors);
});
//# sourceMappingURL=index.js.map