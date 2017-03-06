import screenshot from './screenshot'
import * as Promise from 'bluebird'

// screenshot master https://www.google.com/ copy https://dev.google.com/ test https://test.google.com/

// compare copy master


// var environments = {
// 	'master': 'https://google.com/',
// 	'develop': 'https://dev.google.com/',
// 	'test': 'https://test.google.com/'
// }

// Crawl first domain get back list of paths

// var paths = [
// 	'/home',
// 	'/about',
// 	'/contact',
// 	'/home',
// 	'/about',
// 	'/contact',
// 	'/home',
// 	'/about',
// 	'/contact',
// 	'/home',
// 	'/about',
// 	'/contact'
// ];

// Chunk paths `import chunk from './chunk'`

// [
// 	['/home',
// 	'/about',
// 	'/contact'],
// 	['/home',
// 	'/about',
// 	'/contact'],
// 	['/home',
// 	'/about',
// 	'/contact']
// ]


// loop through chunks for each environment add them to a file `chunk-{index}.json` run screenshot:


// Promise.map(chunks, (chunk, index) => {
// 	fs.writeAsync(`chunk-${index}`, JSON.stringify(chunk))
// 		.then((chunkFilename) => {
// 			var promises = [];
// 			Object.keys(environments).forEach((env) => {
// 				var domain = environments[env];
// 				promises.push(
// 					screenshot(chunkFilename, domain, environment)
// 				)
// 			})

// 			return Promise.join(promises)
// 		})
// }, {concurrency: 6})

var domain: string = 'https://www.serentipi.co.uk';
var environment: string = 'master';

Promise.join(
	screenshot(__dirname + '/chunk-0.json', domain, 'master'), 
	screenshot(__dirname + '/chunk-0.json', domain, 'test')
)
	.then((response: any) => {
		console.log(response);
	})
	.catch((errors: any) => {
		console.log(errors)
	})



