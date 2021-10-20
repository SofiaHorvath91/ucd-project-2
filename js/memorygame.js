/* DOM elements */

let memorygameStarterDiv = document.getElementById("memorygame-starter-div");
let memorygameLevel = document.getElementById("memorygame-levels");

let memorygameContainer = document.getElementById("memorygame-container");
let memorygameTimer = document.getElementById("memorygame-timer");

const popup = document.getElementById('memorygame-popup-container');
const popupRules = document.getElementById('memorygame-popup-rules');
let popupResult = document.getElementById('memorygame-popup-result');
let finalMessage = document.getElementById('memorygame-final-message');
let memorygameResultImg = document.getElementById("memorygame-result-img");
let memorygameResultsContainer = document.getElementById("memorygame-results-container");

let memorygameFinalResultImg = document.getElementById("memorygame-finalresult-img");
let memorygamePlayerLevel = document.getElementById("memorygame-player-level");
let memorygamePlayerResult = document.getElementById("memorygame-player-result");
let memorygamePlayerTries = document.getElementById("memorygame-player-tries");
let memorygamePlayerTime = document.getElementById("memorygame-player-time");
let memorygamePlayerPairs = document.getElementById("memorygame-player-pairs");

let circleItems = document.getElementsByClassName("circle-list-item");
let modal = document.getElementById("circle-img-modal-memorygame");
let modalImg = document.getElementById("modal-img-memorygame");
let modalCaption = document.getElementById("modal-caption-memorygame");

/* Variables */

const cards = [
    'house-tully',
    'house-tully',
    'house-targaryen',
    'house-targaryen',
    'house-lannister',
    'house-lannister',
    'house-stark',
    'house-stark',
    'house-baratheon',
    'house-baratheon',
    'house-arryn',
    'house-arryn',
    'house-greyjoy',
    'house-greyjoy',
    'house-tyrell',
    'house-tyrell',
    'house-martell',
    'house-martell'
];

const cardsRandom = cards
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

let activeCards = [];

let level;
let countdown;
let timer;
let playerTries = 0;
let playTime;
let foundPairs = 0;
let winner;

/* jQuery */

/* Handling click on Game Rules button (open popup window) */
$('#memorygame-rules-btn').click(function () {
    popup.style.display = 'flex';
    popupRules.classList.remove("hidden");
});

/* Handling click on Game Rules Close button (close popup window) */
$('#memorygame-rules-close-btn').click(function () {
    popup.style.display = 'none';
    popupRules.classList.add("hidden");
});

/* On Page load : Arrange house crest images in circle (in section Memory Game - Game Result - Great Houses Presentation) */
$(function () {
    createCircle(circleItems);
});

/* Handling click on Start Game button (Show Player layout + Start game) */
$('#memorygame-start-btn').click(function () {
    level = memorygameLevel.value;
    var levelNum = memorygameLevel.value.split(" ")[0];
    if (parseInt(levelNum) > 0) {
        memorygameStarterDiv.classList.add("hidden");
        memorygameContainer.classList.remove("hidden");

        setCountDown(levelNum);
        createCards();
    } else {
        alert("Please select a game level!");
    }
});

/* Handling click on cards to flip during game */
$('body').on('click', '.cards-img', function () {
    if (activeCards.length == 2) {
        alert("No more than 2 cards at the same time!");
    }
    else if (this.classList.contains("selected-cards")) {
        alert("Card already flipped!");
    }
    else {
        var id = $(this).attr('id');
        this.src = "img/memorygame/" + getCardName(id) + ".png";
        this.classList.add("cards-show");
        this.classList.add("selected-cards");
        activeCards.push(this);

        timer = setTimeout(handleCard, 1300);
    }
});

/* Handling click on See Results button at the end of game (in popup window) */
$('#memorygame-result-btn').click(function () {
    memorygameContainer.classList.add("hidden");
    memorygameResultsContainer.classList.remove("hidden");

    showFinalResults();
    popup.style.display = 'none';
    popupResult.add.remove("hidden");
});

/* Handling click on New Game button (in popup window) */
$('#memorygame-newgame-btn').click(function () {
    location.reload();
});

/* Handle click on house crest images arranged in circle to open modal with house description + read in house description from txt
=> Source / Inspiration : https://www.w3schools.com/howto/howto_css_modal_images.asp */
$('.circle-list-item').click(function () {
    var id = this.id;
    modal.style.display = "block";
    modalImg.src = "img/memorygame/" + id + ".png";

    fetch('txt/houses.txt')
        .then((resp) => resp.text())
        .then(data => {
            var houses = data.split("***");
            for (var i = 0; i < houses.length; i++) {
                var houseName = houses[i].trim().split('\n')[0].split(' ')[1].trim();
                if (id.split("-")[1].toUpperCase() == houseName) {
                    modalCaption.innerHTML = houses[i];
                }
            }
        });
});

