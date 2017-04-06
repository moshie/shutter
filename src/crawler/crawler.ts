import { Readable } from 'stream'

import * as URL from 'url'
import * as request from 'request'
import * as trumpet from 'trumpet'

class Crawler extends Readable {

    base: string

    baseUrl: URL.Url

	userAgent: string = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'

	constructor(base: string) {
		super({ objectMode: true })
        this.base = base
        this.baseUrl = URL.parse(base)
	}

	_read(size: number) {
        this.crawl(this.base)
    }

    crawl(url: string, next: () => void = () => {}): void {
    	let req = request({ url, headers: { 'User-Agent': this.userAgent } })
		let tr = trumpet()

		tr.selectAll('a[href]', (element) => {
            element.getAttribute('href', (value) => {

                let hyperlink: URL.Url = URL.parse(value)

                hyperlink.hash = null

                if (hyperlink.path === null) {
                    return
                }

                if (hyperlink.path.startsWith())


                this.push(value)

            })
        })

    	req.pipe(tr)
    	tr.on('end', () => next())
    }

}

export default Crawler