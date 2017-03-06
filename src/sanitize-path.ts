function sanitizePath(path: string): string {
    path = path.replace(/^\/|\/$/g, '')
    path = path.replace(/\//g, '_')
    return !path ? 'home' : path
}

export default sanitizePath