import Bag from './bag'

function validationHandler(bag: Bag): boolean {
    if (!bag.contents.length) {
        return false;
    }

    for (var i = bag.contents.length - 1; i >= 0; i--) {
        console.log(`${bag.contents[i].prefix}${bag.contents[i].message}`) // replace with actual logger
    }

    return true;
}

export default validationHandler