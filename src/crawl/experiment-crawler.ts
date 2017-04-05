import { Readable } from 'stream'
import * as URL from 'url'
import * as queue from 'queue'
import * as trumpet from 'trumpet'
import * as request from 'request'

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

    /**
     * Crawler constructor
     * 
     * @param {string} baseUrl
     */
    constructor(baseUrl: string) {
        super({ objectMode: true })
        this.baseUrl = baseUrl
        this.base = URL.parse(baseUrl)
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
        if (this.visited[url]) return;

        this.visited[url] = true;

        let tr = trumpet()

        tr.selectAll('a[href]', (element) => {
            element.getAttribute('href', (value) => {

                // NO IDEA HOW TO BEST VALIDATE HYPERLINKS

                // CHUNK UP THE DATA ON THE SCREENSHOTTER??

            })
        })

        request({ url, headers: { 'User-Agent': this.userAgent } }).pipe(tr)

        tr.on('end', () => next())
    }

}

export default Crawler