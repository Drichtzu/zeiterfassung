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

    // Flexiblere Selektoren
    const loginForm = document.querySelector('form') || document.createElement('form');
    const timeForm = document.getElementById('timeForm') || document.createElement('form');
    const employeeLogin = document.querySelector('.container') || document.createElement('div');
    const timeTracking = document.getElementById('timeTracking') || document.createElement('div');
    const employeeName = document.getElementById('employeeName') || document.createElement('span');
    const startTimeBtn = document.getElementById('startTime') || document.createElement('button');
    const endTimeBtn = document.getElementById('endTime') || document.createElement('button');
    const employeeNumberInput = document.getElementById('employeeNumber') || document.createElement('input');
    const pauseDurationInput = document.getElementById('pauseDuration') || document.createElement('input');

    // Dynamisches Erstellen fehlender Elemente
    if (!timeTracking.id) {
        timeTracking.id = 'timeTracking';
        timeTracking.style.display = 'none';
        document.body.appendChild(timeTracking);
    }

    if (!employeeName.id) {
        employeeName.id = 'employeeName';
        timeTracking.appendChild(employeeName);
    }

    if (!startTimeBtn.id) {
        startTimeBtn.id = 'startTime';
        startTimeBtn.textContent = 'Startzeit';
        timeForm.appendChild(startTimeBtn);
    }

    if (!endTimeBtn.id) {
        endTimeBtn.id = 'endTime';
        endTimeBtn.textContent = 'Endzeit';
        endTimeBtn.disabled = true;
        timeForm.appendChild(endTimeBtn);
    }

    if (!pauseDurationInput.id) {
        pauseDurationInput.id = 'pauseDuration';
        pauseDurationInput.type = 'number';
        pauseDurationInput.placeholder = 'Pausendauer in Minuten';
        timeForm.appendChild(pauseDurationInput);
    }

    if (!timeForm.id) {
        timeForm.id = 'timeForm';
        timeTracking.appendChild(timeForm);
    }

    // Event Listener
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        log('Login-Formular abgesendet');
        const employeeNumber = employeeNumberInput.value;
        
        // Hier Ihre Logik für die Mitarbeitervalidierung
        // ...

        // Beispiel:
        employeeLogin.style.display = 'none';
        timeTracking.style.display = 'block';
        employeeName.textContent = "Beispiel Mitarbeiter";
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
        
        // Hier Ihre Logik für die Zeiterfassung
        // ...

        // Beispiel:
        log('Zeit erfolgreich erfasst');
        alert('Zeit erfolgreich erfasst');
        resetForm();
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
