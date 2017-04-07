import * as URL from 'url'
import * as trumpet from 'trumpet'
import * as Promise from 'bluebird'
import * as EventEmitter from 'events'

class HyperlinkParser extends EventEmitter {

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

    constructor(base) {
        super()
        this.base = URL.parse(base)
    }

    parse() {
        var tr = trumpet()

        this.getHyperlinks(tr)
            .then((value: string) => this.parseValue(URL.parse(value)))
            .catch((error) => console.log(error))

        return tr
    }

    parseValue(hyperlink: URL.Url) {
        hyperlink = this.removeHashes(hyperlink)
    }

    removeHashes(hyperlink: URL.Url): URL.Url {
        hyperlink.hash = null;

        return hyperlink;
    }

    getHyperlinks(trumpet: trumpet): Promise<any> {
        return new Promise((resolve, reject) => {
            trumpet.selectAll('a[href]', (element: any) => {
                element.getAttribute('href', (value: string) => {
                    resolve(value)
                })
            })
        })
    }

}

export default HyperlinkParser