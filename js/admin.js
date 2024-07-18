document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin-Seite geladen');

    if (!sessionStorage.getItem('isAdmin')) {
        console.log('Kein Admin-Zugriff');
        alert('Zugriff verweigert. Bitte loggen Sie sich als Admin ein.');
        window.location.href = '/zeiterfassung/index.html';
        return;
    }

    console.log('Admin-Zugriff bestätigt');

    const employeeList = document.getElementById('employeeList');
    if (!employeeList) {
        console.error('Mitarbeiterliste-Element nicht gefunden');
    } else {
        console.log('Mitarbeiterliste-Element gefunden');
        loadEmployeeList();
    }

    const newEmployeeButton = document.getElementById('newEmployeeButton');
    const newEmployeeForm = document.getElementById('newEmployeeForm');
    const addEmployeeButton = document.getElementById('addEmployeeButton');
    const existingEmployeeCheckbox = document.getElementById('existingEmployee');
    const existingHoursGroup = document.getElementById('existingHoursGroup');

    if (newEmployeeButton) {
        newEmployeeButton.addEventListener('click', () => {
            newEmployeeForm.style.display = 'block';
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
});

function loadEmployeeList() {
    console.log('Lade Mitarbeiterliste');
    fetch('/zeiterfassung/api/employees.php')
        .then(response => {
            console.log('Antwort erhalten:', response.status);
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok');
            }
            return response.json();
        })
        .then(employees => {
            console.log('Mitarbeiterdaten empfangen:', employees);
            const employeeList = document.getElementById('employeeList');
            if (!employeeList) {
                console.error('Mitarbeiterliste-Element nicht gefunden');
                return;
            }
            employeeList.innerHTML = '';
            employees.forEach(employee => {
                const li = document.createElement('li');
                li.textContent = `${employee.firstName} ${employee.lastName} (${employee.number})`;
                employeeList.appendChild(li);
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

    fetch('/zeiterfassung/api/employees.php', {
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
            document.getElementById('newEmployeeForm').reset();
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