/* Handle click on close icon to close house crest modal opened by clicking on house crest image from circle */
$('#close-modal-memorygame').click(function () {
    modal.style.display = "none";
});

/* Functions */

/* Set game time countdown based on provided game level by user (1 or 2 or 3 mins)
=> Source/inspiration : https://www.w3schools.com/howto/howto_js_countdown.asp */
function setCountDown(level) {
    var deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + (parseInt(level)));

    countdown = setInterval(function () {

        var now = new Date().getTime();
        var distance = deadline - now;

        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        memorygameTimer.innerHTML = minutes + " MINS " + seconds + " SECS ";
        if (minutes >= 0 && seconds >= 0) {
            playTime = ((parseInt(level) - minutes) - 1) + " MINS " + (60 - seconds) + " SECS ";
        } else {
            playTime = parseInt(level) + " MINS 0 SECS ";
        }

        if (distance < 0) {
            clearInterval(countdown);
            winner = false;
            popupFinalResults("Unfortunately You lost..");
        }
    }, 1000);
}

/* Create memory cards when starting game */
function createCards() {
    var columns = document.getElementsByClassName("cards-column");

    for (var i = 0; i < cardsRandom.length; i++) {
        var image = document.createElement("img");
        image.classList.add("cards-img");
        image.setAttribute('id', cardsRandom[i].toString() + "_" + i.toString());
        image.setAttribute('src', "img/memorygame/card-back.png");

        if (i >= 0 && i < 3) {
            columns[0].appendChild(image);
        }
        else if (i >= 3 && i < 6) {
            columns[1].appendChild(image);
        }
        else if (i >= 6 && i < 9) {
            columns[2].appendChild(image);
        }
        else if (i >= 9 && i < 12) {
            columns[3].appendChild(image);
        }
        else if (i >= 12 && i < 15) {
            columns[4].appendChild(image);
        }
        else {
            columns[5].appendChild(image);
        }
    }
}

/* Evaluating flipped cards (Turning them back or leaving them visible 
+ handling game end if user finds all pairs before countdown ends) */
function handleCard() {
    playerTries++;
    if (activeCards.length == 2) {
        if (getCardName(activeCards[0].id) != getCardName(activeCards[1].id)) {
            turnBackCards(activeCards);
        }
        else {
            foundPairs++;
            if (foundPairs == (cards.length / 2)) {
                clearInterval(countdown);
                winner = true;
                popupFinalResults("Congratulations! You Won!");
            }
        }
    }
    else {
        turnBackCards(activeCards);
    }
    clearTimeout(timer);
    activeCards.splice(0);
}

/* Turn back cards if no match */
function turnBackCards(activeCards) {
    for (var i = 0; i < activeCards.length; i++) {
        activeCards[i].classList.remove("cards-show");
        activeCards[i].classList.remove("selected-cards");
        activeCards[i].src = "img/memorygame/card-back.png";
    }
}

/* Automation for getting card value (house name) based on card DOM's id */
function getCardName(name) {
    return name.toString().split("_")[0];
}

/* Show user result in popup window */
function popupFinalResults(text) {
    if (winner) {
        memorygameResultImg.src = "img/got-winner.png";
    } else {
        memorygameResultImg.src = "img/got-looser.png";
    }
    finalMessage.innerText = text;
    popup.style.display = 'flex';
    popupResult.classList.remove("hidden");
}

/* Show detailed results after exiting game end popup window */
function showFinalResults() {
    if (winner) {
        memorygamePlayerResult.innerHTML = "Congratulations! You Won!";
        memorygameFinalResultImg.src = "img/got-winner.png";
    } else {
        memorygamePlayerResult.innerHTML = "Unfortunately You lost..";
        memorygameFinalResultImg.src = "img/got-looser.png";
    }
    memorygamePlayerLevel.innerHTML += level;
    memorygamePlayerTries.innerHTML += playerTries + " FLIPS";
    memorygamePlayerTime.innerHTML += playTime;
    memorygamePlayerPairs.innerHTML += foundPairs + " / " + (cards.length / 2);
}

/* Arrange house crest images in circle (in section Memory Game - Game Result - Great Houses Presentation)
=> Source/Inspiration : https://jsfiddle.net/skwidbreth/q59s90oy/ */
function createCircle(listItems) {
    for (var i = 0; i < listItems.length; i++) {
        var offsetAngle = 360 / listItems.length;
        var rotateAngle = offsetAngle * i;
        $(listItems[i]).css("transform", "rotate(" + rotateAngle + "deg) translate(0, -120px) rotate(-" + rotateAngle + "deg)");
    }
}