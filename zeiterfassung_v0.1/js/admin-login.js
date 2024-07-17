document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener('click', showLoginPrompt);
});

function showLoginPrompt() {
    const correctPassword = "1";
    const userInput = prompt("Bitte geben Sie das Admin-Passwort ein:");

    if (userInput === correctPassword) {
        localStorage.setItem('isAdmin', JSON.stringify(true)); // Setze den Admin-Status
        window.location.href = 'html/admin.html';
    } else if (userInput !== null) {
        alert("Falsches Passwort. Zugriff verweigert.");
    }
}