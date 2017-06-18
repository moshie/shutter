"use strict"

import { environmentsInterface } from '../screenshot/interfaces'

class Sanitizer {

    /**
     * Environments
     * 
     * @type {string[]}
     */
    environments: string[]

    /**
     * Sanatized environment data
     * 
     * @type {environmentsInterface}
     */
    data: environmentsInterface = {}

    /**
     * Sanitizer constructor
     * 
     * @param {string[]}
     */
    constructor (environments: string[]) {
        this.environments = environments
        this.sanitize()
    }

    /**
     * Sanatize environments
     */
    sanitize () {
        this.environments = this.removeDuplicates();
        for (var i = 0; i < this.environments.length; i++) {
            let [env, domain] = this.environments[i].split('=')
            this.data[env] = this.addTrailingSlash(
                this.addProtocol(domain)
            )
        }
    }

    /**
     * Check and remove duplicate environments
     */
    removeDuplicates () {
        let envs: string[] = this.environments.map((elem) => elem.split('=')[0])
        return this.environments.filter((elem, index, arr) => index == envs.indexOf(elem.split('=')[0]))
    }

    /**
     * Add a trailing slash to the domain
     * 
     * @param  {string}
     * @return {string}
     */
    addTrailingSlash (domain: string): string {
        return domain[domain.length - 1] == '/' ? domain : `${domain}/`
    }

    /**
     * Add a protocol to the domain
     * 
     * @param  {string}
     * @return {string}
     */
    addProtocol (domain: string): string {
        return /^(https?)/.test(domain) ? domain : `http://${domain}`
    }

    /**
     * Get the sanitized data
     */
    get sanitized (): environmentsInterface {
        return this.data
    }

}

export default Sanitizer