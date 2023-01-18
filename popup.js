import { getActiveTabURL } from "./utils.js";

let corpus = ''
let textarea;
let resultsSection;
let analyzeButton;
let getTextButton;
let reloadButton;

const ENDPOINT = "https://GenieBackend.gauravbhattacha.repl.co/api/analyze"

const predict = async () => {
    if (!corpus) {
        alert('Please fill the text field');
        return;
    }

    try {
        const response = await fetch(
            ENDPOINT, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },


            body: JSON.stringify({ inputs: corpus }),
        });

        if (!response.ok) {
            resultsSection.innerHTML = "<h1>Error</h1>"
            throw new Error('Could not fetch results');
        }

        const data = await response.json();
        const { label, pc } = data;
        resultsSection.style.display = 'block';
        let resultsColor = 'green'
        if (label === 'Fake') {
            resultsColor = 'red'
        }
        resultsSection.style.color = resultsColor
        resultsSection.innerHTML = `<div class="container">
        <div class = "pc">${pc}%</div>
        <div>${label}</div>
        <progress class="progressBar" value="${pc}" max="100" style="accent-color: ${resultsColor}">${pc}</progress>
    </div>`
    } catch (error) {
        resultsSection.style.color = 'red'
        resultsSection.innerHTML = `<div class="container">
        <div class = "pc">Sorry</div>
        <div>Unable to process request</div>
    </div>`
    }
}

const setDOMInfo = info => {
    corpus = info.substring(0, 500);
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

const initialize = () => {
    resultsSection = document.getElementById('results');
    analyzeButton = document.getElementById('analyze');
    analyzeButton.addEventListener("click", predict);
    getTextButton = document.getElementById('getText');
    getTextButton.addEventListener("click", getText);
    reloadButton = document.getElementsByClassName('reload')[0];
    reloadButton.addEventListener('click', reload);
    textarea = document.getElementById('corpus');
    textarea.addEventListener('change', (e) => {
        corpus = e.target.value;
    })
}

document.addEventListener("DOMContentLoaded", initialize);