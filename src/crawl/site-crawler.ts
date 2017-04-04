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
     * Parsed base crawling url
     * @type {URL.Url}
     */
    base: URL.Url

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
     * White listed extensions
     * @type {string[]}
     */
    extensions: string[] = [
        'html', 'htm', 'xhtml', 'jhtml', 'xml',
        'php', 'php3', 'php4', 'phtml',
        'asp', 'aspx', 'axd', 'asmx', 'ashx',
        'rhtml',
        'shtml'
    ]

    /**
     * Crawler constructor
     * 
     * @param {string}                  url
     * @param {crawlerOptionsInterface} options
     */
    constructor(url: string, options: crawlerOptionsInterface) {
        super({})
        this.url = url
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
     * Check if the hyperlink has an invalid extension
     * 
     * @param  {URL.Url} hyperlink
     * @return {boolean}
     */
    invalidExtension(hyperlink: URL.Url): boolean {
        var matches: string[]|null = /(?:\.([a-z]+))$/.exec(hyperlink.path)

        return matches instanceof Array && this.extensions.indexOf(matches[1]) === -1
    }

    /**
     * Remove WWW from the start of the host
     * 
     * @param  {string} host
     * @return {string}
     */
    removeWWW(host: string): string {
        return host.replace(/^(www\.)/i, '')
    }

    /**
     * Get the base host without the WWW applied
     * 
     * @return {string}
     */
    getBaseNoWWW(): string {
        return this.removeWWW(this.base.host + this.base.path)
    }

    /**
     * Check if the hyperlink starts with the base
     * Absolute Checker
     * 
     * @param  {URL.Url} hyperlink
     * @return {boolean}
     */
    matchingHostNames(hyperlink: URL.Url): boolean {
        return (
            hyperlink.host !== null && 
            this.removeWWW(hyperlink.host + hyperlink.path).startsWith(this.getBaseNoWWW()) &&
            !this.visited[hyperlink.path]
        )
    }

    /**
     * Push the chunk then reset the chunk array
     */
    resetChunk(): void {
        if (this.chunk.length == 10) { //TODO: Change the 10 to an option
            this.push(JSON.stringify(this.chunk))
            this.chunk = []
        }
    }

    /**
     * Push the path to the chunk and visited array also add to queue
     * 
     * @param {string} path
     */
    handlePush(path: string): void {
        this.chunk.push(path)
        this.visited[path] = true
        console.log(this.base.protocol + '//' + this.base.host + path)
        this.queue(this.base.protocol + '//' + this.base.host + path)
        this.resetChunk()
    }

    /**
     * Return back the path with a trailing slash
     * 
     * @param  {URL.Url} hyperlink
     * @return {string}
     */
    hyperlinkPathTrailingSlash(hyperlink: URL.Url): string {
        return hyperlink.path[hyperlink.path.length - 1] == '/' ? hyperlink.path : `${hyperlink.path}/`
    }

    /**
     * Checks for shorthand urls matching the base
     * 
     * @param  {URL.Url} hyperlink
     * @return {boolean}
     */
    matchingPathnames(hyperlink: URL.Url): boolean {
        return this.removeWWW(this.hyperlinkPathTrailingSlash(hyperlink)).startsWith(this.getBaseNoWWW())
    }

    /**
     * Checks the hyperlink has no protocol set
     * 
     * @param  {URL.Url} hyperlink
     * @return {boolean}
     */
    noProtocol(hyperlink: URL.Url): boolean {
        return hyperlink.protocol === null
    }

    /**
     * Ensure link leads with a slash
     * 
     * @param  {URL.Url} hyperlink
     * @return {string}
     */
    getLeadingSlashLink(hyperlink: URL.Url): string {
        return hyperlink.path[0] == '/' ? hyperlink.path : `/${hyperlink.path}`;
    }

    /**
     * Check if the url is relative
     * 
     * @param  {URL.Url} hyperlink
     * @return {boolean}
     */
    isRelative(hyperlink: URL.Url): boolean {
        return (
            hyperlink.path !== null &&
            this.noProtocol(hyperlink) && 
            this.getLeadingSlashLink(hyperlink).startsWith(this.base.path) && 
            !this.visited[this.getLeadingSlashLink(hyperlink)]
        )
    }

    /**
     * Handle retreval of urls
     * 
     * @param {any} element
     */
    handleElement(element: any): void {
        element.getAttribute('href', (value: string): void => {

            let hyperlink: URL.Url = URL.parse(value)
            this.base = URL.parse(this.url)

            hyperlink.hash = null

            if (hyperlink.path == null || this.visited[hyperlink.path]) {
                return
            }

            if (this.invalidExtension(hyperlink)) {
                return
            }

            if (this.matchingHostNames(hyperlink)) {
                this.handlePush(hyperlink.path)
                return
            } else if (this.matchingPathnames(hyperlink)) {
                hyperlink = URL.parse(this.base.protocol + '//' + hyperlink.path)
                if (!this.visited[hyperlink.path]) {
                    this.handlePush(hyperlink.path)
                    return
                }
            }

            if (hyperlink.path.split('/')[0].indexOf('.') !== -1) {
                return
            }
    
            if (this.isRelative(hyperlink)) {
                this.handlePush(
                    this.getLeadingSlashLink(hyperlink)
                )
                return
            }

        })
    }

}

export default Crawler
