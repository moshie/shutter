"use strict";

import * as URL from 'url'
import * as queue from 'queue'
import { Readable } from 'stream'
import * as request from 'request'
import * as trumpet from 'trumpet'

import { parsedInterface } from '../interfaces'
import HyperlinkParser from './hyperlink-parser'

class Crawler extends Readable {

    /**
     * Base url
     * @type {string}
     */
    base: string

    /**
     * Queue system
     * @type {queue}
     */
    queue: queue

    /**
     * Hyperlink Parser
     * @type {HyperlinkParser}
     */
    parser: HyperlinkParser

    /**
     * Request user agent
     * @type {string}
     */
    userAgent: string = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'

    /**
     * Crawler constructor
     * 
     * @param {string} base
     */
    constructor(base: string) {
        super({ objectMode: true })
        this.base = base;
        this.queue = queue({ concurrency: 10, autostart: true }).on('end', () => this.push(null))
        this.parser = new HyperlinkParser(URL.parse(base))
    }

    /**
     * Readable stream implementation
     * 
     * @param {number} size
     */
    _read(size: number) {
        this.crawl(this.base)
    }

    /**
     * Crawl a url for internal links
     * 
     * @param {string} url
     * @param {Function} next
     */
    crawl(url: string, next: () => void = () => { }): void {
        let req = request({ url, headers: { 'User-Agent': this.userAgent } })
        let tr = trumpet()

        tr = this.getHyperLink(tr)

        req.pipe(tr).on('error', (e) => {
            console.log(e)
        })
        tr.on('end', () => next())
        tr.on('error', (e) => console.log(e))
    }

    /**
     * Extract hyperlinks from page
     * 
     * @param trumpet
     * @return {trumpet}
     */
    getHyperLink(trumpet: trumpet): trumpet {

        trumpet.selectAll('a[href]', (element) => {

            element.getAttribute('href', (value) => {

                let _url: undefined | parsedInterface = this.parser.parse(value)

                if (typeof _url !== 'undefined') {

                    let { path, then } = _url

                    if (typeof then !== 'undefined') {
                        this.queue.push((next) => this.crawl(then, next))
                    }

                    if (typeof path !== 'undefined') {
                        this.push(path)
                    }

                }

            })

        })

        return trumpet;
    }

}

export default Crawler