
export default function validation(domains: string[]) {

	if (domains instanceof Array && domains.length === 0) {
		throw new Error('Please specify environments to screenshot (master=http://www.example.com)')
	}

	for (let i = domains.length - 1; i >= 0; i--) {
		let domain: string = domains[i]

		if (isInvalid(domain)) {
			throw new Error(`${domain} is an invalid environment (master=http://www.example.com)`)
		}
	}
}

export function hasEnv(domain: string = ''): boolean {
    let [environment, url] = domain.split('=')

    return !environment.length || !url.length
}

export function hasSymbols(domain: string = ''): boolean {
	const symbolsRegex = /[!-/ :-@ \[-` {-~]/g;
    let [environment, url] = domain.split('=')

    return symbolsRegex.test(environment)
}

export function isInvalid(domain: string = ''): boolean {
	let equalsMatches: null|string[] = domain.match(/(\=)/g)

	return equalsMatches === null || 
		domain.indexOf('=') === -1 || 
		equalsMatches.length > 1 || 
		hasSymbols(domain) || 
		hasEnv(domain)
}

