import * as Promise from 'bluebird';
import * as fileSystem from 'fs';
const fs: any = Promise.promisifyAll(fileSystem);

function writeChunkToFile(filename: string, contents: string): Promise<string> {
	return fs.writeFileAsync(filename, contents)
		.then(() => filename)
		.catch((error: string) => {
			console.log(error);
		});
}

export default writeChunkToFile