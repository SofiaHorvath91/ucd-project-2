var memorygameStarterDiv = document.getElementById("memorygame-starter-div");
var memorygameLevel = document.getElementById("memorygame-levels");

var memorygameContainer = document.getElementById("memorygame-container");
var memorygameTimer = document.getElementById("memorygame-timer");
var memorycardsContainer = document.getElementById("memorycards-container");

const popup = document.getElementById('memorygame-popup-container');
const finalMessage = document.getElementById('memorygame-final-message');
var memorygameResultImg = document.getElementById("memorygame-result-img");
var memorygameResultsContainer = document.getElementById("memorygame-results-container");

var memorygameFinalResultImg = document.getElementById("memorygame-finalresult-img");
var memorygamePlayerResult = document.getElementById("memorygame-player-result");
var memorygamePlayerTries = document.getElementById("memorygame-player-tries");
var memorygamePlayerTime = document.getElementById("memorygame-player-time");
var memorygamePlayerPairs = document.getElementById("memorygame-player-pairs");

var circleItems = document.getElementsByClassName("circle-list-item");
var modal = document.getElementById("circle-img-modal-memorygame");
var modalImg = document.getElementById("modal-img-memorygame");
var modalCaption = document.getElementById("modal-caption-memorygame");
var closeModal = document.getElementById("close-modal-memorygame");

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

const activeCards = [];

var countdown;
var timer;
var playerTries = 0;
var playTime;
var foundPairs = 0;
var winner;

$(function () {
    createCircle(circleItems);
});

$('#memorygame-start-btn').click(function () {
    if (parseInt(memorygameLevel.value) > 0) {
        memorygameStarterDiv.classList.add("hidden");
        memorygameContainer.classList.remove("hidden");

        setCountDown(memorygameLevel.value);
        createCards();
    } else {
        alert("Please select a game level!");
    }
});

$('body').on('click', '.cards-img', function () {
    if (activeCards.length == 2) {
        alert("No more than 2 cards at the same time!");
    }
    else if (this.classList.contains("selected-cards")) {
        alert("Card already flipped!");
    }
    else {
        var id = $(this).attr('id');
        this.src = "img/memorygame/" + getCardName(id) + ".png"
        this.classList.add("cards-show");
        this.classList.add("selected-cards");
        activeCards.push(this);

        timer = setTimeout(handleCard, 1500);
    }
});

$('#memorygame-result-btn').click(function () {
    memorygameContainer.classList.add("hidden");
    memorygameResultsContainer.classList.remove("hidden");

    showFinalResults();
    popup.style.display = 'none';
});

$('#memorygame-newgame-btn').click(function () {
    location.reload();
});

$('.circle-list-item').click(function () {
    var id = this.id;
    modal.style.display = "block";
    modalImg.src = "img/memorygame/" + id + ".png";

    fetch('txt/houses.txt')
        .then((resp) => resp.text())
        .then(data => {
            var houses = data.split("***");
            for (var i = 0; i < houses.length; i++) {
                var houseName = houses[i].trim().split('\n')[0].split(' ')[1].trim()
                if (id.split("-")[1].toUpperCase() == houseName) {
                    modalCaption.innerHTML = houses[i];
                }
            }
        });
});

$('#close-modal-memorygame').click(function () {
    modal.style.display = "none";
});

$('#memorygame-newgame-btn').click(function () {
    location.reload();
});

function setCountDown(level) {
    var deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + parseInt(level));

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

function turnBackCards(activeCards) {
    for (var i = 0; i < activeCards.length; i++) {
        activeCards[i].classList.remove("cards-show");
        activeCards[i].classList.remove("selected-cards");
        activeCards[i].src = "img/memorygame/card-back.png";
    }
}

function getCardName(name) {
    return name.toString().split("_")[0];
}

function popupFinalResults(text) {
    if (winner) {
        memorygameResultImg.src = "img/got-winner.png";
    } else {
        memorygameResultImg.src = "img/got-looser.png";
    }
    finalMessage.innerText = text;
    popup.style.display = 'flex';
}

function showFinalResults() {
    if (winner) {
        memorygamePlayerResult.innerHTML = "Congratulations! You Won!";
        memorygameFinalResultImg.src = "img/got-winner.png";
    } else {
        memorygamePlayerResult.innerHTML = "Unfortunately You lost..";
        memorygameFinalResultImg.src = "img/got-looser.png";
    }
    memorygamePlayerTries.innerHTML += playerTries + " FLIPS";
    memorygamePlayerTime.innerHTML += playTime;
    memorygamePlayerPairs.innerHTML += foundPairs + " / " + (cards.length / 2);
}

function createCircle(listItems) {
    for (var i = 0; i < listItems.length; i++) {
        var offsetAngle = 360 / listItems.length;
        var rotateAngle = offsetAngle * i;
        $(listItems[i]).css("transform", "rotate(" + rotateAngle + "deg) translate(0, -120px) rotate(-" + rotateAngle + "deg)")
    };
}