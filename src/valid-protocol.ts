
const protocolRegex: RegExp = new RegExp('^(?:[a-z]+(?=\:))')

const whiteListProtocols = new RegExp('^(https?)')

function validProtocol(href: string): boolean {
    let matches: string[]|null = href.match(protocolRegex)
    return !(matches !== null && !whiteListProtocols.test(matches[0]))
}

export default validProtocol