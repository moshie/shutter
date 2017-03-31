"use strict"

import * as Promise from 'bluebird'
import * as Spider from 'node-spider'
import Document from 'node-spider/lib/document'
import {environmentsInterface} from '../cli/environments-interface'

class Crawler {

    /**
     * Screenshot environments
     * @type {environmentsInterface}
     */
    environments: environmentsInterface

    /**
     * Site spider
     * @type {Spider}
     */
    spider: Spider

    /**
     * Request user agent
     * @type {string}
     */
    userAgent: string

    /**
     * Crawled domain
     * @type {string}
     */
    domain: string

    /**
     * Screenshot file paths
     * @type {string[]}
     */
    paths: string[] = []

    /**
     * Links already run through the crawler
     * @type {string[]}
     */
    checked: string[] = []

    /**
     * Crawler constructor
     * 
     * @param {environmentsInterface} environments
     */
    constructor(environments: environmentsInterface) { 
        this.environments = environments
        this.domain = environments[Object.keys(environments)[0]]
        this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    }

    /**
     * Crawl 
     * @return {Promise<any>} [description]
     */
    crawl(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.spider = new Spider({
                concurrent: 20,
                error: (error: Error, url: string) => reject(error),
                done: () => resolve(this.paths),
                headers: { 'user-agent': this.userAgent }
            })

            this.spider.queue(this.domain, (doc: Document) => this.pageHandler(doc))
        })
    }

    protected pageHandler(doc: Document): void {
        var self = this;
        doc.$('a[href]').each(function (i: number, elem: any) {
            let href: string = doc.$(this).attr('href')

            href = self.removeHashes(href)

            if (!validProtocol(href) || this.checked.indexOf(href) !== -1 || hasInvalidExtension(href)) {
                return true
            }

            this.checked.push(href)

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

    protected error(error: Error, url: string) {

    }

}

export default Crawler