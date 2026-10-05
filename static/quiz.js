const questions = [
    {
        question: "Which engineering major focuses mainly on designing and constructing buildings, bridges, and roads?",
        choices: [
            "Mechanical Engineering",
            "Civil Engineering",
            "Computer Engineering",
            "Chemical Engineering"
        ],
        answer: 1, // Corrected index (0-based)
        explanation: "Civil engineering focuses on the design and construction of infrastructure such as buildings, bridges, roads, and other structures."
    },
    {
        question: "Which engineering major is most related to engines, machines, and mechanical systems?",
        choices: [
            "Mechanical Engineering",
            "Civil Engineering",
            "Electrical Engineering",
            "Environmental Engineering"
        ],
        answer: 0, // Corrected index
        explanation: "Mechanical engineering focuses on machines, engines, mechanical systems, motion, and energy."
    },
    {
        question: "Which engineering major focuses on electrical circuits, power systems, and electronics?",
        choices: [
            "Chemical Engineering",
            "Civil Engineering",
            "Electrical Engineering",
            "Industrial Engineering"
        ],
        answer: 2, // Corrected index
        explanation: "Electrical engineering deals with electricity, electrical circuits, electronics, power systems, and electrical devices."
    },
    {
        question: "Which engineering major focuses on programming, computer hardware, and computer systems?",
        choices: [
            "Computer Engineering",
            "Civil Engineering",
            "Chemical Engineering",
            "Biomedical Engineering"
        ],
        answer: 0, // Corrected index
        explanation: "Computer engineering combines computer hardware and software, including processors, computer systems, and programming."
    },
    {
        question: "Which engineering major focuses on designing processes for producing chemicals, fuels, and materials?",
        choices: [
            "Aerospace Engineering",
            "Chemical Engineering",
            "Mechanical Engineering",
            "Software Engineering"
        ],
        answer: 1, // Corrected index
        explanation: "Chemical engineering applies chemistry, physics, and mathematics to industrial processes involving chemicals, fuels, materials, and other products."
    },
    {
        question: "Which engineering major is primarily concerned with aircraft, spacecraft, and flight systems?",
        choices: [
            "Civil Engineering",
            "Aerospace Engineering",
            "Environmental Engineering",
            "Industrial Engineering"
        ],
        answer: 1, // Corrected index
        explanation: "Aerospace engineering focuses on the design, development, testing, and operation of aircraft and spacecraft."
    },
    {
        question: "Which engineering major combines mechanical, electrical, and computer technologies to develop robots and automated systems?",
        choices: [
            "Mechatronics Engineering",
            "Civil Engineering",
            "Chemical Engineering",
            "Structural Engineering"
        ],
        answer: 0, // Corrected index
        explanation: "Mechatronics engineering combines mechanical, electrical, electronics, and computer engineering to create automated systems and robots."
    },
    {
        question: "Which engineering major focuses on protecting the environment, pollution control, and waste management?",
        choices: [
            "Mechanical Engineering",
            "Environmental Engineering",
            "Computer Engineering",
            "Aerospace Engineering"
        ],
        answer: 1, // Corrected index
        explanation: "Environmental engineering addresses pollution control, waste management, water quality, and other environmental challenges."
    },
    {
        question: "Which engineering major applies engineering principles to medical equipment, prosthetics, and healthcare technology?",
        choices: [
            "Biomedical Engineering",
            "Civil Engineering",
            "Electrical Engineering",
            "Industrial Engineering"
        ],
        answer: 0, // Corrected index
        explanation: "Biomedical engineering applies engineering principles to healthcare, including medical devices, prosthetics, diagnostic equipment, and other technologies."
    },
    {
        question: "Which engineering major focuses on improving manufacturing processes, productivity, and efficiency?",
        choices: [
            "Aerospace Engineering",
            "Industrial Engineering",
            "Chemical Engineering",
            "Biomedical Engineering"
        ],
        answer: 1, // Corrected index
        explanation: "Industrial engineering focuses on improving systems, manufacturing processes, productivity, efficiency, and the use of resources."
    }
];

let currentQuestion = 0;
const userAnswers = new Array(questions.length);

function saveAnswer(choiceIndex) {
  userAnswers[currentQuestion] = choiceIndex;
}

function goNext() {
  if (currentQuestion < questions.length - 1) {
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
  currentQuestion = questions.length - 1;
  renderQuestion();
}

function calculateScore() {
  let score = 0;
  let i = 0;
  while (i < questions.length) {
    if (userAnswers[i] === questions[i].answer) {
      score++;
    }
    i++;
  }
  return score;
}

function calculatePercentage(score) {
  const percentageScore = (score / questions.length) * 100;
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

function buildCorrection() {
  let correction = "";

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
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

function submitQuiz() {
  const score = calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = buildCorrection();
  showResults(score, percentage, message, correction);
}

function renderQuestion() {
  const q = questions[currentQuestion];

  document.getElementById("progress").textContent = `Question ${currentQuestion + 1} of ${questions.length}`;

  document.getElementById("questionText").textContent = q.question;

  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  for (let i = 0; i < q.choices.length; i++) {
    const label = document.createElement("label");
    label.className = "choice";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = i;

    if (userAnswers[currentQuestion] === i) {
      radio.checked = true;
    }

    radio.onclick = function () {
      saveAnswer(i);
    };
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + q.choices[i]));
    choicesContainer.appendChild(label);
  }

  document.getElementById("firstBtn").disabled = currentQuestion === 0;
  document.getElementById("previousBtn").disabled = currentQuestion === 0;
  document.getElementById("nextBtn").disabled = currentQuestion === questions.length - 1;
  document.getElementById("lastBtn").disabled = currentQuestion === questions.length - 1;
}

function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent = `Score: ${score} / ${questions.length}`;
  document.getElementById("percentageText").textContent = `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

// Ensure DOM elements are fully loaded before rendering
document.addEventListener("DOMContentLoaded", renderQuestion);