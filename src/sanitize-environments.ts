import {environmentsInterface} from './environments-interface'
import checkShorthandUrl from './check-shorthand-url'

function sanitizeEnvironments(domains: string[]): environmentsInterface {
    let environments: environmentsInterface = {}

    for (let i = domains.length - 1; i >= 0; i--) {
        let [environment, url] = domains[i].split('=')
        let urlString: string = checkShorthandUrl(url)
        let base: string = urlString[urlString.length-1] == '/' ? urlString : `${urlString}/`
        environments[environment] = base
    }

    return environments
}

export default sanitizeEnvironments