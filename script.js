let actionHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    loadGames();
    calculateScore();
});

function calculateScore() {
    // Get values from the input fields
    let as = parseInt(document.getElementById('as').value) || 0;
    let deux = parseInt(document.getElementById('deux').value) || 0;
    let trois = parseInt(document.getElementById('trois').value) || 0;
    let quatre = parseInt(document.getElementById('quatre').value) || 0;
    let cinq = parseInt(document.getElementById('cinq').value) || 0;
    let six = parseInt(document.getElementById('six').value) || 0;

    // Calculate section supérieure total
    let totalSup = as + deux + trois + quatre + cinq + six;
    document.getElementById('totalSup').innerText = totalSup;

    // Calculate bonus
    let bonus = totalSup >= 63 ? 35 : 0;
    document.getElementById('bonus').innerText = bonus;

    // Calculate total with bonus
    let totalAvecBonus = totalSup + bonus;
    document.getElementById('totalAvecBonus').innerText = totalAvecBonus;

    // Get values from the input fields for section inférieure
    let paire = parseInt(document.getElementById('paire-score').innerText) || 0;
    let doublePaire = parseInt(document.getElementById('doublePaire-score').innerText) || 0;
    let brelan = parseInt(document.getElementById('brelan-score').innerText) || 0;
    let petiteSuite = parseInt(document.getElementById('petiteSuite-score').innerText) || 0;
    let grandeSuite = parseInt(document.getElementById('grandeSuite-score').innerText) || 0;
    let full = parseInt(document.getElementById('full-score').innerText) || 0;
    let carre = parseInt(document.getElementById('carre-score').innerText) || 0;
    let yams = parseInt(document.getElementById('yams-score').innerText) || 0;
    let chance = parseInt(document.getElementById('chance').value) || 0;

    // Calculate section inférieure total
    let totalInf = paire + doublePaire + brelan + petiteSuite + grandeSuite + full + carre + yams + chance;
    document.getElementById('totalInf').innerText = totalInf;

    // Calculate total general
    let totalGeneral = totalAvecBonus + totalInf;
    document.getElementById('totalGeneral').innerText = totalGeneral;

    highlightTotals();
}

function createNewGame() {
    resetScores();
    saveGame();
}

function confirmResetScores() {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser les scores ?")) {
        resetScores();
    }
}

function resetScores() {
    let inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => input.value = '');

    let specialScores = document.querySelectorAll('.special-score');
    specialScores.forEach(score => score.innerText = '');

    actionHistory = [];
    calculateScore();
}

function saveGame() {
    let gameData = {
        as: document.getElementById('as').value || 0,
        deux: document.getElementById('deux').value || 0,
        trois: document.getElementById('trois').value || 0,
        quatre: document.getElementById('quatre').value || 0,
        cinq: document.getElementById('cinq').value || 0,
        six: document.getElementById('six').value || 0,
        paire: document.getElementById('paire-score').innerText,
        doublePaire: document.getElementById('doublePaire-score').innerText,
        brelan: document.getElementById('brelan-score').innerText,
        petiteSuite: document.getElementById('petiteSuite-score').innerText,
        grandeSuite: document.getElementById('grandeSuite-score').innerText,
        full: document.getElementById('full-score').innerText,
        carre: document.getElementById('carre-score').innerText,
        yams: document.getElementById('yams-score').innerText,
        chance: document.getElementById('chance').value || 0
    };

    let games = JSON.parse(localStorage.getItem('yamGames')) || [];
    games.push(gameData);
    localStorage.setItem('yamGames', JSON.stringify(games));
    loadGames();
}

function loadGames() {
    let games = JSON.parse(localStorage.getItem('yamGames')) || [];
    let gamesList = document.getElementById('gamesList');
    gamesList.innerHTML = '';

    games.forEach((game, index) => {
        let gameItem = document.createElement('div');
        gameItem.classList.add('gameItem');
        gameItem.innerHTML = `Partie ${index + 1} <button onclick="loadGame(${index})">Charger</button> <button onclick="deleteGame(${index})">Supprimer</button>`;
        gamesList.appendChild(gameItem);
    });
}

function loadGame(index) {
    let games = JSON.parse(localStorage.getItem('yamGames')) || [];
    let game = games[index];

    document.getElementById('as').value = game.as;
    document.getElementById('deux').value = game.deux;
    document.getElementById('trois').value = game.trois;
    document.getElementById('quatre').value = game.quatre;
    document.getElementById('cinq').value = game.cinq;
    document.getElementById('six').value = game.six;
    document.getElementById('paire-score').innerText = game.paire;
    document.getElementById('doublePaire-score').innerText = game.doublePaire;
    document.getElementById('brelan-score').innerText = game.brelan;
    document.getElementById('petiteSuite-score').innerText = game.petiteSuite;
    document.getElementById('grandeSuite-score').innerText = game.grandeSuite;
    document.getElementById('full-score').innerText = game.full;
    document.getElementById('carre-score').innerText = game.carre;
    document.getElementById('yams-score').innerText = game.yams;
    document.getElementById('chance').value = game.chance;

    calculateScore();
}

function deleteGame(index) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette partie ?")) {
        let games = JSON.parse(localStorage.getItem('yamGames')) || [];
        games.splice(index, 1);
        localStorage.setItem('yamGames', JSON.stringify(games));
        loadGames();
    }
}

function updateSpecialScore(id, score) {
    actionHistory.push({
        id: id,
        previousScore: document.getElementById(id + '-score').innerText
    });
    
    let scoreElement = document.getElementById(id + '-score');
    scoreElement.innerText = score;
    scoreElement.style.color = score === 0 ? 'red' : 'black';
    scoreElement.style.textDecoration = score === 0 ? 'line-through' : 'none';

    highlightElement(scoreElement);

    calculateScore();
}

function undoAction() {
    if (actionHistory.length > 0) {
        let lastAction = actionHistory.pop();
        let scoreElement = document.getElementById(lastAction.id + '-score');
        scoreElement.innerText = lastAction.previousScore;
        scoreElement.style.color = lastAction.previousScore === "0" ? 'red' : 'black';
        scoreElement.style.textDecoration = lastAction.previousScore === "0" ? 'line-through' : 'none';

        highlightElement(scoreElement);

        calculateScore();
    } else {
        alert("Aucune action à annuler.");
    }
}

function highlightElement(element) {
    element.classList.add('highlight');
    setTimeout(() => {
        element.classList.remove('highlight');
    }, 500);
}

function highlightTotals() {
    const totals = ['totalGeneral', 'totalAvecBonus', 'totalSup', 'totalInf', 'bonus'];
    totals.forEach(id => {
        const element = document.getElementById(id);
        highlightElement(element);
    });
}
