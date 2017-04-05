import { Readable } from 'stream'
import * as URL from 'url'
import * as queue from 'queue'
import * as trumpet from 'trumpet'
import * as request from 'request'
import HyperlinkParser from './hyperlink-parser'

class Crawler extends Readable {

    /**
     * Hyperlink parser
     * @type {HyperlinkParser}
     */
    parser: HyperlinkParser

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
     * Request user agent
     * @type {string}
     */
    userAgent: string = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'

    /**
     * Crawler constructor
     * 
     * @param {string} baseUrl
     */
    constructor(baseUrl: string) {
        super({ objectMode: true })
        this.baseUrl = baseUrl
        this.queue = queue({ concurrency: 20, autostart: true })
    }

    /**
     * Readable stream implementation
     * 
     * @param {number} size
     */
    _read(size: number) {
        this.crawl(this.baseUrl)
    }

    /**
     * Crawl a url
     * 
     * @param {string} url
     * @param {function} next
     */
    crawl(url: string, next: () => void = () => {}) {
        if (!(this.parser instanceof HyperlinkParser)) {
            this.parser = new HyperlinkParser(this)
        }

        if (this.parser.visited[url]) return;

        this.parser.visited[url] = true;

        let tr = trumpet()
        tr = this.parser.parse(tr)

        request({ url, headers: { 'User-Agent': this.userAgent } }).pipe(tr)

        tr.on('end', () => next())
    }

}

export default Crawler