"use strict";
const startQuize = document.getElementById("startQuiz");
let score = 0;

let currentDisplay = "startcard"; // to keep track of currect displayed section

startQuize.addEventListener("click", () => {
    document.getElementById("startcard").style.display = "none";
    document.getElementById("question").style.display = "block";
    currentDisplay = "question";
    index = 0;
    score = 0;
    renderQuestion(0);
    startTimer();
    checkAnswer();
});

function renderQuestion(index) {
    const questionBox = document.getElementById("questionbox");
    questionBox.innerHTML = `<h1>${questions[index].questionText}</h1>`;
    questionBox.innerHTML += "<ul></ul>";
    const optionList = document.querySelector("#questionbox ul");
    let options = questions[index].options;

    for (const i of options) {
        let li = document.createElement("li");
        li.innerText = i;
        li.className = "options";
        optionList.appendChild(li);
    }
}

let intervalId;
function startTimer() {
    document.getElementById("time").innerText = 50;
    intervalId = setInterval(countdown, 1000);
}
function countdown() {
    let time = document.getElementById("time");
    time.innerText -= 1;

    if (time.innerText <= "0") {
        // start timer also handl if time out because of Incorrect answer
        clearInterval(intervalId);
        document.getElementById("question").style.display = "none";
        document.getElementById("alldone").style.display = "block";
        currentDisplay = "alldone";
        score = document.getElementById("time").innerText;
        if (score < 0) {
            document.getElementById("time").innerText = 0;
            score = 0;
        }
        showScore(score);
    }
    if (!intervalId) return;
}
let index = 0;

function checkAnswer() {
    let answer = "";
    let options = document.querySelectorAll(".options");

    for (let i = 0; i < options.length; i++) {
        options[i].addEventListener("click", () => {
            answer = options[i].innerText;

            if (answer === questions[index].answer) {
                document.getElementById("output").innerText = "Correct!";
            } else {
                document.getElementById("output").innerText = "Incorrect!";
                document.getElementById("time").innerText -= 10;
            }

            let displayAnswer = document.getElementsByClassName("outputbox");
            displayAnswer[0].style.display = "block";
            displayAnswer[1].style.display = "block";

            setTimeout(() => {
                displayAnswer[0].style.display = "none";
                displayAnswer[1].style.display = "none";
            }, 1000);

            index++;
            // stops at last question and goes to Alldone section
            if (index == questions.length) {
                setTimeout(() => {
                    document.getElementById("question").style.display = "none";
                    document.getElementById("alldone").style.display = "block";
                    currentDisplay = "alldone";
                    clearInterval(intervalId);
                    score = document.getElementById("time").innerText;
                    console.log(score);
                    showScore(+score + 1);
                    return;
                }, 1000);
            }

            if (index != questions.length) renderQuestion(index);
            checkAnswer(); // call itself to check next question
        });
    }
}

// shows score on alldone section
function showScore(score) {
    let outScore = document.getElementById("score");
    outScore.innerText = score;

    let sumbmitScore = document.querySelector("#alldone button");
    let input = document.querySelector("#alldone input");
    input.focus();
    sumbmitScore.addEventListener("click", () => {
        inputValidation();
    });
    input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            inputValidation();
        }
    });
}

function highScore() {
    document.getElementById(currentDisplay).style.display = "none";
    document.getElementById("highscore").style.display = "block";

    const displayScore = document.querySelector("#highscore ul");
    displayScore.innerHTML = "";
    let scoreArray = [];
    for (let i = 0; i < localStorage.length; i++) {
        let check = "user_";
        let key = localStorage.key(i);
        if (check === localStorage.key(i).slice(0, 5)) {
            scoreArray.push([
                localStorage.key(i).slice(5),
                localStorage.getItem(key),
            ]);
        }
    }
    console.log(scoreArray);
    scoreArray.sort((a, b) => {
        return a[1] > b[1] ? -1 : 1;
    });
    for (let i = 0; i < scoreArray.length; i++) {
        displayScore.innerHTML += `<li>${i + 1}. ${scoreArray[i][0]} - ${
            scoreArray[i][1]
        }`;
    }

    const clearScore = document.querySelector("#highscore #clear");
    clearScore.addEventListener("click", () => {
        localStorage.clear();
        displayScore.innerHTML = "";
    });

    const back = document.querySelector("#back");
    back.addEventListener("click", () => {
        if (currentDisplay === "highscore") {
            document.getElementById("startcard").style.display = "block";
            document.getElementById("highscore").style.display = "none";
            currentDisplay = "startcard";
        } else {
            document.getElementById(currentDisplay).style.display = "block";
            document.getElementById("highscore").style.display = "none";
        }
    });
}

document
    .getElementById("leaderboard")
    .addEventListener("click", () => highScore());

function inputValidation() {
    let input = document.querySelector("#alldone input");
    let warnMsg = document.getElementById("warnMsg");
    let inputCheck = input.value;
    if (input.value === "") {
        console.log(inputCheck);
        warnMsg.innerText = "cannot be empty";
        warnMsg.style.display = "block";
        input.focus();
        return;
    } else if (inputCheck[0] >= "0" && inputCheck[0] <= "9") {
        warnMsg.style.display = "block";
        warnMsg.innerText = "cannot start with digits";
        input.value = "";
        input.focus();
        return;
    } else if (inputCheck.length > 20) {
        warnMsg.style.display = "block";
        warnMsg.innerText = "should be less than 20 character";
        input.value = "";
        input.focus();
        return;
    } else {
        for (let i = 0; i < inputCheck.length; i++) {
            if (
                (inputCheck[i] >= "@" && inputCheck[i] <= "Z") ||
                (inputCheck[i] >= "a" && inputCheck[i] <= "z") ||
                (inputCheck[i] >= "0" && inputCheck[i] <= "9") ||
                inputCheck[i] == "_"
            ) {
                continue;
            } else {
                warnMsg.style.display = "block";
                warnMsg.innerText =
                    "characters can be A to Z, a to z, 0 to 9 or _";
                input.value = "";
                input.focus();
                return;
            }
        }
    }
    localStorage.setItem(`user_${inputCheck}`, score);

    input.value = "";
    warnMsg.style.display = "none";

    highScore();
    currentDisplay = "highscore";
}
