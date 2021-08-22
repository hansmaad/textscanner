export function html(html) {
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    return div.firstChild;
}

export function on(element, event, listener) {
    element.addEventListener(event, listener);
    return offFunc(element, event, listener);
}

export function off(element, event, listener) {
    element.removeEventListener(event, listener);
}

export function offFunc(element, event, listener) {
    return () => element.removeEventListener(event, listener);
}

export function query(elOrCss, cssSelector) {
    if (!cssSelector) {
        cssSelector = elOrCss;
        elOrCss = document;
    }
    return elOrCss.querySelector(cssSelector);
}

export function queryAll(elOrCss, cssSelector) {
    if (!cssSelector) {
        cssSelector = elOrCss;
        elOrCss = document;
    }
    return [].slice.call(elOrCss.querySelectorAll(cssSelector));
}
