let corpus = ''
let textarea; 
let resultsSection;
let analyzeButton;
let getTextButton;
let reloadButton;

const setDOMInfo = info => {
    corpus = info.substring(0, 500);
    console.log(corpus)
    textarea.value = corpus;
};

const getText = async () => {
    const activeTab = await getActiveTabURL();
    chrome.tabs.sendMessage(
        activeTab.id,
        { from: 'popup', subject: 'DOMInfo' },
        setDOMInfo);
}

const initialize = () => {
    resultsSection = document.getElementById('results');
    analyzeButton = document.getElementById('analyze');
    getTextButton = document.getElementById('getText');
    reloadButton = document.getElementsByClassName('reload')[0];
    textarea = document.getElementById('corpus'); 
    textarea.addEventListener('change', (e) => {
        corpus = e.target.value;
    })
}



document.addEventListener("DOMContentLoaded", initialize);