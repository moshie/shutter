function hasEnv(domain: string = ''): boolean {
    let [environment, url] = domain.split('=')

    return !environment.length || !url.length
}

export default hasEnv