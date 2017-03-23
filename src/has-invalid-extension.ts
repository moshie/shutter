const whiteList: string[] = [
    'html',
    'htm',
    'xhtml',
    'jhtml',

    'php',
    'php3',
    'php4',
    'phtml',

    'asp',
    'aspx',
    'axd',
    'asmx',
    'ashx',

    'rhtml',
    'shtml',
    'xml'
]

const extension: RegExp = new RegExp('(?:\.([a-z]+))$')

function hasInvalidExtension(href: string): boolean {
    let matches: string[]|null = extension.exec(href)
    return matches !== null && whiteList.indexOf(matches[1]) === -1
}

export default hasInvalidExtension