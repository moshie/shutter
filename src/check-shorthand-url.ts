import * as URL from 'url'

function checkShorthandUrl(domain: string): string {
    let url: URL.Url = URL.parse(domain)

    if (url.protocol === null) {
        url = URL.parse(`http://${domain}`)
    }

    return URL.format(url);
}

export default checkShorthandUrl