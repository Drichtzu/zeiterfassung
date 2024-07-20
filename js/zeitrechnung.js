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

    // Selektoren für vorhandene HTML-Struktur
    const timeForm = document.getElementById('timeForm');
    const employeeNumberInput = document.getElementById('employeeNumber');
    const startTimeInput = document.getElementById('start');
    const endTimeInput = document.getElementById('end');
    const breakInput = document.getElementById('break');
    const calculateButton = document.getElementById('calculateButton');
    const loginButton = document.getElementById('loginButton');
    const overviewButton = document.getElementById('overviewButton');

    // Überprüfen und Loggen der Elemente
    if (!timeForm) log('timeForm nicht gefunden', 'warn');
    if (!employeeNumberInput) log('employeeNumberInput nicht gefunden', 'warn');
    if (!startTimeInput) log('startTimeInput nicht gefunden', 'warn');
    if (!endTimeInput) log('endTimeInput nicht gefunden', 'warn');
    if (!breakInput) log('breakInput nicht gefunden', 'warn');
    if (!calculateButton) log('calculateButton nicht gefunden', 'warn');
    if (!loginButton) log('loginButton nicht gefunden', 'warn');
    if (!overviewButton) log('overviewButton nicht gefunden', 'warn');

    if (!timeForm || !employeeNumberInput || !startTimeInput || !endTimeInput || !breakInput || !calculateButton) {
        log('Ein oder mehrere erforderliche Elemente wurden nicht gefunden', 'error');
        return;
    }

    calculateButton.addEventListener('click', function(e) {
        e.preventDefault();
        log('Zeit erfassen Button geklickt');
        
        const employeeNumber = employeeNumberInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const breakDuration = breakInput.value;

        if (!employeeNumber || !startTime || !endTime) {
            log('Fehlende Pflichtfelder', 'warn');
            alert('Bitte füllen Sie alle Pflichtfelder aus.');
            return;
        }

        const timeData = {
            employeeNumber: employeeNumber,
            startTime: startTime,
            endTime: endTime,
            breakDuration: breakDuration
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
        employeeNumberInput.value = '';
        startTimeInput.value = '';
        endTimeInput.value = '';
        breakInput.value = '0';
    }

    log('Zeitrechnungs-Skript initialisiert');
});
