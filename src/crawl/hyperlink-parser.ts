import Crawler from './experiment-crawler'
import * as URL from 'url'

class HyperlinkParser {

    crawler: Crawler

    base: URL.Url

    visited: any = {}

    chunk: string[] = []

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

    constructor(crawler: Crawler) {
        this.crawler = crawler
        this.base = URL.parse(crawler.baseUrl)
    }

    parse(trumpet: any) {
        trumpet.selectAll('a[href]', (element) => {
            element.getAttribute('href', (value) => {

                let hyperlink: URL.Url = URL.parse(value)

                hyperlink.hash = null

                if (hyperlink.path == null) {
                    return
                }

                if (this.invalidExtension(hyperlink)) {
                    return
                }

                if (this.matchingHostNames(hyperlink)) {
                    this.handlePush(hyperlink.path)
                    return
                }

                if (this.matchingPathnames(hyperlink)) {
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

                this.visited[value] = true;

            })
        })

        return trumpet
    }

    /**
     * Push the path to the chunk and visited array also add to queue
     * 
     * @param {string} path
     */
    handlePush(path: string): void {
        this.chunk.push(path)
        this.crawler.queue.push((next) => {
            this.crawler.crawl(this.base.protocol + '//' + this.base.host + path, next)
        })
        this.visited[path] = true
        this.resetChunk()
    }

    /**
     * Push the chunk then reset the chunk array
     */
    resetChunk(): void {
        if (this.chunk.length == 10) { //TODO: Change the 10 to an option
            this.crawler.push(this.chunk)
            this.chunk = []
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
     * Checks for shorthand urls matching the base
     * 
     * @param  {URL.Url} hyperlink
     * @return {boolean}
     */
    matchingPathnames(hyperlink: URL.Url): boolean {
        return this.removeWWW(this.hyperlinkPathTrailingSlash(hyperlink)).startsWith(this.getBaseNoWWW())
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
     * Return back the path with a trailing slash
     * 
     * @param  {URL.Url} hyperlink
     * @return {string}
     */
    hyperlinkPathTrailingSlash(hyperlink: URL.Url): string {
        return hyperlink.path[hyperlink.path.length - 1] == '/' ? hyperlink.path : `${hyperlink.path}/`
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
}

export default HyperlinkParser