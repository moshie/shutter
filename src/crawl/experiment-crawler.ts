import { Readable } from 'stream'
import * as URL from 'url'
import * as queue from 'queue'
import * as trumpet from 'trumpet'
import * as request from 'request'

class Crawler extends Readable {
    queue: queue
    rawBaseUrl: string
    baseUrl: URL.Url
    userAgent: string = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'

    constructor(baseUrl: string) {
        super({ objectmode: true })
        this.queue = queue({ concurrency: 20 })
        this.rawBaseUrl = baseUrl
        this.baseUrl = URL.parse(baseUrl)
        this.parser = new HyperlinkParser(this)
    }

    _read(size: number) {
        this.queue.push((next) => this.crawl(this.rawBaseUrl, next))
    }

    crawl(url: string, next: () => void) {
        let trumpet = this.parser.parse(trumpet())

        request({ url, headers: { 'User-Agent': this.userAgent } }).pipe(trumpet)

        trumpet.on('end', () => next())
    }

}

class HyperlinkParser {

    trumpet: any = trumpet()

    crawler: Crawler

    constructor(crawler) {
        this.crawler = crawler
    }

    parse(trumpet) {
        return trumpet.selectAll('a[href]', (element) => {
            element.getAttribute('href', (value) => {
                this.crawler.push(chunk)
                this.crawler.queue.push((next) => this.crawler.crawl(/* PATH TO BE CRAWLED NEXT */, next))
            })
        })
    }
}