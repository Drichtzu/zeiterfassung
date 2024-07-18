document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM geladen');
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        console.log('Login-Button gefunden');
        loginButton.addEventListener('click', showLoginPrompt);
    } else {
        console.error('Login-Button nicht gefunden');
    }
});

function showLoginPrompt() {
    console.log('Login-Prompt angezeigt');
    const userInput = prompt("Bitte geben Sie das Admin-Passwort ein:");

    if (userInput !== null) {
        console.log('Passwort eingegeben, sende Anfrage');
        fetch('/zeiterfassung/api/admin-login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: userInput })
        })
        .then(response => {
            console.log('Antwort erhalten:', response.status);
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Daten verarbeitet:', data);
            if (data.success) {
                console.log('Login erfolgreich, leite weiter');
                sessionStorage.setItem('isAdmin', 'true');
                window.location.href = '/zeiterfassung/html/admin.html';
            } else {
                console.log('Login fehlgeschlagen');
                alert("Falsches Passwort. Zugriff verweigert.");
            }
        })
        .catch(error => {
            console.error('Fehler:', error);
            alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        });
    }
}
