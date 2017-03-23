import domainIsInvalid from './domain-is-invalid'

const symbolsRegex = /[!-/ :-@ \[-` {-~]/g;

function environmentHasSymbols(domain: string = ''): boolean {
    if (domainIsInvalid(domain)) {
        return false;
    }
    let [environment, url] = domain.split('=')

    return symbolsRegex.test(environment)
}

export default environmentHasSymbols