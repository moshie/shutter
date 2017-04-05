import { Readable } from 'stream'
import * as URL from 'url'
import * as queue from 'queue'
import * as trumpet from 'trumpet'
import * as request from 'request'

class Crawler extends Readable {
    queue: queue
    baseUrl: string
    parser: HyperlinkParser
    userAgent: string = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'

    constructor(baseUrl: string) {
        super({ objectmode: true })
        this.queue = queue({ concurrency: 20 })
        this.baseUrl = baseUrl
        this.parser = new HyperlinkParser(this)
    }

    _read(size: number) {
        this.queue.push((next) => this.crawl(this.baseUrl, next))
    }

    crawl(url: string, next: () => void) {
        let tr = trumpet()
        tr = this.parser.parse(tr)

        request({ url, headers: { 'User-Agent': this.userAgent } }).pipe(trumpet)

        trumpet.on('end', () => next())
    }

}

class HyperlinkParser {

    crawler: Crawler

    constructor(crawler) {
        this.crawler = crawler
    }

    parse(trumpet: any) {
        return trumpet.selectAll('a[href]', (element) => {
            element.getAttribute('href', (value) => {
                this.crawler.push(chunk)
                this.crawler.queue.push((next) => this.crawler.crawl(/* PATH TO BE CRAWLED NEXT */, next))
            })
        })
    }
}


// Implementation
// const crawler = new Crawler('http://colprint.co.uk')

// crawler.pipe(screenshot)