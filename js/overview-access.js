document.addEventListener('DOMContentLoaded', function() {
    const accessForm = document.getElementById('accessForm');
    accessForm.addEventListener('submit', checkAccess);
});

function checkAccess(event) {
    event.preventDefault();
    const accessCode = document.getElementById('accessCode').value;

    if (accessCode === "1234") {
        sessionStorage.setItem('hasAccess', 'true');
        window.location.href = 'html/uebersicht.html';
    } else {
        alert('Ungültiger Zugangscode.');
    }
}