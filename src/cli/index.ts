"use strict"

import * as Promise from 'bluebird'

import sanitize from './sanitizer'

//import Compare from '../compare'
import directoriesExistIn from '../utilities/directories-exist-in'

import { Duplex } from 'stream'

import { optionsInterface, environmentsInterface } from '../screenshot/interfaces'

import Screenshot from '../screenshot'

/**
 * Handle CLI Screenshots
 * 
 * @param {string[]} rawEnvironments 
 * @param {optionsInterface} options
 */
export function handleScreenshots(rawEnvironments: string[], options: optionsInterface): Duplex {

    const environments: environmentsInterface = sanitize(rawEnvironments)

    const screenshot: Screenshot = new Screenshot(environments, options)

    return screenshot.capture()
}

/**
 * Handle CLI Comparison
 * 
 * @param {string} original 
 * @param {string} comparison 
 * @param {optionsInterface} options
 */
export function handleCompare(original: string, comparison: string, options: optionsInterface): any {


    // {
    //     original: ['/path/'],
    //     comparison: ['/path/'],
    //     develop: ['/']
    // }

    const compare: Compare = new Compare(options.directory);

    compare.compare({
        original: '/path/to/original.png', // Can be an array / string
        comparison: '/path/to/comparison.png'
    }); -> API

    let environments: string[] = [`original=${original}`, `comparison=${comparison}`]
    return handleScreenshots(environments, options)

    // original = path or url

    // if (/** original && comparison are directories */) {
    //     const ReadDirectory = ReadDirectory(original)
    //     const compare = new Compare(options.directory)
    //     // ReadDirectory.read()  -> ['/path/master/file.png', '/path/develop/file.png']
    //     ReadDirectory.read() 
        
        

    //     compare.compare()
    // }

    // // TODO: Make Comparison work with streams <3
    // // if (directoriesExistIn(options.directory || process.cwd(), original, comparison)) {
    // //     return (new Compare(original, comparison, options.directory)).run()
    // // }



    // let compare: Compare = new Compare(options.directory)

    // //compare.compare('/path/master/file.png', '/path/develop/file.png'); -> API


    

    //.pipe(compare) // STREAM

}