async function displayAlphabet() {
    const alphabet = await fetchAlphabet();
    let selectedCategory = "lowercase"
    alphabet[selectedCategory].forEach(function (letter, i) {
        const button = document.getElementById(`letter${i}`);
        // button.setAttribute("data-bs-title", letter);
        addToElement(letter, button);
    });
}

async function showDetailsCard(i) {
    const alphabet = await fetchAlphabet();
    for (let category in alphabet) {
        const detailsCard = document.getElementById(category);
        addToElement(alphabet[category][i], detailsCard);
    }
    document.getElementById('details-card').style.display = 'block';
}

function closeDetailsCard() {
    document.getElementById('details-card').style.display = 'none';
}
