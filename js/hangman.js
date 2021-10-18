/* Hangman Game => Source/inspiration : https://www.udemy.com/course/web-projects-with-vanilla-javascript/ */

/* DOM elements */

var hangmanStarterDiv = document.getElementById("hangman-starter-div");
var hangmanGameContainer = document.getElementById("hangman-game-container");

var word = document.getElementById("hangman-word");
var hangmanImg = document.getElementById("hangman-img");
var wrongLettersP = document.getElementById("wrong-letters");
var playerLetterMobile = document.getElementById("hangman-game-mobile");

const popup = document.getElementById('hangman-popup-container');
const popupRules = document.getElementById('hangman-popup-rules');
const popupResult = document.getElementById('hangman-popup-result');

const finalMessage = document.getElementById('hangman-final-message');
const finalWord = document.getElementById('hangman-final-word');
const hangmanResultImg = document.getElementById("hangman-result-img");

/* Variables */

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
var actualLetter;

var imgIndex = 0;

/* jQuery */

/* Handling click on Game Rules button (open popup window) */
$('#hangman-rules-btn').click(function () {
    popup.style.display = 'flex';
    popupRules.classList.remove("hidden");
});

/* Handling click on Game Rules Close button (close popup window) */
$('#hangman-rules-close-btn').click(function () {
    popup.style.display = 'none';
    popupRules.classList.add("hidden");
});

/* Handling click on Start Game button (Show Player layout + Start game) */
$('#hangman-start-btn').click(function () {
    hangmanStarterDiv.classList.add('hidden');
    hangmanGameContainer.classList.remove('hidden');

    if (isMobileDevice()) {
        playerLetterMobile.classList.remove('hidden');
    }

    showWord();
});

/* Handling letter input (text input DOM element) by user for mobile device */
$('#player-letter-mobile').on('input', function () {
    const letter = $(this).val();
    actualLetter = letter;
    checkLetter(actualLetter);
    this.value = "";
});

/* Handling click on New Game button (in popup window) */
$('#hangman-newgame-btn').click(function () {
    correctletters.splice(0);
    wrongLetters.splice(0);
    wrongLettersP.innerHTML = "";

    imgIndex = 0;
    hangmanImg.src = "img/hangman/" + imgIndex.toString() + ".png";
    selectedWord = words[Math.floor(Math.random() * words.length)];

    if (isMobileDevice() && playerLetterMobile.classList.contains('hidden')) {
        playerLetterMobile.classList.remove('hidden');
    }

    showWord();

    popup.style.display = 'none';
    popupResult.classList.add("hidden");
});

/* Handling click on Exit Game button (in popup window) */
$('#hangman-exit-btn').click(function () {
    location.reload();
});

/* Event listeners */

/* Handling letter input (pressing key down) by user for desktop */
window.addEventListener('keydown', e => {
    const letter = e.key;
    actualLetter = letter;
    checkLetter(actualLetter);
});

/* Functions */

/* Check if player uses mobile device */
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

/* Showing lines & letters for current random word during game + handle winner game end */
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
        showResult("winner");
    }
}

/* Check if user character input is a letter */
function isLetter(char) {
    return (/[a-zA-Z]/).test(char);
}

/* Check user character input, if it is in current word and update word/wrong letters accordingly */
function checkLetter(letter) {
    if (isLetter(letter) && letter.length == 1) {
        if (selectedWord.includes(letter)) {
            if (!correctletters.includes(letter)) {
                correctletters.push(letter);
                showWord();
            } else {
                if (!isMobileDevice()) {
                    showNotification();
                }
            }
        }
        else {
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);
                updateWrongLetters(letter);
            } else {
                if (!isMobileDevice()) {
                    showNotification();
                }
            }
        }
    }
}

/* Show alert if user character input was already selected */
function showNotification() {
    alert("You have already entered this letter!");
}

/* Show & update wrong letters selected by user during game  + handle looser game end */
function updateWrongLetters(letter) {
    imgIndex++;
    hangmanImg.src = "img/hangman/" + imgIndex.toString() + ".png";

    if (imgIndex < 9) {
        if (isMobileDevice()) {
            wrongLettersP.innerHTML += letter.toString() + " ";
        }
        else {
            wrongLettersP.innerHTML += letter.toString() + " ";
        }
    }
    else if (imgIndex == 9) {
        showResult("looser");
    }
}

/* Show user result in popup window */
function showResult(result) {
    popup.style.display = 'flex';
    popupResult.classList.remove("hidden");

    finalWord.innerText = selectedWord;
    if (result == "winner") {
        finalMessage.innerText = 'Congratulations! You Won!';
        hangmanResultImg.src = "img/got-winner.png";
    } else {
        finalMessage.innerText = 'Unfortunately You lost..';
        hangmanResultImg.src = "img/got-looser.png";
    }
}