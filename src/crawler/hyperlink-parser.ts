"use strict";

import * as URL from 'url'

import { visitedInterface, parsedInterface } from './interfaces'

class HyperlinkParser {
    
    /**
     * Base url
     * @type {URL.Url}
     */
    base: URL.Url

    /**
     * Valid webpage extensions
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
     * Visited Urls
     * @type {visitedInterface}
     */
    visited: visitedInterface = {}

    /**
     * Hyperlink parser constructor
     * 
     * @param {URL.Url} base
     */
    constructor(base: URL.Url) {
        this.base = base
    }

    /**
     * Parse hyperlink for internal links
     * 
     * @param  {string}    hyperlink
     * @return {undefined}
     */
    parse(hyperlink: string): undefined|parsedInterface {

        let link: URL.Url = URL.parse(hyperlink)

        link = this.removeHash(link)

        hyperlink = URL.format(link)

        if (!link.path || this.invalidExtension(link) || this.visited[this.getLeadingSlashLink(link)]) {
            return
        }

        link = this.shorthandAbsolute(link)

        hyperlink = URL.format(link)

        if (this.isAbsolute(link)) {
            // Absolute link
            this.visited[this.getLeadingSlashLink(link)] = true
            let path: undefined|string = !link.path.startsWith(this.base.path) ? undefined : this.getLeadingSlashLink(link)
            return { path, then: hyperlink }
        }

        if (link.path.split('/')[0].indexOf('.') !== -1) {
            return
        }

        if (this.isRelative(link)) {
            this.visited[this.getLeadingSlashLink(link)] = true
            let path: undefined|string = !link.path.startsWith(this.base.path) ? undefined : this.getLeadingSlashLink(link)
            return { path, then: this.base.protocol + '//' + this.base.host + this.getLeadingSlashLink(link) }
        }

    }

    /**
     * Determine if the hyperlink is relative
     * 
     * @param  {URL.Url} link
     * @return {boolean}
     */
    isRelative(link: URL.Url): boolean {
        return (
            !link.protocol &&
            this.getLeadingSlashLink(link).startsWith(this.base.path)
        )
    }

    /**
     * Ensure the link path has a leading slash
     * 
     * @param  {URL.Url} link
     * @return {string}
     */
    getLeadingSlashLink(link: URL.Url): string {
        return link.path[0] == '/' ? link.path : `/${link.path}`
    }

    /**
     * Check if the hyperlink is written in shorthand
     * 
     * @param  {URL.Url} link
     * @return {URL.Url}
     */
    shorthandAbsolute(link: URL.Url): URL.Url {
        if (link.path.replace(/^(www\.)/, '').startsWith(this.base.host.replace(/^(www\.)/, ''))) {
            link = URL.parse(this.base.protocol + '//' + this.base.host + '/' + link.path.split('/').splice(1).join('/'))
            return link
        }

        return link
    }

    /**
     * Check if the hyperlink is an internal absolute url
     * 
     * @param  {URL.Url} link
     * @return {boolean}
     */
    isAbsolute(link: URL.Url): boolean {
        return (
            link.protocol && /^https?/.test(link.protocol) && 
            link.host && link.host.replace(/^(www\.)/, '') == this.base.host.replace(/^(www\.)/, '')
        )
    }

    /**
     * Remove all hashes from a url
     * 
     * @param  {URL.Url} link
     * @return {URL.Url}
     */
    removeHash(link: URL.Url): URL.Url {
        link.hash = null

        return link
    }

    /**
     * Check if the webpage file extension is valid
     * 
     * @param  {URL.Url} link
     * @return {boolean}
     */
    invalidExtension(link: URL.Url): boolean {
        var matches: string[]|null = /(?:\.([a-z]+))$/.exec(link.path)

        return matches instanceof Array && this.extensions.indexOf(matches[1]) === -1
    }

}

export default HyperlinkParser