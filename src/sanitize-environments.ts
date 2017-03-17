import {environmentsInterface} from './environments-interface'
import checkShorthandUrl from './check-shorthand-url'
import * as URL from 'url'

function sanitizeEnvironments(domains: string[]): environmentsInterface {
    let environments: environmentsInterface = {}

    for (let i = domains.length - 1; i >= 0; i--) {
        let split = domains[i].split('=')
        let url: URL.Url = checkShorthandUrl(split[1])
        var urlString = URL.format(url)
        let base = urlString[urlString.length-1] === '/' ? urlString : `${urlString}/`
        environments[split[0]] = base
    }

    return environments
}

export default sanitizeEnvironments