/* DOM elements */

let sortingContainer = document.getElementById("sorting-container");
let sortingResultsContainer = document.getElementById("sorting-results-container");

let sortingCheckboxes = document.getElementsByClassName("quiz-cb");

let sortingQuestion = document.getElementById("sorting-question");
let sortingAnswer1 = document.getElementById("sorting-answer-label-1");
let sortingAnswer2 = document.getElementById("sorting-answer-label-2");
let sortingAnswer3 = document.getElementById("sorting-answer-label-3");
let sortingNextQuestionBtn = document.getElementById("sorting-next-btn");
let sortingEndBtn = document.getElementById("sorting-end-btn");

let sortingResultsImgs = document.getElementById("final-houses");
let sortingResultsTxt = document.getElementById("final-houses-txt");
let sortingResult = document.getElementById("sorting-player-result");
let sortingResultPercent = document.getElementById("sorting-result-percentage");

let circleItems = document.getElementsByClassName("circle-list-item");
let modal = document.getElementById("circle-img-modal-sorting");
let modalImg = document.getElementById("modal-img-sorting");
let modalCaption = document.getElementById("modal-caption-sorting");
let modalCaptionPercent = document.getElementById("caption-percentage-sorting");

/* Variables */

let questions = [];
let questionIndex = 0;
let selectedAnswer;
let playerHouses = [];
let countPlayerHouses = [];
let playerFinalHouses = [];
let playerFinalHousesTxt = [];

const countHouse = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

const houseNames = [
    'tully',
    'targaryen',
    'lannister',
    'stark',
    'baratheon',
    'arryn',
    'greyjoy',
    'tyrell',
    'martell'
];

/* jQuery */

/* On Page load : 
- Arrange house crest images in circle (in section Memory Game - Game Result - Great Houses Presentation)
- Read in questions from txt + Set first question */
$(function () {
    createCircle(circleItems);

    fetch('txt/houses-sorting.txt')
        .then((resp) => resp.text())
        .then(data => {
            const questionsArray = data.split("***");
            for (var i = 0; i < questionsArray.length; i++) {
                var questionElements = questionsArray[i].split("-");
                var question = {
                    "question": questionElements[0].trim(),
                    "answer1": {
                        "answer": questionElements[1].trim().split("/")[0].trim(),
                        "houses": questionElements[1].trim().split("/")[1].trim()
                    },
                    "answer2": {
                        "answer": questionElements[2].trim().split("/")[0].trim(),
                        "houses": questionElements[2].trim().split("/")[1].trim()
                    },
                    "answer3": {
                        "answer": questionElements[3].trim().split("/")[0].trim(),
                        "houses": questionElements[3].trim().split("/")[1].trim()
                    }
                };
                questions.push(question);
            }
            setQuestionAnswers();
        });
});

/* Handle click on answer label (checking corresponding checkbox + store selected answer) */
$('.answer-label').click(function () {
    var id = $(this).attr('id');
    var cbId = "answer-" + id.split("-")[3];
    document.getElementById("sorting-" + cbId).checked = true;
    for (var i = 0; i < sortingCheckboxes.length; i++) {
        if (sortingCheckboxes[i].classList.contains(cbId)) {
            sortingCheckboxes[i].checked = false;
        }
    }
    selectedAnswer = id.split("-")[3];
});

/* Handle click on answer checkbox (check it and uncheck all others + store selected answer) */
$('.quiz-cb').change(function () {
    var id = $(this).attr('id');
    for (var i = 0; i < sortingCheckboxes.length; i++) {
        if (sortingCheckboxes[i].id != id) {
            sortingCheckboxes[i].checked = false;
        }
    }
    selectedAnswer = this.id.split("-")[2];
});

/* Handle click on Next Question button 
(store selection, deselect answer checkboxes, show next question & show End Answer button if needed) */
$('#sorting-next-btn').click(function () {
    var isChecked = $('input:checkbox').is(':checked');
    if (!isChecked) {
        alert("Please select an answer!");
        return;
    }

    switch (parseInt(selectedAnswer)) {
        case 1:
            addHouses(questions[questionIndex].answer1.houses);
            break;
        case 2:
            addHouses(questions[questionIndex].answer2.houses);
            break;
        case 3:
            addHouses(questions[questionIndex].answer3.houses);
    }

    questionIndex++;

    updateQuestions();
    setQuestionAnswers();

    if (questionIndex == questions.length - 1) {
        sortingNextQuestionBtn.classList.add("hidden");
        sortingEndBtn.classList.remove("hidden");
    }
});

