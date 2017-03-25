const symbolsRegex = /[!-/ :-@ \[-` {-~]/g;

function hasSymbols(domain: string = ''): boolean {
    let [environment, url] = domain.split('=')

    return symbolsRegex.test(environment)
}

export default hasSymbols