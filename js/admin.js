document.addEventListener('DOMContentLoaded', function() {
    if (!sessionStorage.getItem('isAdmin')) {
        alert('Zugriff verweigert. Bitte loggen Sie sich als Admin ein.');
        window.location.href = '../index.html';
        return;
    }

    loadEmployeeList();

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
    fetch('http://192.168.177.159/api/employees.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok');
            }
            return response.json();
        })
        .then(employees => {
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
        })
        .catch(error => {
            console.error('Fehler beim Laden der Mitarbeiterliste:', error);
            alert('Fehler beim Laden der Mitarbeiterliste');
        });
}

function addNewEmployee() {
    const number = document.getElementById('newEmployeeNumber').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const existingEmployee = document.getElementById('existingEmployee').checked;
    const existingHours = existingEmployee ? document.getElementById('existingHours').value : '0';

    if (!number) {
        alert('Bitte geben Sie eine Mitarbeiternummer an');
        return;
    }

    const employeeData = {
        number: number,
        firstName: firstName,
        lastName: lastName,
        existingHours: existingHours
    };

    fetch('http://192.168.177.159/api/employees.php', {
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
            loadEmployeeList();
            document.getElementById('newEmployeeForm').reset();
        } else {
            alert('Fehler beim Hinzufügen des Mitarbeiters: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    });
}
