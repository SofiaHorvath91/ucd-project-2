/* DOM elements */

var quizStarterDiv = document.getElementById("quiz-starter-div");
var quizContainer = document.getElementById("quiz-container");
var quizResultsContainer = document.getElementById("quiz-results-container");

var quizCheckboxes = document.getElementsByClassName("quiz-cb");
var quizAnswers = document.getElementsByClassName("answer-label");

var quizQuestion = document.getElementById("quiz-question");
var quizAnswer1 = document.getElementById("answer-label-1");
var quizAnswer2 = document.getElementById("answer-label-2");
var quizAnswer3 = document.getElementById("answer-label-3");
var quizAnswer4 = document.getElementById("answer-label-4");

var quizCheckAnswerBtn = document.getElementById("check-answer-btn");
var quizNextQuestionBtn = document.getElementById("next-question-btn");
var quizEndBtn = document.getElementById("end-quiz-btn");

var quizResult = document.getElementById("quiz-player-result");
var quizResultComment = document.getElementById("quiz-result-comment");
var quizQuestionsTotal = document.getElementById("quiz-questions-total");
var quizQuestionsCorrect = document.getElementById("quiz-questions-correct");
var quizQuestionsIncorrect = document.getElementById("quiz-questions-incorrect");

/* Variables */

let quizName;
let questions = [];
var questionIndex = 0;
var selectedAnswer;
var correctAnswers = 0;

/* jQuery */

/* Handle click on answer label (checking corresponding checkbox + store selected answer) */
$('.answer-label').click(function () {
    var id = $(this).attr('id');
    var cbId = "answer-" + id.split("-")[2];
    document.getElementById(cbId).checked = true;
    for (var i = 0; i < quizCheckboxes.length; i++) {
        if (quizCheckboxes[i].classList.contains(cbId)) {
            quizCheckboxes[i].checked = false;
        }
    }
    selectedAnswer = id.split("-")[2];
});

/* Handle click on answer checkbox (check it and uncheck all others + store selected answer) */
$('.quiz-cb').change(function () {
    var id = $(this).attr('id');
    for (var i = 0; i < quizCheckboxes.length; i++) {
        if (quizCheckboxes[i].id != id) {
            quizCheckboxes[i].checked = false;
        }
    }
    selectedAnswer = this.id.split("-")[1];
});

/* Handle click on Check Answer button 
(disable answer selection, color right answer & wrong answer if selected, show Next Question button) */
$('#check-answer-btn').click(function () {
    var isChecked = $('input:checkbox').is(':checked');
    if (!isChecked) {
        alert("Please select an answer!");
        return;
    }

    quizCheckAnswerBtn.classList.add("hidden");

    if (questionIndex < questions.length - 1) {
        quizNextQuestionBtn.classList.remove("hidden");
    }
    else {
        quizEndBtn.classList.remove("hidden");
    }

    $('.answer-label').off('click');
    for (var i = 0; i < quizCheckboxes.length; i++) {
        quizCheckboxes[i].disabled = true;
    }

    var selected = document.getElementById("answer-label-" + selectedAnswer);
    if (selectedAnswer == questions[questionIndex].correct) {
        selected.classList.add("correct-answer");
        correctAnswers++;
    }
    else {
        selected.classList.add("wrong-answer");
        document.getElementById("answer-label-" + questions[questionIndex].correct).classList.add("correct-answer");
    }
});

/* Handle click on Next Question button 
(store selection, enable answer selection, recolor answer labels, show next question, show Check Answer button) */
$('#next-question-btn').click(function () {
    questionIndex++;

    quizNextQuestionBtn.classList.add("hidden");
    quizCheckAnswerBtn.classList.remove("hidden");

    updateQuestions();
    setQuestionAnswers();
});

/* Handling click on End Quiz button + calculate/show user results */
$('#end-quiz-btn').click(function () {
    quizContainer.classList.add("hidden");
    quizResultsContainer.classList.remove("hidden");

    var resultPercentage = parseFloat(((correctAnswers / questions.length) * 100)).toFixed(2);
    quizResult.innerHTML = "YOUR RESULT :<br>" + resultPercentage + "%";

    if (resultPercentage >= 80) {
        quizResultComment.innerHTML = "Congratulations, what a result! You may really have a third eye to see and remember everything!";
    } else if (resultPercentage < 80 && resultPercentage >= 60) {
        quizResultComment.innerHTML = "Wow, you really know so much about the Word of Ice & Fire that you could be a Maester!";
    } else if (resultPercentage < 60 && resultPercentage >= 40) {
        quizResultComment.innerHTML = "Nice result, but can be even better - maybe it is time to revisit the World of Ice and Fire!";
    } else {
        quizResultComment.innerHTML = "Head's up, it will be better next time! Take your time to revisit the World of Ice and Fire and try again!";
    }

    quizQuestionsTotal.innerHTML = "TOTAL QUESTIONS : " + questions.length;
    quizQuestionsCorrect.innerHTML = "CORRECT : " + correctAnswers;
    quizQuestionsIncorrect.innerHTML = "INCORRECT : " + (questions.length - correctAnswers);
});

/* Handling click on Play Again button */
$('#quiz-playagain-btn').click(function () {
    quizContainer.classList.remove("hidden");
    quizResultsContainer.classList.add("hidden");

    quizEndBtn.classList.add("hidden");
    quizNextQuestionBtn.classList.add("hidden");
    quizCheckAnswerBtn.classList.remove("hidden");

    questions = [];
    questionIndex = 0;
    correctAnswers = 0;

    startQuiz(quizName);
    updateQuestions();
});

/* Handling click on Quizes button to go back to all quizes */
$('#quiz-othergame-btn').click(function () {
    location.reload();
});

/* Functions */

/* Handling quiz start (Show Player Layout + Read in questions from txt + Set first question) */
function startQuiz(name) {
    quizName = name;

    quizStarterDiv.classList.add("hidden");
    quizContainer.classList.remove("hidden");

    fetch('txt/' + quizName.toString() + '.txt')
        .then((resp) => resp.text())
        .then(data => {
            const questionsArray = data.split("***");
            for (var i = 0; i < questionsArray.length; i++) {
                var questionElements = questionsArray[i].split("-");
                var question = {
                    "question": questionElements[0].trim(),
                    "answer1": questionElements[1].trim(),
                    "answer2": questionElements[2].trim(),
                    "answer3": questionElements[3].trim(),
                    "answer4": questionElements[4].trim(),
                    "correct": questionElements[5].trim()
                };
                questions.push(question);
            }
            setQuestionAnswers();
        });
}

/* Load current quiz question in DOM elements */
function setQuestionAnswers() {
    quizQuestion.innerHTML = questions[questionIndex].question;
    quizAnswer1.innerHTML = questions[questionIndex].answer1;
    quizAnswer2.innerHTML = questions[questionIndex].answer2;
    quizAnswer3.innerHTML = questions[questionIndex].answer3;
    quizAnswer4.innerHTML = questions[questionIndex].answer4;
}

/* Recolor + clear/enable answer labels/checkboxes for new question */
function updateQuestions() {
    $('.answer-label').on('click');
    for (var i = 0; i < quizCheckboxes.length; i++) {
        quizCheckboxes[i].disabled = false;
        quizCheckboxes[i].checked = false;

        if (quizAnswers[i].classList.contains("correct-answer")) {
            quizAnswers[i].classList.remove("correct-answer");
        }
        if (quizAnswers[i].classList.contains("wrong-answer")) {
            quizAnswers[i].classList.remove("wrong-answer");
        }
    }
}