document.addEventListener('DOMContentLoaded', function() {
    const accessForm = document.getElementById('accessForm');
    if (accessForm) {
        accessForm.addEventListener('submit', checkAccess);
    } else {
        console.error('Zugriffsformular nicht gefunden');
    }
});

function checkAccess(event) {
    event.preventDefault();
    const accessCode = document.getElementById('accessCode');
    if (accessCode) {
        const code = accessCode.value;
        if (code === "1234") {
            sessionStorage.setItem('hasAccess', 'true');
            window.location.href = 'html/uebersicht.html';
        } else {
            alert('Ungültiger Zugangscode.');
        }
    } else {
        console.error('Eingabefeld für Zugangscode nicht gefunden');
    }
}