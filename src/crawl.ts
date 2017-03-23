import * as URL from 'url'
import * as Promise from 'bluebird'
import * as Spider from 'node-spider'
import {environmentsInterface} from './environments-interface'
import Document from 'node-spider/lib/document'

import checkShorthandUrl from './check-shorthand-url'

const paths: string[] = []

const visited: string[] = []

function removeWWW(hostname: string): string {
    return hostname.indexOf('www.') == 0 ? hostname.slice(4) : hostname;
}

function validProtocal(href: string) {
    let matches: string[]|null = href.match(/^(?:[a-z]+(?=\:))/)
    if (matches !== null && !/^(https?)/.test(matches[0])) {
        return false;
    }
    return true;
}

function removeHash(href: string): string {
    var parsedUrl: URL.Url = URL.parse(href)
    parsedUrl.hash = undefined
    return URL.format(parsedUrl)
}

function isUrlAbsolute(domain: URL.Url, href: string): boolean {
    var absolute = new RegExp('^((https?:\/\/)?(www\.)?(' + removeWWW(domain.host) + domain.pathname + '))')
    return absolute.test(href)
}

function mergePathname(domain: URL.Url, href: string): string {
    return URL.format(domain) + href.replace(/^(\/)/, '')
}

const checked: string[] = []

function handleRequest(spider: Spider, doc: Document, domain: URL.Url) {

    doc.$('a[href]').each(function (i: number, elem: any) {

        let href: string = doc.$(this).attr('href')

        href = removeHash(href)

        if (!validProtocal(href) || checked.indexOf(href) !== -1) {
            return true
        }

        checked.push(href)

        if (isUrlAbsolute(domain, href)) {
            // Absolute
            var url = checkShorthandUrl(href)
            href = url.pathname
            href = href.replace(/^(\/)/, '')
            var next: string = URL.format(url)
        } else {
            if (/^(https?\:\/\/)/.test(href)) {
                return true;
            }
            // Relative
            href = href.replace(/^(\/)/, '')
            var next: string = mergePathname(domain, href)
        }

        if (paths.indexOf(href) !== -1) {
            return true
        }

        paths.push(href)

        spider.queue(next, (doc: Document) => handleRequest(spider, doc, domain))
        
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