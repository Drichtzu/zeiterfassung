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
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        return response.text().then(text => {
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('Fehler beim Parsen der JSON-Antwort:', text);
                throw new Error('Ungültige JSON-Antwort vom Server');
            }
        });
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
