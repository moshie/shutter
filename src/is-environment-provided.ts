import domainIsInvalid from './domain-is-invalid'

function isEnvironmentProvided(domain: string = ''): boolean {
    if (domainIsInvalid(domain)) {
        return false;
    }
    let [environment, url] = domain.split('=')
    return !environment.length || !url.length
}

export default isEnvironmentProvided