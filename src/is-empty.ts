function isEmpty(domains: string[] = []): boolean {
    return domains instanceof Array && domains.length === 0
}

export default isEmpty