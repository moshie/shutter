function domainIsInvalid(domain: string = ''): boolean {
    return domain.indexOf('=') === -1
}

export default domainIsInvalid