export interface crawlerOptionsInterface {
    concurrent?: number
    headers?: any
    xhr?: boolean
    keepAlive?: boolean
    forever?: boolean
    allowDuplicates?: boolean
}

export interface sitesVisited {
    [key: string]: boolean
}