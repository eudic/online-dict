function eudic_onlineDictPlugin_getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function eudic_onlineDictPlugin_onloadFinish() {
    const scriptId = eudic_onlineDictPlugin_getParameterByName('id', document.currentScript.src);
    const sectionDom = document.getElementById('eudic-onlinedict-section-' + scriptId);
    if (sectionDom) {
        var itemList = sectionDom.querySelectorAll('[eudic-onlinedict-custom-onclick]');
        if (itemList && itemList.length > 0) {
            for (const item of itemList) {
                const itemFuncName = item.getAttribute('eudic-onlinedict-custom-onclick');
                const func = window[itemFuncName];
                if (typeof func === 'function') {
                    item.ontouchend = func
                }
            }
        }
    }
}

eudic_onlineDictPlugin_onloadFinish();