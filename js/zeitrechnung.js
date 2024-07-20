// Logging-Funktion
function log(message, type = 'info') {
    const types = {
        info: 'color: blue',
        warn: 'color: orange',
        error: 'color: red'
    };
    console.log(`%c[Zeitrechnung] ${message}`, types[type]);
}

document.addEventListener('DOMContentLoaded', function() {
    log('DOM vollständig geladen');

    // Anpassen der Selektoren an die vorhandene HTML-Struktur
    const loginForm = document.querySelector('form');
    const timeForm = document.getElementById('timeForm');
    const employeeLogin = document.querySelector('.container');
    const timeTracking = document.getElementById('timeTracking');
    const employeeName = document.getElementById('employeeName');
    const startTimeBtn = document.getElementById('startTime');
    const endTimeBtn = document.getElementById('endTime');
    const employeeNumberInput = document.getElementById('employeeNumber');
    const pauseDurationInput = document.getElementById('pauseDuration');

    // Überprüfen und Loggen der Elemente
    if (!loginForm) log('loginForm nicht gefunden', 'warn');
    if (!timeForm) log('timeForm nicht gefunden', 'warn');
    if (!employeeLogin) log('employeeLogin nicht gefunden', 'warn');
    if (!timeTracking) log('timeTracking nicht gefunden', 'warn');
    if (!employeeName) log('employeeName nicht gefunden', 'warn');
    if (!startTimeBtn) log('startTimeBtn nicht gefunden', 'warn');
    if (!endTimeBtn) log('endTimeBtn nicht gefunden', 'warn');
    if (!employeeNumberInput) log('employeeNumberInput nicht gefunden', 'warn');
    if (!pauseDurationInput) log('pauseDurationInput nicht gefunden', 'warn');

    if (!loginForm || !timeForm || !employeeLogin || !timeTracking || !employeeName || !startTimeBtn || !endTimeBtn || !employeeNumberInput || !pauseDurationInput) {
        log('Ein oder mehrere erforderliche Elemente wurden nicht gefunden', 'error');
        return;
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        log('Login-Formular abgesendet');
        const employeeNumber = employeeNumberInput.value;

        fetch('/api/validate-employee.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ employeeNumber: employeeNumber })
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                log(`Mitarbeiter ${data.name} erfolgreich eingeloggt`);
                employeeLogin.style.display = 'none';
                timeTracking.style.display = 'block';
                employeeName.textContent = data.name;
                sessionStorage.setItem('currentEmployee', JSON.stringify(data));
            } else {
                log(`Ungültige Mitarbeiternummer: ${employeeNumber}`, 'warn');
                alert('Ungültige Mitarbeiternummer');
            }
        })
        .catch(error => {
            log(`Fehler beim Validieren des Mitarbeiters: ${error}`, 'error');
            console.error('Error:', error);
            alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        });
    });

    startTimeBtn.addEventListener('click', function() {
        log('Startzeit-Button geklickt');
        this.disabled = true;
        endTimeBtn.disabled = false;
        setTime(this);
    });

    endTimeBtn.addEventListener('click', function() {
        log('Endzeit-Button geklickt');
        this.disabled = true;
        setTime(this);
    });

    timeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        log('Zeiterfassungs-Formular abgesendet');
        const employee = JSON.parse(sessionStorage.getItem('currentEmployee'));
        const pauseDuration = pauseDurationInput.value;

        if (!startTimeBtn.disabled || !endTimeBtn.disabled) {
            log('Start- oder Endzeit fehlt', 'warn');
            alert('Bitte Start- und Endzeit angeben');
            return;
        }

        const timeData = {
            employeeId: employee.id,
            startTime: startTimeBtn.dataset.time,
            endTime: endTimeBtn.dataset.time,
            pauseDuration: pauseDuration
        };

        log(`Gesammelte Zeitdaten: ${JSON.stringify(timeData)}`);

        fetch('/api/record-time.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(timeData)
        })
        .then(response => {
            log(`Server-Antwort Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            log(`Server-Antwort Daten: ${JSON.stringify(data)}`);
            if (data.success) {
                log('Zeit erfolgreich erfasst');
                alert('Zeit erfolgreich erfasst');
                resetForm();
            } else {
                log(`Fehler beim Erfassen der Zeit: ${data.message}`, 'error');
                alert('Fehler beim Erfassen der Zeit: ' + data.message);
            }
        })
        .catch(error => {
            log(`Fehler beim Senden der Zeitdaten: ${error}`, 'error');
            console.error('Error:', error);
            alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        });
    });

    function resetForm() {
        log('Formular wird zurückgesetzt');
        startTimeBtn.disabled = false;
        endTimeBtn.disabled = true;
        pauseDurationInput.value = '';
        delete startTimeBtn.dataset.time;
        delete endTimeBtn.dataset.time;
        startTimeBtn.textContent = 'Startzeit';
        endTimeBtn.textContent = 'Endzeit';
    }

    function setTime(button) {
        const now = new Date();
        button.dataset.time = now.toISOString().substr(11, 8);
        button.textContent = `${button.textContent.split(' ')[0]} ${button.dataset.time}`;
        log(`${button.textContent.split(' ')[0]} gesetzt: ${button.dataset.time}`);
    }

    log('Zeitrechnungs-Skript initialisiert');
});
