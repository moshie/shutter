function isJson(json: string): boolean {
	
    try {
        JSON.parse(json);
    } catch (e) {
        return false;
    }

    return true;
}

export default isJson;