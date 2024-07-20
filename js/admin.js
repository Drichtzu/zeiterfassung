document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin-Seite geladen');

    if (!sessionStorage.getItem('isAdmin')) {
        console.log('Kein Admin-Zugriff');
        alert('Zugriff verweigert. Bitte loggen Sie sich als Admin ein.');
        window.location.href = '/index.html';
        return;
    }

    console.log('Admin-Zugriff bestätigt');

    const employeeTable = document.getElementById('employeeTable');
    if (!employeeTable) {
        console.error('Mitarbeitertabelle-Element nicht gefunden');
    } else {
        console.log('Mitarbeitertabelle-Element gefunden');
        setTimeout(loadEmployeeList, 0);  // Verzögerte Ausführung
    }

    initializeEventListeners();
});

function initializeEventListeners() {
    const newEmployeeButton = document.getElementById('newEmployeeButton');
    const newEmployeeForm = document.getElementById('newEmployeeForm');
    const addEmployeeButton = document.getElementById('addEmployeeButton');
    const existingEmployeeCheckbox = document.getElementById('existingEmployee');
    const existingHoursGroup = document.getElementById('existingHoursGroup');
    const printAllButton = document.getElementById('printAllButton');

    if (newEmployeeButton) {
        newEmployeeButton.addEventListener('click', () => {
            newEmployeeForm.style.display = newEmployeeForm.style.display === 'none' ? 'block' : 'none';
        });
    }

    if (existingEmployeeCheckbox) {
        existingEmployeeCheckbox.addEventListener('change', (e) => {
            existingHoursGroup.style.display = e.target.checked ? 'block' : 'none';
        });
    }

    if (addEmployeeButton) {
        addEmployeeButton.addEventListener('click', addNewEmployee);
    }

    if (printAllButton) {
        printAllButton.addEventListener('click', printAllTimes);
    }
}

function loadEmployeeList() {
    console.log('Lade Mitarbeiterliste');
    fetch('/api/employees.php')
        .then(response => {
            console.log('Antwort erhalten:', response.status);
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok');
            }
            return response.json();
        })
        .then(employees => {
            console.log('Mitarbeiterdaten empfangen:', employees);
            const employeeTableBody = document.querySelector('#employeeTable tbody');
            if (!employeeTableBody) {
                console.error('Mitarbeitertabelle-Body nicht gefunden');
                return;
            }
            employeeTableBody.innerHTML = '';
            employees.forEach(employee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${employee.number}</td>
                    <td>${employee.firstName}</td>
                    <td>${employee.lastName}</td>
                    <td>${employee.existingHours || '0,00'}</td>
                    <td>
                        <button onclick="showEmployeeDetails('${employee.number}')">Details</button>
                        <button onclick="editEmployee(${employee.id})">Bearbeiten</button>
                        <button onclick="deleteEmployee(${employee.id})">Löschen</button>
                    </td>
                `;
                employeeTableBody.appendChild(row);
            });
            console.log('Mitarbeiterliste aktualisiert');
        })
        .catch(error => {
            console.error('Fehler beim Laden der Mitarbeiterliste:', error);
            alert('Fehler beim Laden der Mitarbeiterliste');
        });
}

function addNewEmployee() {
    const number = document.getElementById('newEmployeeNumber').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const existingEmployee = document.getElementById('existingEmployee').checked;
    const existingHours = existingEmployee ? document.getElementById('existingHours').value : '0';

    if (!number || !firstName || !lastName) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
    }

    const employeeData = {
        number: number,
        firstName: firstName,
        lastName: lastName,
        existingHours: existingHours
    };

    fetch('/api/employees.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Mitarbeiter erfolgreich hinzugefügt');
            document.getElementById('employeeForm').reset();
            document.getElementById('newEmployeeForm').style.display = 'none';
            loadEmployeeList();
        } else {
            alert('Fehler beim Hinzufügen des Mitarbeiters: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    });
}

// Diese Funktionen werden in separaten Dateien implementiert
function showEmployeeDetails(employeeNumber) {
    console.log('Details anzeigen für Mitarbeiter Nummer:', employeeNumber);
    // Diese Funktion sollte in employee-details.js implementiert sein
}

function editEmployee(id) {
    console.log('Bearbeiten von Mitarbeiter ID:', id);
    // Diese Funktion könnte in einer separaten Datei implementiert werden
}

function deleteEmployee(id) {
    console.log('Löschen von Mitarbeiter ID:', id);
    // Diese Funktion könnte in einer separaten Datei implementiert werden
}

function printAllTimes() {
    console.log('Alle Zeiten drucken');
    // Diese Funktion sollte in print-all-times.js implementiert sein
}
