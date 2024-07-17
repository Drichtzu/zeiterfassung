document.addEventListener('DOMContentLoaded', function() {
    const currentEmployeeNumber = sessionStorage.getItem('currentEmployeeNumber');
    if (!currentEmployeeNumber) {
        alert("Keine gültige Mitarbeiternummer gefunden. Bitte melden Sie sich erneut an.");
        window.location.href = '../index.html';
        return;
    }

    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const employee = employees.find(emp => emp.number === currentEmployeeNumber);

    if (employee) {
        document.getElementById('employeeInfo').textContent = `Mitarbeiter: ${employee.firstName} ${employee.lastName} (${employee.number})`;
    } else {
        document.getElementById('employeeInfo').textContent = `Mitarbeiternummer: ${currentEmployeeNumber}`;
    }

    displayTimes(currentEmployeeNumber);
});

function displayTimes(employeeNumber) {
    const timeTable = document.getElementById('timeTable').getElementsByTagName('tbody')[0];
    const times = JSON.parse(localStorage.getItem('erfassteZeiten')) || [];
    let gesamtStundenkonto = 0;

    timeTable.innerHTML = '';

    times.filter(time => time.employeeNumber === employeeNumber).forEach(time => {
        const row = timeTable.insertRow();
        row.insertCell(0).textContent = time.datum;
        row.insertCell(1).textContent = time.start;
        row.insertCell(2).textContent = time.end;
        row.insertCell(3).textContent = time.pause + ' min';
        row.insertCell(4).textContent = formatTime(time.gesamtzeit);
        
        const stundenkonto = calculateStundenkonto(time.gesamtzeit);
        gesamtStundenkonto += stundenkonto;
        row.insertCell(5).textContent = formatTime(stundenkonto);
    });

    updateStundenkontoStand(gesamtStundenkonto);
}

function formatTime(minutes) {
    const hours = Math.floor(Math.abs(minutes) / 60);
    const mins = Math.abs(minutes) % 60;
    const sign = minutes < 0 ? '-' : '+';
    return `${sign}${hours} Std ${mins} Min`;
}

function calculateStundenkonto(workMinutes) {
    const standardWorkday = 8 * 60;
    return workMinutes - standardWorkday;
}

function updateStundenkontoStand(minutes) {
    const stundenkontoStand = document.getElementById('stundenkontoStand');
    stundenkontoStand.textContent = formatTime(minutes);
}