import hasEnv from './has-env'
import hasSymbols from './has-symbols'

function isInvalid(domain: string = ''): boolean {
	let equalsMatches: null|string[] = domain.match(/(\=)/g)
	if (equalsMatches === null) {
		return true
	}

	return domain.indexOf('=') === -1 || equalsMatches.length > 1 || hasSymbols(domain) || hasEnv(domain)
}

export default isInvalid