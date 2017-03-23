import * as URL from 'url'

function removeHash(href: string): string {
    var parsedUrl: URL.Url = URL.parse(href)
    parsedUrl.hash = undefined

    return URL.format(parsedUrl)
}

export default removeHash