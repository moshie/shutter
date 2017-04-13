import * as Promise from 'bluebird'

export interface environmentsInterface {
    [key: string]: string
}

export interface optionsInterface {
    paths?: string|undefined|null
    chunkSize?: number
    directory?: string
    concurrency?: number
}

export interface visitedInterface {
    [key: string]: boolean
}

export interface parsedInterface {
    then?: string
    path?: string
}

export interface CapturerInterface {
    environments: environmentsInterface;
    capture(chunkFilename: string, environment: string): Promise<string>;
}