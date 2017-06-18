"use strict"

class Validator {

    /**
     * Environments
     * 
     * @type {string[]}
     */
    environments: string[]

    /**
     * Error bag
     * 
     * @type {any[]}
     */
    bag: any[] = []

    /**
     * Validation constructor
     * 
     * @param {string[]}
     */
    constructor (environments: string[]) {
        this.environments = environments;
        this.validate()
    }

    /**
     * Validate environments
     */
    validate() {
        this.checkEmpty()
        for (var i = this.environments.length - 1; i >= 0; i--) {
            let environment: string = this.environments[i];
            if (this.hasEquals(environment)) continue;
            this.hasSymbols(environment)
            this.hasEnvironment(environment)
        }
    }

    /**
     * Checks the entered data has an environment
     * 
     * @param {string}
     * @return {boolean}
     */
    hasEnvironment(environment: string) {
        let [env, url] = environment.split('='),
            hasEnvironment = env.length == 0 || url.length == 0;

        if (hasEnvironment) {
            this.pushError('Oops!', 'Please ensure you provide an environment and domain e.g master=example.com')
        }

        return hasEnvironment;
    }

    /**
     * Checks if the environment has symbols
     * 
     * @param {string}
     * @return {boolean}
     */
    hasSymbols(environment: string) {
        const [env, url] = environment.split('='),
            symbolsRegex = /[!-/ :-@ \[-`£§± {-~]/g,
            hasSymbols = symbolsRegex.test(env);
        
        if (hasSymbols) {
            this.pushError('Oops!', 'Please do not use symbols for your environment.')
        }

        return hasSymbols;
    }

    /**
     * Check the environment contains an equals symbol
     * 
     * @param  {string}
     * @return {boolean}
     */
    hasEquals(environment: string): boolean {
        let equalsMatches: null|string[] = environment.match(/(\=)/g)
        let equals = equalsMatches === null || equalsMatches.length > 1
        
        if (equals) {
            this.pushError('Oops!', 'Please provide an equals between your environment and domain.')
        }

        return equals;
    }

    /**
     * Check the environments exists
     * 
     * @return {boolean}
     */
    checkEmpty(): boolean {
        let empty = !this.environments.length

        if (empty) {
            this.pushError('Oops!', 'Please supply at least one environment!')
        }

        return empty;
    }

    /**
     * Push an error to the error bag 
     * 
     * @param {string = "Error!"}
     * @param {string = "Something went wrong 😔"}
     */
    pushError(title: string = "Error!", message: string = "Something went wrong 😔") {
        this.bag.push({ title, message })
    }

    /**
     * Get the validity of the bag
     * 
     * @return {boolean}
     */
    get valid(): boolean {
        return !this.bag.length
    }

}

export default Validator