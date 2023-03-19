function hideElement(elem) {
    elem.style.display = 'none'
}

function showElement(elem) {
    elem.style.display = 'block'
}

function textContent(root, selector, value) {
    let elem = root.querySelector(selector)
    elem.textContent = value;
    return elem;
}

function getUTCDateFromTimestamp(timestamp) {
    let unix_timestamp = timestamp;
    let date = new Date(unix_timestamp * 1000);

    let hours = "0" + date.getHours();

    let minutes = "0" + date.getMinutes();

    // Will display time in 00:00 format
    let formattedTime = hours.slice(-2) + ':' + minutes.slice(-2);

    return formattedTime;
}

function qs(selector, scope) {
    return (scope || document).querySelector(selector);
}

function qsAll(selector, scope) {
    return (scope || document).querySelectorAll(selector);
}

function $on(target, type, callback, capture = false) {
    target.addEventListener(type, callback, capture)
}

export {qs, qsAll, $on, hideElement, showElement, getUTCDateFromTimestamp, textContent}

