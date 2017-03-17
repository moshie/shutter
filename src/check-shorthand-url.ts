import * as URL from 'url'

function checkShorthandUrl(domain: string): URL.Url {
    let url: URL.Url = URL.parse(domain)

    if (url.protocol === null) {
        url = URL.parse(`http://${domain}`)
    }

    return url;
}

export default checkShorthandUrl