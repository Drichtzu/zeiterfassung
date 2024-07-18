document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', showLoginPrompt);
    } else {
        console.error('Login-Button nicht gefunden');
    }
});

function showLoginPrompt() {
    const userInput = prompt("Bitte geben Sie das Admin-Passwort ein:");

    if (userInput !== null) {
        fetch('http://192.168.177.159/api/admin-login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: userInput })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                sessionStorage.setItem('isAdmin', 'true');
                window.location.href = 'html/admin.html';
            } else {
                alert("Falsches Passwort. Zugriff verweigert.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        });
    }
}
