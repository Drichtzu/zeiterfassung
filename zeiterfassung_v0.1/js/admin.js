document.addEventListener('DOMContentLoaded', function() {
    displayEmployees();

    // Füge einen Event-Listener für den "Zurück zur Hauptseite" Button hinzu
    const backButton = document.querySelector('a[href="../index.html"]');
    backButton.addEventListener('click', function() {
        localStorage.setItem('isAdmin', JSON.stringify(false)); // Setze den Admin-Status zurück
    });
});

function displayEmployees() {
    const employeeTable = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
    employeeTable.innerHTML = '';

    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const times = JSON.parse(localStorage.getItem('erfassteZeiten')) || [];

    employees.forEach(employee => {
        const row = employeeTable.insertRow();
        row.insertCell(0).textContent = employee.number;
        row.insertCell(1).textContent = employee.firstName;
        row.insertCell(2).textContent = employee.lastName;
        
        const stundenkonto = calculateStundenkonto(employee.number, times) + (employee.stundenkonto || 0);
        row.insertCell(3).textContent = formatTime(stundenkonto);

        const actionsCell = row.insertCell(4);
        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Details anzeigen';
        detailsButton.onclick = () => showEmployeeDetails(employee.number);
        actionsCell.appendChild(detailsButton);
    });
}

function calculateStundenkonto(employeeNumber, times) {
    return times
        .filter(time => time.employeeNumber === employeeNumber)
        .reduce((total, time) => total + (time.gesamtzeit - 8 * 60), 0);
}

function formatTime(minutes) {
    const hours = Math.floor(Math.abs(minutes) / 60);
    const mins = Math.abs(minutes) % 60;
    const sign = minutes < 0 ? '-' : '+';
    return `${sign}${hours},${mins < 10 ? '0' : ''}${mins} Std`;
}