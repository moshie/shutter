import { Readable } from 'stream'

import * as URL from 'url'
import * as request from 'request'
import * as trumpet from 'trumpet'
import * as queue from 'queue'
import HyperlinkParser from './hyperlink-parser'

class Crawler extends Readable {

    base: string

    baseUrl: URL.Url

    queue: queue

    parser: HyperlinkParser

	userAgent: string = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'

	constructor(base: string) {
		super({ objectMode: true })
        this.base = base
        this.queue = queue({ concurrency: 2, autostart: true })
        this.parser = new HyperlinkParser(base)
	}

	_read(size: number) {
        this.crawl(this.base)
    }

    crawl(url: string, next: () => void = () => {}): void {
    	let req = request({ url, headers: { 'User-Agent': this.userAgent } })

        var tr = this.parser.parse()

        this.parser.on('next', (_url) => {
            this.queue.push((next) => this.crawl(_url, next))
        })

        this.parser.on('data', (_url) => {
            this.push(_url)
        })

    	req.pipe(tr)
    	tr.on('end', () => next())
    }

}

export default Crawler