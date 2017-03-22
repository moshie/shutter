import * as URL from 'url'
import * as Promise from 'bluebird'
import * as Spider from 'node-spider'
import {environmentsInterface} from './environments-interface'
import Document from 'node-spider/lib/document'

const paths: string[] = []

const visited: string[] = []

function handleRequest(spider: Spider, doc: Document, domain: URL.Url) {

    doc.$('a[href]').each(function (i: number, elem: any) {
        
        if (i == 1000000) {
            // Stack overflow prevention
            return false;
        }

        let href = doc.$(elem).attr('href')

        let relativeRegex = new RegExp('^(https?\:\/\/(www\.)?' + domain.host + ')|^(\/\w?.*)')
        let forwardSlash = new RegExp('^(\/)')

        if (!relativeRegex.test(href) || paths.indexOf(href) !== -1) {
            return true;
        }

        if (forwardSlash.test(href)) {
            href = href.slice(1)
            var next = URL.format(domain) + href.slice(1)
        } else {
            var next = href
            href = URL.parse(href).pathname
            href = typeof href == 'string' && href.length ? href.slice(1) : ''
        }

        if (paths.indexOf(href) !== -1) {
            return true;
        }

        paths.push(href)
        
        if (visited.indexOf(next) == -1) {
            visited.push(next);
            spider.queue(next, (doc: Document) => handleRequest(spider, doc, domain))
        }
        
    })
}


function crawl(environments: environmentsInterface): Promise<any> {
    const url: string = environments[Object.keys(environments)[0]]
    const domain: URL.Url = URL.parse(url)

    return new Promise((resolve, reject) => {
        
        const spider: Spider = new Spider({
            concurrent: 5,
            error: (error: any, url: string) => reject(error),
            done: () => resolve(paths),
            headers: { 
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36' 
            },
        })

        spider.queue(URL.format(domain), (doc: Document) => handleRequest(spider, doc, domain))
    })

}

export default crawl