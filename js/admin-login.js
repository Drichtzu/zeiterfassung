document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', showLoginPrompt);
    } else {
        console.error('Login-Button nicht gefunden');
    }
});

function showLoginPrompt() {
    const correctPassword = "1";
    const userInput = prompt("Bitte geben Sie das Admin-Passwort ein:");

    if (userInput === correctPassword) {
        sessionStorage.setItem('isAdmin', 'true');
        window.location.href = 'html/admin.html';
    } else if (userInput !== null) {
        alert("Falsches Passwort. Zugriff verweigert.");
    }
}