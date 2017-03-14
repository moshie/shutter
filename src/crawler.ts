import * as request from 'request'
import * as cheerio from 'cheerio'

var paths = [];

function crawl(baseurl: string, url: string) {
    request(url, (error, response, html) => {
        if (error) {
            throw error;
        }
        const $ = cheerio.load(html);

        $('a[href]').each(function(v) {
            paths.push(
                $(this).prop('href')
            );
        });

    })
}

export default crawl