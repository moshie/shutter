import Bag from './bag'
import hasDomains from './has-domains'
import domainIsInvalid from './domain-is-invalid'
import checkShorthandUrl from './check-shorthand-url'
import isEnvironmentProvided from './is-environment-provided'
import environmentHasSymbols from './environment-has-symbols'

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