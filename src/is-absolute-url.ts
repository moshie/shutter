import * as URL from 'url'
import removeWWW from './remove-www'

function isAbsoluteUrl(domain: URL.Url, href: string): boolean {
	if (typeof domain.host === 'undefined') {
		return false;
	}
	
    var absolute = new RegExp('^((https?:\/\/)?(www\.)?(' + removeWWW(domain.host) + domain.pathname + '))')
    return absolute.test(href)
}

export default isAbsoluteUrl