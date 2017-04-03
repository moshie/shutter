"use strict"

import * as trumpet from 'trumpet'
import * as request from 'request'
import * as URL from 'url'
import { Readable } from 'stream'
import { crawlerOptionsInterface, sitesVisited } from './interfaces'

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
     * @type {sitesVisited}
     */
    visited: sitesVisited = {}

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
        options.concurrent = options.concurrent || 1
        options.headers = options.headers || {}

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
     * SEPERATE THIS?
     */





    /**
     * Remove www from am url
     * 
     * @param  {string} url
     * @return {string}
     */
    removeWww(url: string): string {
        let wwwRegex: RegExp = new RegExp('^(www\.)')

        return url.replace(wwwRegex, '')
    }

    /**
     * Check if the url has a valid protocol
     * 
     * @param  {URL.Url} url
     * @return {boolean}
     */
    validProtocol(url: URL.Url): boolean {
        let validProtocol: RegExp = new RegExp('^(https?)')

        return url.protocol !== null && validProtocol.test(url.protocol)
    }

    getBase(): URL.Url {
        return URL.parse(this.url)
    }

    /**
     * Check if the host is correct for an absolute link
     * 
     * @param  {URL.Url} hyperlink
     * @return {boolean}
     */
    correctHost(hyperlink: URL.Url): boolean {
        let base: URL.Url = this.getBase()
        let slashesRegex: RegExp = new RegExp('^\/|\/$', 'g')

        let hyperlinkPath: string = hyperlink.path.replace(slashesRegex, '')
        let basePath: string = base.path.replace(slashesRegex, '')

        return this.removeWww(`${base.host}/${basePath}`) == this.removeWww(`${hyperlink.host}/${hyperlinkPath}`)
    }

    /**
     * Check if Hyperlink is an Absolute url
     * 
     * @param  {URL.Url} hyperlink
     * @return {boolean}
     */
    isAbsolute(hyperlink: URL.Url): boolean {
        return this.validProtocol(hyperlink) && this.correctHost(hyperlink)
    }

    /**
     * Check if the hyperlink is a relative path
     * 
     * @param  {URL.Url} hyperlink
     * @return {boolean}
     */
    isRelative(hyperlink: URL.Url): boolean {

        let slashesRegex: RegExp = new RegExp('^\/|\/$', 'g')

        let hyperlinkPath: string = hyperlink.path.replace(slashesRegex, '')
        let basePath: string = this.getBase().path.replace(slashesRegex, '')

        return !hyperlink.protocol && hyperlink.pathname && (!basePath.length || hyperlinkPath == basePath)
    }

    /**
     * Handle retreval of urls
     * 
     * @param {any} element
     */
    handleElement(element: any): void {
        element.getAttribute('href', (value) => {

            let hyperlink: URL.Url = URL.parse(value)

            hyperlink.hash = null

            if (this.visited[URL.format(hyperlink)]) {
                return
            }

            if (this.chunk.length > 10) {
                this.push(JSON.stringify(this.chunk))
                this.chunk = []
            }

            let next = ''
            let path = hyperlink.path;

            if (this.isAbsolute(hyperlink)) {
                // Absolute
                next = URL.format(hyperlink)
            } else if (this.isRelative(hyperlink)) {
                // Relative
                next = this.getBase().pathname + (hyperlink[0] == '/' ? hyperlink : `/${hyperlink}`)
            }

            if (next) {
                this.chunk.push(path)
                this.queue(next)
            }

        })
    }

}

export default Crawler
