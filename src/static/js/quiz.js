const categories = ["uppercase", "lowercase", "handwritten", "transcription", "pronunciation"];
const learningCategories = ["uppercase", "lowercase", "handwritten"];
const explainingCategories = ["transcription", "pronunciation", "handwritten"];

async function getQuestion() {
    const alphabet = await fetchAlphabet();
    let {questionCategory, answerCategory} = getSelectedCategories(categories);

    let question = randomSelectFrom(alphabet[questionCategory]);
    let correctIndex = alphabet[questionCategory].indexOf(question);
    let answer = {};
    for (let category of categories)
        answer[category] = alphabet[category][correctIndex];
    let choices = randomSampleIncluding(alphabet[answerCategory], 4, answer[answerCategory]);

    displayQuestion(question, choices, answerCategory, answer);
}

function randomSelectFrom(array, excluding = []) {
    let filteredArray = array.filter(element => !excluding.includes(element));
    return filteredArray[Math.floor(Math.random() * filteredArray.length)];
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// returns a random sample of the array with the specified sample size including the specified element
function randomSampleIncluding(array, sampleSize, element) {
    shuffle(array);
    let sample = array.slice(0, sampleSize);
    if (!sample.includes(element))
        sample[Math.floor(Math.random() * sampleSize)] = element;
    return sample;
}

function SelectSecondCategoryRandom(firstCategory, excluding = []) {
    let otherCategory = learningCategories.includes(firstCategory) ? explainingCategories : learningCategories;
    return randomSelectFrom(otherCategory, excluding);
}

// When one of the selected categories is a learning category, the other should be an explaining category
// the selected category should be random if the selected category is not in the list of categories
function getSelectedCategories(categories) {
    let questionCategory = document.querySelector(`input[name="questionCategory"]:checked`).value;
    let answerCategory = document.querySelector(`input[name="answerCategory"]:checked`).value;

    if (questionCategory === "random" && answerCategory === "random") {
        questionCategory = randomSelectFrom(categories);
    }
    if (answerCategory === "random") {
        answerCategory = SelectSecondCategoryRandom(questionCategory, ["pronunciation", questionCategory]);
    } else if (questionCategory === "random") {
        questionCategory = SelectSecondCategoryRandom(answerCategory, [answerCategory]);
    }

    return {questionCategory, answerCategory};
}

function displayQuestion(question, choices, answerCategory, answer) {
    const questionElement = document.getElementById("question");
    const choicesElement = document.getElementById("choices");
    const feedbackElement = document.getElementById("feedback");
    choicesElement.innerHTML = "";
    feedbackElement.textContent = ""; // Clear feedback
    addToElement(question, questionElement);

    choices.forEach((choice) => {
        let element;
        element = document.createElement("button");
        addToElement(choice, element);
        element.className = "btn btn-primary btn-block mb-2";
        element.onclick = () =>
            onAnswerClick(choice, answerCategory, answer);
        choicesElement.appendChild(element);
    });
}

function onAnswerClick(choice, answerCategory, answer) {
    const feedbackElement = document.getElementById("feedback");
    const choicesElement = document.getElementById("choices");
    if (choice === answer[answerCategory]) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.className = "text-success";
        setTimeout(getQuestion, 600); // Fetch new question after 1.5 seconds
    } else {
        feedbackElement.textContent = "Incorrect!";
        feedbackElement.className = "text-danger";
        choicesElement.innerHTML = ""; // Remove answer buttons
        displayAnswerCard(answer);
    }
}

function displayAnswerCard(answer) {
    $('#infoCard').show();
    for (let category in answer) {
        const detailsCard = document.getElementById(category);
        addToElement(answer[category], detailsCard);
    }
}

async function closeCard() {
    $('#infoCard').hide();
    await getQuestion();
}
