"use strict"

import * as ora from 'ora'
import * as URL from 'url'
import * as Promise from 'bluebird'
import * as Spider from 'node-spider'

import Document from 'node-spider/lib/document'
import {environmentsInterface} from '../cli/environments-interface'

export default class Crawler {

    /**
     * Screenshot environments
     * @type {environmentsInterface}
     */
    environments: environmentsInterface

    /**
     * Site spider
     * @type {Spider}
     */
    spider: Spider

    /**
     * Request user agent
     * @type {string}
     */
    userAgent: string

    /**
     * Crawled domain
     * @type {string}
     */
    domain: string

    /**
     * Screenshot file paths
     * @type {string[]}
     */
    paths: string[] = []

    /**
     * Links already run through the crawler
     * @type {string[]}
     */
    checked: string[] = []

    /**
     * Extension whitelist
     * @type {string[]}
     */
    whiteList: string[] = [
        'html', 'htm', 'xhtml', 'jhtml',
        'php', 'php3', 'php4', 'phtml',
        'asp', 'aspx', 'axd', 'asmx', 'ashx',
        'rhtml', 'shtml', 'xml'
    ]

    /**
     * Crawler constructor
     * 
     * @param {environmentsInterface} environments
     */
    constructor(environments: environmentsInterface) { 
        this.environments = environments
        this.domain = environments[Object.keys(environments)[0]]
        this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    }

    /**
     * Crawl
     * 
     * @return {Promise<any>} [description]
     */
    crawl(): Promise<any> {
        const spinner = ora(`Crawling ${this.domain} `).start()
        return new Promise((resolve, reject) => {
            this.spider = new Spider({
                concurrent: 20,
                error: (error: Error, url: string) => {
                    spinner.warn(`unable to crawl ${url}`)
                    reject(error)
                },
                done: () => {
                    spinner.succeed('Crawling complete')
                    resolve(this.paths)
                },
                headers: { 'user-agent': this.userAgent }
            })

            this.spider.queue(this.domain, (doc: Document) => this.pageHandler(doc))
        })
    }

    /**
     * Handle the link crawling
     * 
     * @param {Document} doc
     */
    protected pageHandler(doc: Document): void {
        var self = this;
        doc.$('a[href]').each(function (i: number, elem: any) {
            let hyperlink: string = doc.$(this).attr('href')

            if (i > 1000000) {
                return false
            }

            hyperlink = self.removeHashes(hyperlink)

            if (self.invalidHyperlink(hyperlink) || self.checked.indexOf(hyperlink) !== -1) {
                return true
            }

            self.checked.push(hyperlink)

            let {next, href} = self.handleAbsolution(hyperlink)

            if (self.paths.indexOf(href) !== -1 || /^(https?\:\/\/)/.test(href)) {
                return true
            }

            self.paths.push(href)

            self.spider.queue(next, (doc: Document) => self.pageHandler(doc))
        })
    }

    /**
     * [invalidHyperlink description]
     * @param  {string}  hyperlink [description]
     * @return {boolean}           [description]
     */
    protected invalidHyperlink(hyperlink: string): boolean {
        return this.invalidProtocal(hyperlink) || this.invalidExtension(hyperlink)
    }

    /**
     * Check if extension is invalid
     * 
     * @param  {string}  hyperlink
     * @return {boolean}
     */
    protected invalidExtension(hyperlink: string): boolean {
        let extension: RegExp = new RegExp('(?:\.([a-z]+))$')
        let matches: string[]|null = extension.exec(hyperlink)
        return extension.test(hyperlink) && this.whiteList.indexOf(matches[1]) === -1
    }

    /**
     * Check if a protocal exists and it is valid
     * 
     * @param  {string}  hyperlink
     * @return {boolean}
     */
    protected invalidProtocal(hyperlink: string): boolean {
        let protocalRegex: RegExp = new RegExp('^(?:[a-z]+(?=\:))')
        let whiteListProtocals: RegExp = new RegExp('^(https?)')

        return protocalRegex.test(hyperlink) && !whiteListProtocals.test(hyperlink)
    }

    /**
     * Remove Hashes from the url
     * 
     * @param  {string} href
     * @return {string}
     */
    protected removeHashes(href: string): string {
        var parsedUrl: URL.Url = URL.parse(href)
        parsedUrl.hash = undefined

        return URL.format(parsedUrl)
    }

    /**
     * Retrieve the next page to crawl
     * Convert the hyperlink to an absolute url
     * 
     * @param {string} href [description]
     */
    protected handleAbsolution(href: string): {next: string, href: string} {
        var obj = {next: href, href}
        var absolute = this.isAbsolute(href)

        if (absolute !== null && absolute[1].length > 1) {
            obj['next'] = this.addProtocal(href)
            obj['href'] = absolute[1][0] == '/' ? absolute[1].slice(1) : absolute[1];
        } else {
            let relativePath: string = href.replace(/^(\/)/, '');
            obj['next'] = this.domain + relativePath
            obj['href'] = relativePath
        }

        return obj
    }

    /**
     * Ensure the protocal is prepended
     * 
     * @param  {string} href
     * @return {string}
     */
    protected addProtocal(href: string): string {
        return /^(https?)/.test(href) ? href : `http://${href}`
    }

    /**
     * Check if the hyperlink is absolute
     * 
     * @param  {string} href
     * @return {null|string}
     */
    protected isAbsolute(href: string): null|string[] {
        let {hostname, pathname} = URL.parse(this.domain)

        let absolute = new RegExp('^(?:(?:https?:\/\/)?(?:www\.)?(?:' + hostname.replace(/(www\.)/, '') + pathname + ')(.*))')
        return href.match(absolute)
    }

}
