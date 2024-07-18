document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculateButton');
    calculateButton.addEventListener('click', zeitrechnung);
});

function zeitrechnung() {
    const employeeNumber = document.getElementById("employeeNumber").value;
    const timeStart = document.getElementById("start").value;
    const timeEnd = document.getElementById("end").value;
    const breakTime = parseInt(document.getElementById("break").value) || 0;

    if (!employeeNumber || !timeStart || !timeEnd) {
        alert("Bitte füllen Sie alle Pflichtfelder aus.");
        return;
    }

    if (!isValidEmployeeNumber(employeeNumber)) {
        alert("Ungültige Mitarbeiternummer. Bitte überprüfen Sie Ihre Eingabe.");
        return;
    }

    if (!isQuarterHourTime(timeStart) || !isQuarterHourTime(timeEnd)) {
        alert("Bitte geben Sie die Zeiten im Viertelstundentakt ein (00, 15, 30, 45 Minuten).");
        return;
    }

    if (breakTime < 0 || breakTime % 15 !== 0) {
        alert("Die Pausenzeit muss positiv und im Viertelstundentakt sein.");
        return;
    }

    const startMinutes = convertToMinutes(timeStart);
    const endMinutes = convertToMinutes(timeEnd);
    let totalMinutes = endMinutes - startMinutes - breakTime;

    if (totalMinutes < 0) {
        totalMinutes += 24 * 60;
    }

    if (totalMinutes < 0) {
        alert("Die Endzeit muss nach der Startzeit liegen.");
        return;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    alert(`Arbeitszeit für Mitarbeiter ${employeeNumber}: ${hours} Stunden und ${minutes} Minuten`);

    saveTime(employeeNumber, timeStart, timeEnd, breakTime, totalMinutes);
}

function convertToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function isQuarterHourTime(timeString) {
    const minutes = timeString.split(':')[1];
    return ['00', '15', '30', '45'].includes(minutes);
}

function isValidEmployeeNumber(number) {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    return employees.some(emp => emp.number === number);
}

function saveTime(employeeNumber, start, end, breakTime, totalMinutes) {
    let times = JSON.parse(localStorage.getItem('erfassteZeiten')) || [];
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const employee = employees.find(emp => emp.number === employeeNumber);

    if (!employee) {
        alert('Mitarbeiter nicht gefunden. Bitte überprüfen Sie die Mitarbeiternummer.');
        return;
    }

    times.push({
        employeeNumber: employeeNumber,
        firstName: employee.firstName,
        lastName: employee.lastName,
        datum: new Date().toLocaleDateString(),
        start: start,
        end: end,
        pause: breakTime,
        gesamtzeit: totalMinutes,
        timestamp: new Date().toISOString() // Hinzufügen des Zeitstempels
    });
    localStorage.setItem('erfassteZeiten', JSON.stringify(times));
}