function removeWWW(hostname: string): string {
    return hostname.indexOf('www.') !== -1 ? hostname.slice(4) : hostname;
}

export default removeWWW