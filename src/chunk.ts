export default function chunk(array: any[], size: number): any[][] {
    let chunks: any[][] = []

    for (let i: number = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
    }

    return chunks
}