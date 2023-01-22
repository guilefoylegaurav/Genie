import { getActiveTabURL } from "./utils.js";

let corpus = ''
let textarea;
let resultsSection;
let analyzeButton;
let getTextButton;
let reloadButton;
let spinner;

const ENDPOINT = "https://GenieBackend.gauravbhattacha.repl.co/api/analyze"

const predict = async () => {
    if (!corpus) {
        alert('Please fill the text field');
        return;
    }

    try {
        showSpinner();
        const response = await fetch(
            ENDPOINT, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },


            body: JSON.stringify({ inputs: corpus }),
        });

        if (!response.ok) {
            hideSpinner();
            resultsSection.innerHTML = "<h1>Error</h1>"
            throw new Error('Could not fetch results');
        }

        const data = await response.json();
        const pc = data.pc;
        const label = data.label === 'Fake' ? 'AI generated' : 'Human written';
        resultsSection.style.display = 'block';
        let resultsColor = 'green'
        if (data.label === 'Fake') {
            resultsColor = 'red'
        }
        hideSpinner();
        resultsSection.style.color = resultsColor
        resultsSection.innerHTML = `<div class="container">
        <div class = "pc">${pc}%</div>
        <div>${label}</div>
        <progress class="progressBar" value="${pc}" max="100" style="accent-color: ${resultsColor}">${pc}</progress>
    </div>`
    } catch (error) {
        hideSpinner();
        resultsSection.style.color = 'red'
        resultsSection.innerHTML = `<div class="container">
        <div class = "pc">Sorry</div>
        <div>Unable to process request</div>
    </div>`
    }
}

const setDOMInfo = info => {
    
        corpus = info.substring(0, 1500);
        textarea.value = corpus;
    
};

const getText = async () => {
    const activeTab = await getActiveTabURL();
    chrome.tabs.sendMessage(
        activeTab.id,
        { from: 'popup', subject: 'DOMInfo' },
        setDOMInfo);
}

const reload = () => {
    corpus = ''
    textarea.value = corpus;
    resultsSection.style.display = 'none';

}

const showSpinner = () => {
    spinner.style.display = 'inline-block';
}

const hideSpinner = () => {
    spinner.style.display = 'none';
}

const initialize = () => {
    resultsSection = document.getElementById('results');
    analyzeButton = document.getElementById('analyze');
    analyzeButton.addEventListener("click", predict);
    getTextButton = document.getElementById('getText');
    getTextButton.addEventListener("click", getText);
    reloadButton = document.getElementsByClassName('reload')[0];
    reloadButton.addEventListener('click', reload);
    textarea = document.getElementById('corpus');
    spinner = document.getElementById('loading')
    textarea.addEventListener('change', (e) => {
        corpus = e.target.value;
    })
}

document.addEventListener("DOMContentLoaded", initialize);