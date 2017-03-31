import * as Promise from 'bluebird'
import * as Spider from 'node-spider'
import Document from 'node-spider/lib/document'
import {environmentsInterface} from '../cli/environments-interface'

class Crawler {

    environments: environmentsInterface
    spider: Spider
    userAgent: string
    domain: string
    paths: string[] = []

    constructor(environments: environmentsInterface) { 
        this.environments = environments
        this.domain = environments[Object.keys(environments)[0]]
        this.paths = []
        this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    }

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

    pageHandler(doc: Document): void {
        var self = this;
        doc.$('a[href]').each(function (i: number, elem: any) {
            let href: string = doc.$(this).attr('href')
            // TODO: VALIDATE & Sanatize HREF 
        })
    }

    error(error: Error, url: string) {

    }

}

export default Crawler