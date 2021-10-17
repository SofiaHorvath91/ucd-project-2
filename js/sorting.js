var sortingContainer = document.getElementById("sorting-container");
var sortingResultsContainer = document.getElementById("sorting-results-container");

var sortingCheckboxes = document.getElementsByClassName("quiz-cb");

var sortingQuestion = document.getElementById("sorting-question");
var sortingAnswer1 = document.getElementById("sorting-answer-label-1");
var sortingAnswer2 = document.getElementById("sorting-answer-label-2");
var sortingAnswer3 = document.getElementById("sorting-answer-label-3");
var sortingNextQuestionBtn = document.getElementById("sorting-next-btn");
var sortingEndBtn = document.getElementById("sorting-end-btn");

var sortingResultsImgs = document.getElementById("final-houses");
var sortingResultsTxt = document.getElementById("final-houses-txt");
var sortingResult = document.getElementById("sorting-player-result");
var sortingResultPercent = document.getElementById("sorting-result-percentage");

var circleItems = document.getElementsByClassName("circle-list-item");
var modal = document.getElementById("circle-img-modal-sorting");
var modalImg = document.getElementById("modal-img-sorting");
var modalCaption = document.getElementById("modal-caption-sorting");
var modalCaptionPercent = document.getElementById("caption-percentage-sorting");

let questions = [];
var questionIndex = 0;
var selectedAnswer;
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

$('.quiz-cb').change(function () {
    var id = $(this).attr('id');
    for (var i = 0; i < sortingCheckboxes.length; i++) {
        if (sortingCheckboxes[i].id != id) {
            sortingCheckboxes[i].checked = false;
        }
    }
    selectedAnswer = this.id.split("-")[2];
});

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
            let houseCount = countPlayerHouses.find(h => h.house === id.split("-")[1]);
            var percent = parseFloat(((parseInt(houseCount.count) / questions.length) * 100)).toFixed(2);
            modalCaptionPercent.innerHTML = percent + "% (" + houseCount.count + " / " + questions.length + ")";
        });
});

$('#close-modal-sorting').click(function () {
    modal.style.display = "none";
});

$('#sorting-playagain-btn').click(function () {
    location.reload();
});

function setQuestionAnswers() {
    sortingQuestion.innerHTML = questions[questionIndex].question;
    sortingAnswer1.innerHTML = questions[questionIndex].answer1.answer;
    sortingAnswer2.innerHTML = questions[questionIndex].answer2.answer;
    sortingAnswer3.innerHTML = questions[questionIndex].answer3.answer;
}

function updateQuestions() {
    for (var i = 0; i < sortingCheckboxes.length; i++) {
        sortingCheckboxes[i].checked = false;
    }
}

function addHouses(houses) {
    var housesArray = houses.split(",");
    for (var i = 0; i < housesArray.length; i++) {
        playerHouses.push(housesArray[i]);
    }
}

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

function countHouseInResults(house) {
    var houseCount = {
        "house": house,
        "count": parseInt(countHouse(playerHouses, house))
    };
    countPlayerHouses.push(houseCount);
}

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

        let houseCount = countPlayerHouses.find(h => h.house === playerFinalHouses[i]);
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

function createCircle(listItems) {
    for (var i = 0; i < listItems.length; i++) {
        var offsetAngle = 360 / listItems.length;
        var rotateAngle = offsetAngle * i;
        $(listItems[i]).css("transform", "rotate(" + rotateAngle + "deg) translate(0, -120px) rotate(-" + rotateAngle + "deg)");
    }
}