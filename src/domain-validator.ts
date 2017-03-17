import Bag from './bag'
import checkShorthandUrl from './check-shorthand-url'

function hasDomains(domains: string[] = []): boolean {
    return domains.length == 0 ? false : true
}

function domainIsInvalid(domain: string = ''): boolean {
    return domain.indexOf('=') === -1
}

function isEnvironmentProvided(domain: string = ''): boolean {
    if (domainIsInvalid(domain)) {
        return false;
    }
    let [environment, url] = domain.split('=')
    return !environment.length || !url.length
}

function environmentHasSymbols(domain: string = ''): boolean {
    if (domainIsInvalid(domain)) {
        return false;
    }
    let [environment, url] = domain.split('=')
    let symbolsRegex = /[!-/ :-@ \[-` {-~]/g;
    return symbolsRegex.test(environment)
}

function domainValidator(domains: string[] = []): Bag {
    const bag: Bag = new Bag('Validation Error');

    if (!hasDomains(domains)) {
        bag.add('Please specify environments to screenshot e.g. master=http://www.google.com');
        return bag;
    }
    
    for (let i = domains.length - 1; i >= 0; i--) {
        let domain = domains[i]

        if (domainIsInvalid(domain)) {
            bag.add(`Please specify the domain for ${domains[i]} e.g. master=http://www.google.com`)
            continue
        }

        if (isEnvironmentProvided(domain)) {
            bag.add(`Invalid Environment provided "${domain}"`)
        }

        if (environmentHasSymbols(domain)) {
            bag.add(`Environment cannot contain symbols! "${domain}"`)
        }

    }

    return bag
}

export default domainValidator