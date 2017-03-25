import isEmpty from './is-empty';
import isInvalid from './is-invalid'

function validator(domains: string[] = []): void {

    if (isEmpty(domains)) {
        throw new Error('Please specify environments to screenshot e.g. master=http://www.google.com')
    }
    
    for (let i = domains.length - 1; i >= 0; i--) {
        let domain = domains[i]

        if (isInvalid(domain)) {
            throw new Error(`"${domain}" is an invalid domain (master=http://www.google.com)`)
        }

    }
}

export default validator