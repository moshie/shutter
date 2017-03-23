import * as URL from 'url'

const firstForwardSlash: RegExp = new RegExp('^(\/)')

function mergePathname(domain: URL.Url, href: string): string {
    return URL.format(domain) + href.replace(firstForwardSlash, '')
}

export default mergePathname