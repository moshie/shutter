// Vendor
import * as URL from 'url'
import * as chalk from 'chalk'
import * as Promise from 'bluebird'
import * as Spider from 'node-spider'
import Document from 'node-spider/lib/document'

// Internal
import chunk from './chunk'
import removeHash from './remove-hash'
import validProtocol from './valid-protocol'
import mergePathname from './merge-pathname'
import isAbsoluteUrl from './is-absolute-url'
import checkShorthandUrl from './check-shorthand-url'
import hasInvalidExtension from './has-invalid-extension'
import {environmentsInterface} from './environments-interface'

const paths: string[] = []

const checked: string[] = []

function handleRequest(spider: Spider, doc: Document, domain: URL.Url): void {

    doc.$('a[href]').each(function (i: number, elem: any) {

        let href: string = doc.$(this).attr('href')

        href = removeHash(href)

        if (!validProtocol(href) || checked.indexOf(href) !== -1 || hasInvalidExtension(href)) {
            return true
        }

        checked.push(href)

        if (isAbsoluteUrl(domain, href)) {
            // Absolute
            var url: string = checkShorthandUrl(href)
            href = URL.parse(url).pathname
            href = href.replace(/^(\/)/, '')
            var next: string = url
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

    console.log(`${chalk.cyan('Info:')} Crawling ${chalk.bgBlue(url)}`)

    return new Promise((resolve, reject) => {
        
        const spider: Spider = new Spider({
            concurrent: 20,
            error: (error: Error, url: string) => {
                console.log(`${chalk.red('Error:')} ${error.message}`)
                reject(error)
            },
            done: () => {
                console.log(`${chalk.green('Success:')} Crawling of ${url} is complete!`)
                resolve(chunk(paths, 6))
            },
            headers: { 
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36' 
            }
        })

        spider.queue(URL.format(domain), (doc: Document) => handleRequest(spider, doc, domain))
    })

}

export default crawl
