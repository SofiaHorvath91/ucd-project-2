var hangmanStarterDiv = document.getElementById("hangman-starter-div");
var hangmanGameContainer = document.getElementById("hangman-game-container");
var word = document.getElementById("hangman-word");
var hangmanImg = document.getElementById("hangman-img");
var wrongLettersP = document.getElementById("wrong-letters");
const popup = document.getElementById('hangman-popup-container');
const finalMessage = document.getElementById('hangman-final-message');
var hangmanResultImg = document.getElementById("hangman-result-img");

const words = [
    'red wedding',
    'house of black and white',
    'king of the north',
    'casterly rock',
    'rains of castamere',
    'winter is coming',
    'xaro xhoan daxos',
    'balerion the black dread',
    'aegon the conqueror',
    'lord of light',
    'seven kingdoms',
    'mother of dragons'
];

let selectedWord = words[Math.floor(Math.random() * words.length)];

const correctletters = [];
const wrongLetters = [];

var imgIndex = 0;

$(function () {
    showWord();
});

$('#hangman-start-btn').click(function () {
    hangmanStarterDiv.classList.add('hidden');
    hangmanGameContainer.classList.remove('hidden');
});

$('#hangman-newgame-btn').click(function () {
    correctletters.splice(0);
    wrongLetters.splice(0);
    wrongLettersP.innerHTML = "";

    imgIndex = 0;
    hangmanImg.src = "img/hangman/" + imgIndex.toString() + ".png";
    selectedWord = words[Math.floor(Math.random() * words.length)];

    showWord();

    popup.style.display = 'none';
});

$('#hangman-exit-btn').click(function () {
    location.reload();
});

window.addEventListener('keypress', e => {
    if(isMobileDevice()){
        window.prompt();
    }
    
    if (e.key.length == 1) {
        const letter = e.key;
        if (selectedWord.includes(letter)) {
            if (!correctletters.includes(letter)) {
                correctletters.push(letter);
                showWord();
            } else {
                showNotification();
            }
        }
        else {
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);
                updateWrongLetters(letter);
            } else {
                showNotification();
            }
        }
    }
});

function showWord() {

    word.innerHTML =
        `${selectedWord
            .split('')
            .map(letter =>
                `<span class=${letter != " " ? "letter" : "empty-space"}>
                ${correctletters.includes(letter) ? letter : ''}
                </span>`)
            .join('')
        }`;

    const innerWord = word.innerText.replace(/\n/g, '');
    const selectedFinal = selectedWord.toLowerCase().replace(/ /g, '');

    if (innerWord === selectedFinal) {
        finalMessage.innerText = 'Congratulations! You Won!';
        hangmanResultImg.src = "img/got-winner.png";
        popup.style.display = 'flex';
    }
}

function showNotification() {
    alert("You have already entered this letter!");
}

function updateWrongLetters(letter) {

    imgIndex++;
    hangmanImg.src = "img/hangman/" + imgIndex.toString() + ".png";
    if (imgIndex < 9) {
        wrongLettersP.innerHTML += letter.toString() + " ";
    }
    else if (imgIndex == 9) {
        finalMessage.innerText = 'Unfortunately You lost..';
        hangmanResultImg.src = "img/got-looser.png";
        popup.style.display = 'flex';
    }
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};