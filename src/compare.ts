import * as path from 'path'
import * as Promise from 'bluebird'
import * as BlinkDiff from 'blink-diff'

function compare(original: string, comparison: string) {
    const originalFolderName = path.basename(path.dirname(original))
    const comparisonFolderName = path.basename(path.dirname(comparison))

    const diff = new BlinkDiff({
        imageAPath: original,
        imageBPath: comparison,
        thresholdType: BlinkDiff.THRESHOLD_PERCENT,
        threshold: 0.01, // 1% threshold
        outputBackgroundBlue: 255,
        outputBackgroundGreen: 255,
        outputBackgroundRed: 255,
        outputBackgroundOpacity: 0.8,
        composition: false,
        outputMaskOpacity: 1,
        imageOutputPath: path.join(process.cwd(), `${originalFolderName}_${comparisonFolderName}_comparisons`, path.basename(original)) // Directory needs to exist
    })

    return new Promise((resolve, reject) => {
        diff.run((error: any, result: any) => {
            if (error) {
                reject(error)
                return;
            }
            resolve(result.code)
        })
    })
}

export default compare