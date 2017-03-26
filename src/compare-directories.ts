import * as Promise from 'bluebird'
import checkPathsAreDirectories from './check-paths-are-directories'
import makeComparisonFolder from './make-comparison-folder'
import folderComparison from './folder-comparison'

function compareDirectories(comparisonOne: string, comparisonTwo: string): Promise<any> {
	return checkPathsAreDirectories(comparisonOne, comparisonTwo)
		.then(() => makeComparisonFolder(comparisonOne, comparisonTwo))
		.then(() => folderComparison(comparisonOne, comparisonTwo))
}

export default compareDirectories