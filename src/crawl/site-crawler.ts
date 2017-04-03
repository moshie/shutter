"use strict"

import * as trumpet from 'trumpet'
import * as request from 'request'
import { Readable } from 'stream'

declare interface crawlerOptionsInterface {
    concurrent?: number
    headers?: any
    xhr: boolean
    keepAlive: boolean
}

declare interface visitedInterface {
    [key: string]: boolean
}

class Crawler extends Readable {

    /**
     * Crawler options
     * @type {crawlerOptionsInterface}
     */
    options: crawlerOptionsInterface = {}

    /**
     * Base crawling url
     * @type {string}
     */
    url: string

    /**
     * Current working chunk
     * @type {string[]}
     */
    chunk: string[] = []

    /**
     * Crawling queue
     * @type {string[]}
     */
    pending: string[] = []

    /**
     * Current active requests
     * @type {string[]}
     */
    active: string[] = []

    /**
     * Urls already visited
     * @type {visitedInterface}
     */
    visited: visitedInterface = {}

    /**
     * Crawler constructor
     * 
     * @param {string}                  url
     * @param {crawlerOptionsInterface} options
     */
    constructor(url: string, options: crawlerOptionsInterface) {
        super({})

        this.options = this.handleOptions(options)
    }

    /**
     * Parse options
     * 
     * @param {crawlerOptionsInterface} options
     */
    handleOptions(options: crawlerOptionsInterface): crawlerOptionsInterface {
        options = options || {}
        options.concurrent = opts.concurrent || 1
        options.headers = opts.headers || {}

        if (options.xhr) {
            options.headers['X-Requested-With'] = 'XMLHttpRequest'
        }

        if (options.keepAlive) {
            options.headers.Connection = 'keep-alive'
            options.forever = true
        }

        return options
    }

    /**
     * Readable implementation
     * 
     * @param {number} size
     */
    _read(size: number): void {
        this.queue(this.url)
    }

    /**
     * Is the queue full
     * 
     * @return {boolean}
     */
    full(): boolean {
        return this.active.length >= this.options.concurrent
    }

    /**
     * Add url to the queue
     * 
     * @param {string} url
     */
    queue(url: string): void {
        if (this.visited[url]) return

        if (!this.options.allowDuplicates) {
            this.visited[url] = true
        }

        if (this.full()) {
            this.pending.push(url)
        } else {
            this.load(url)
        }
    }

    /**
     * Load the url
     * 
     * @param {string} url
     */
    load(url: string): void {
        this.active.push(url)

        var _trumpet = trumpet()
        var _request = request(url)

        _trumpet.selectAll('a[href]', (element) => this.handleElement(element))

        _request.on('error', (error) => {
            console.log(error)
        })

        _trumpet.on('error', (error) => {
            console.log(error)
        })

        _request.pipe(_trumpet)

        _trumpet.on('end', () => {
            this.finished(url)
        })
    }

    /**
     * Remove referrer from the queue
     * 
     * @param {string} referrer
     */
    dequeue(referrer: string): void {
        var args = this.pending.shift()

        if (args) {
            this.load(referrer)
        } else if (this.active.length === 0) {
            this.push(JSON.stringify(this.chunk))
            this.push(null)
        }
    }

    /**
     * Remove from current active requests
     * 
     * @param {string} url
     */
    finished(url: string): void {
        var i: number = this.active.indexOf(url)
        if (i === -1) {
            console.log('URL was not active', url)
            return
        }

        this.active.splice(i, 1)

        if (!this.full()) {
            this.dequeue(url)
        }
    }

    /**
     * Handle retreval of urls
     * 
     * @param {any} element
     */
    handleElement(element: any): void {
        element.getAttribute('href', (hyperlink) => {

            if (this.visited[hyperlink]) {
                return
            }

            if (/^(mailto|tel|#|\/)/.test(hyperlink) || !/colprint.co.uk/.test(hyperlink)) {
                return
            }

            if (this.chunk.length > 10) {
                this.push(JSON.stringify(this.chunk))
                this.chunk = []
            }

            this.chunk.push(hyperlink)
            this.queue(hyperlink)
        })
    }

}

export default Crawler
