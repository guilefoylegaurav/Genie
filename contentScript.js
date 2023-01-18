(() => {
    chrome.runtime.onMessage.addListener((msg, sender, response) => {
        if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
            let domInfo = document.body.innerText;
            response(domInfo);
        }
    });
})();