/* Handling click on End Quiz button + calculate user result to get user's final house(s)
+ read in user house(s) description from txt + show user result */
$('#sorting-end-btn').click(function () {
    sortingContainer.classList.add("hidden");
    sortingResultsContainer.classList.remove("hidden");

    getFinalHouses();

    fetch('txt/houses.txt')
        .then((resp) => resp.text())
        .then(data => {
            var houses = data.split("***");
            for (var j = 0; j < houses.length; j++) {
                var houseName = houses[j].trim().split('\n')[0].split(' ')[1].trim();
                if (playerFinalHouses.includes(houseName.toLowerCase())) {
                    playerFinalHousesTxt.push(houses[j]);
                }
            }
            showFinalHouses();
        });
});

/* Handle click on house crest images arranged in circle to open modal with house description and user result + read in house description from txt
=> Source / Inspiration : https://www.w3schools.com/howto/howto_css_modal_images.asp */
$('.circle-list-item').click(function () {
    var id = this.id.split('_')[0];
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
            var houseCount = countPlayerHouses.find(h => h.house === id.split("-")[1]);
            var percent = parseFloat(((parseInt(houseCount.count) / questions.length) * 100)).toFixed(2);
            modalCaptionPercent.innerHTML = percent + "% (" + houseCount.count + " / " + questions.length + ")";
        });
});

/* Handle click on close icon to close house crest modal opened by clicking on house crest image from circle */
$('#close-modal-sorting').click(function () {
    modal.style.display = "none";
});

/* Handling click on Play Again button */
$('#sorting-playagain-btn').click(function () {
    location.reload();
});

/* Functions */

/* Load current quiz question in DOM elements */
function setQuestionAnswers() {
    sortingQuestion.innerHTML = questions[questionIndex].question;
    sortingAnswer1.innerHTML = questions[questionIndex].answer1.answer;
    sortingAnswer2.innerHTML = questions[questionIndex].answer2.answer;
    sortingAnswer3.innerHTML = questions[questionIndex].answer3.answer;
}

/* Clear answer checkboxes for new question */
function updateQuestions() {
    for (var i = 0; i < sortingCheckboxes.length; i++) {
        sortingCheckboxes[i].checked = false;
    }
}

/* Store houses associated to selected answer when clicking on Next Question */
function addHouses(houses) {
    var housesArray = houses.split(",");
    for (var i = 0; i < housesArray.length; i++) {
        playerHouses.push(housesArray[i]);
    }
}

/* Calculate user result to get/store user's final house(s) based on user selection / house key-value pairs  */
function getFinalHouses() {
    houseNames.forEach(countHouseInResults);
    var maxCount = 0;
    for (var i = 0; i < countPlayerHouses.length; i++) {
        if (countPlayerHouses[i].count > maxCount) {
            maxCount = countPlayerHouses[i].count;
        }
    }

    for (var j = 0; j < countPlayerHouses.length; j++) {
        if (countPlayerHouses[j].count == maxCount) {
            playerFinalHouses.push(countPlayerHouses[j].house);
        }
    }
}

/* Calculate user selection / house and store as key-value pairs */
function countHouseInResults(house) {
    var houseCount = {
        "house": house,
        "count": parseInt(countHouse(playerHouses, house))
    };
    countPlayerHouses.push(houseCount);
}

/* Update/Create and show DOM elements for final user houses + calculate user selection of houses in percentage */
function showFinalHouses() {
    if (playerFinalHouses.length > 1) {
        sortingResult.innerHTML = "YOU EQUALLY BELONG TO<br>HOUSES ";
    } else {
        sortingResult.innerHTML = "YOU BELONG TO<br>HOUSE ";
    }

    for (var i = 0; i < playerFinalHouses.length; i++) {
        sortingResult.innerHTML += playerFinalHouses[i].toUpperCase();
        if (i < playerFinalHouses.length - 1) {
            sortingResult.innerHTML += " & ";
        }

        var houseCount = countPlayerHouses.find(h => h.house === playerFinalHouses[i]);
        var percent = parseFloat(((parseInt(houseCount.count) / questions.length) * 100)).toFixed(2);

        if (i == 0) {
            sortingResultPercent.innerHTML = percent + "% (" + houseCount.count + " / " + questions.length + ")";
        }
        else {
            sortingResultPercent.innerHTML += percent + "% (" + houseCount.count + " / " + questions.length + ")";
        }
        if (i < playerFinalHouses.length - 1) {
            sortingResultPercent.innerHTML += " & ";
        }

        var houseImg = document.createElement("img");
        houseImg.id = playerFinalHouses[i] + "-finalresult";
        houseImg.classList.add("sorting-result-img");
        houseImg.src = "img/memorygame/house-" + playerFinalHouses[i] + ".png";
        sortingResultsImgs.appendChild(houseImg);

        var txtDiv = document.createElement("div");
        txtDiv.classList.add("center-container");
        sortingResultsTxt.appendChild(txtDiv);

        var txtDivCard = document.createElement("div");
        txtDivCard.classList.add("sorting-card");
        txtDivCard.classList.add("white-card");
        txtDivCard.innerHTML = playerFinalHousesTxt[i] + "<br>";
        txtDiv.appendChild(txtDivCard);
    }
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