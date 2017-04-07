import { Readable } from 'stream'
import * as URL from 'url'
import * as queue from 'queue'
import * as trumpet from 'trumpet'
import * as request from 'request'
import HyperlinkParser from './hyperlink-parser'

class Crawler extends Readable {

    /**
     * Queue factory
     * @param {queue}
     */
    queue: queue

    /**
     * Base url
     * @type {string}
     */
    baseUrl: string

    /**
     * Parsed url
     * @type {URL.Url}
     */
    base: URL.Url

    /**
     * Request user agent
     * @type {string}
     */
    userAgent: string = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'

    /**
     * Urls already visited
     * @type {any}
     */
    visited: any = {}

    parser: HyperlinkParser

    /**
     * Crawler constructor
     * 
     * @param {string} baseUrl
     */
    constructor(baseUrl: string) {
        super({ objectMode: true })
        this.baseUrl = baseUrl
        this.queue = queue({ concurrency: 20, autostart: true })
        this.parser = new HyperlinkParser(baseUrl)
    }

    /**
     * Readable stream implementation
     * 
     * @param {number} size
     */
    _read(size: number) {
        this.queue.push((next) => this.crawl(this.baseUrl, next))
    }

    /**
     * Crawl a url
     * 
     * @param {string} url
     * @param {function} next
     */
    crawl(url: string, next: () => void = () => {}) {

        var tr = this.parser.parse(url)

        this.parser.on('next', (_url) => {
            this.queue.push((next) => this.crawl(_url, next))
        })

        this.parser.on('data', (_url) => {
            this.push(_url)
        })

        request({ url, headers: { 'User-Agent': this.userAgent } }).pipe(tr)

        tr.on('end', () => next())
    }

}

export default Crawler