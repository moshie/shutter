const urlHelper = require('url');

function buildId(url) {
    var urlObj = urlHelper.parse(url);
    var id = urlObj.pathname.replace(/^\/|\/$/g, '');
    id = id.replace(/\//g, '_');
    return !id ? 'home' : id;
}

module.exports = buildId;