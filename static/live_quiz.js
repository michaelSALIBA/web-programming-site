let total = 0; // how many questions (from the server)
const cache = {}; // cache[i] = a fetched question object

async function getQuestion(index) {

    // 1. If this question is already in cache, return the cached copy
    if (cache[index]) {
        return cache[index];
    }

    // 2. Fetch the question from the server
    const response = await fetch(`/api/question/${index}`);

    // 3. Check if the request was successful
    if (!response.ok) {
        throw new Error("Failed to fetch question");
    }

    // 4. Read the JSON, store it in the cache, and return it
    const question = await response.json();
    cache[index] = question;

    return question;
}


let currentQuestion = 0;
const userAnswers = [];


function saveAnswer(choiceIndex) {
    userAnswers[currentQuestion] = choiceIndex;
}


function goNext() {
    if (currentQuestion < total - 1) {
        currentQuestion++;
        renderQuestion();
    }
}


function goPrevious() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}


function goFirst() {
    currentQuestion = 0;
    renderQuestion();
}


function goLast() {
    currentQuestion = total - 1;
    renderQuestion();
}


async function calculateScore() {
    let score = 0;

    for (let i = 0; i < total; i++) {
        const q = await getQuestion(i);

        if (userAnswers[i] === q.answer) {
            score++;
        }
    }

    return score;
}


function calculatePercentage(score) {
    const percentageScore = (score / total) * 100;
    return Math.round(percentageScore);
}


function getPerformanceMessage(percentage) {
    if (percentage >= 80) {
        return "Excellent";
    } else if (percentage >= 60) {
        return "Good";
    } else if (percentage >= 50) {
        return "Pass";
    } else {
        return "Needs improvement";
    }
}


async function buildCorrection() {
    let correction = "";

    for (let i = 0; i < total; i++) {
        const q = await getQuestion(i);
        const userAnswerIndex = userAnswers[i];

        let userAnswerText = "Not answered";

        if (userAnswerIndex !== undefined && userAnswerIndex !== null) {
            userAnswerText = q.choices[userAnswerIndex];
        }

        const correctAnswerText = q.choices[q.answer];
        const isCorrect = userAnswerIndex === q.answer;
        const resultText = isCorrect ? "Correct" : "Incorrect";

        correction += `Question ${i + 1}: ${q.question}\n`;
        correction += `Your answer: ${userAnswerText}\n`;
        correction += `Correct answer: ${correctAnswerText}\n`;
        correction += `Result: ${resultText}\n`;
        correction += `Explanation: ${q.explanation}\n\n`;
    }

    return correction;
}


async function submitQuiz() {
    const score = await calculateScore();
    const percentage = calculatePercentage(score);
    const message = getPerformanceMessage(percentage);
    const correction = await buildCorrection();

    showResults(score, percentage, message, correction);
}

async function renderQuestion() {
    const loading = document.getElementById("loading");
    const error = document.getElementById("error");

    // Show loading
    loading.style.display = "block";

    // Hide error
    error.style.display = "none";
    error.textContent = "";

    try {
        // Fetch the question
        const q = await getQuestion(currentQuestion);

        // Display question progress
        document.getElementById("progress").textContent =
            `Question ${currentQuestion + 1} of ${total}`;

        // Display question
        document.getElementById("questionText").textContent = q.question;

        // Display choices
        const choicesContainer = document.getElementById("choices");
        choicesContainer.innerHTML = "";

        q.choices.forEach((choice, index) => {
            const label = document.createElement("label");
            const radio = document.createElement("input");

            radio.type = "radio";
            radio.name = "answer";
            radio.value = index;
            radio.checked = userAnswers[currentQuestion] === index;

            radio.addEventListener("change", function () {
                saveAnswer(index);
            });

            label.appendChild(radio);
            label.appendChild(document.createTextNode(choice));
            choicesContainer.appendChild(label);
        });

        // Update navigation buttons
        document.getElementById("firstBtn").disabled =
            currentQuestion === 0;

        document.getElementById("previousBtn").disabled =
            currentQuestion === 0;

        document.getElementById("nextBtn").disabled =
            currentQuestion === total - 1;

        document.getElementById("lastBtn").disabled =
            currentQuestion === total - 1;

        // Hide loading AFTER question is displayed
        loading.style.display = "none";

    } catch (err) {
        // Hide loading
        loading.style.display = "none";

        // Show error
        error.textContent = "Failed to load question: " + err.message;
        error.style.display = "block";
    }
}



function showResults(score, percentage, message, correction) {

    document.getElementById("quizPanel").style.display = "none";
    document.getElementById("resultsPanel").style.display = "block";

    document.getElementById("scoreText").textContent =
        `Score: ${score} / ${total}`;

    document.getElementById("percentageText").textContent =
        `Percentage: ${percentage}%`;

    document.getElementById("performanceText").textContent = message;

    document.getElementById("correction").textContent = correction;
}


async function init() {

    try {

        // 1. Fetch the total number of questions
        const response = await fetch("/api/questions/count");

        // 2. Check if the request was successful
        if (!response.ok) {
            throw new Error("Failed to fetch question count");
        }

        // 3. Read the JSON response and store the count
        const data = await response.json();
        total = data.count;

        // 4. Display the first question
        await renderQuestion();

    } catch (err) {

        const error = document.getElementById("error");

        error.textContent =
            "Failed to initialize quiz: " + err.message;

        error.hidden = false;

        // Also hide loading if initialization fails
        const loading = document.getElementById("loading");

        if (loading) {
            loading.hidden = true;
        }

        console.error(err);
    }
}


// Start the quiz
init();