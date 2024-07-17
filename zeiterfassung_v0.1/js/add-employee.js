document.addEventListener('DOMContentLoaded', function() {
    const addEmployeeButton = document.getElementById('addEmployeeButton');
    const newEmployeeButton = document.getElementById('newEmployeeButton');
    const existingEmployeeCheckbox = document.getElementById('existingEmployee');
    const existingHoursGroup = document.getElementById('existingHoursGroup');
    const existingHoursInput = document.getElementById('existingHours');

    addEmployeeButton.addEventListener('click', addEmployee);
    newEmployeeButton.addEventListener('click', toggleNewEmployeeForm);
    existingEmployeeCheckbox.addEventListener('change', toggleExistingHoursField);
    existingHoursInput.addEventListener('input', validateExistingHours);
});

function toggleNewEmployeeForm() {
    const newEmployeeForm = document.getElementById('newEmployeeForm');
    if (newEmployeeForm.style.display === 'none') {
        newEmployeeForm.style.display = 'block';
    } else {
        newEmployeeForm.style.display = 'none';
    }
}

function toggleExistingHoursField() {
    const existingHoursGroup = document.getElementById('existingHoursGroup');
    existingHoursGroup.style.display = this.checked ? 'block' : 'none';
}

function validateExistingHours(event) {
    let value = event.target.value.replace(',', '.');
    let hours = Math.floor(parseFloat(value) || 0);
    let minutes = Math.round((parseFloat(value) % 1) * 60);
    
    // Runde auf den nächsten Viertelstundenwert
    minutes = Math.round(minutes / 15) * 15;
    
    if (minutes === 60) {
        hours += 1;
        minutes = 0;
    }

    if (hours === 0 && minutes === 0) {
        event.target.value = '';
    } else {
        event.target.value = hours + (minutes > 0 ? ',' + (minutes < 10 ? '0' : '') + minutes : '');
    }
}

function addEmployee() {
    const newEmployeeNumber = document.getElementById('newEmployeeNumber').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const isExistingEmployee = document.getElementById('existingEmployee').checked;
    const existingHoursInput = document.getElementById('existingHours').value;

    if (!newEmployeeNumber || !firstName || !lastName) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
    }

    let existingHours = 0;
    if (isExistingEmployee && existingHoursInput) {
        const [hours, minutes] = existingHoursInput.split(',').map(Number);
        existingHours = (hours * 60) + (minutes || 0);
    }

    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    if (employees.some(emp => emp.number === newEmployeeNumber)) {
        alert('Diese Mitarbeiternummer existiert bereits.');
        return;
    }

    employees.push({
        number: newEmployeeNumber,
        firstName: firstName,
        lastName: lastName,
        stundenkonto: existingHours
    });
    localStorage.setItem('employees', JSON.stringify(employees));

    alert('Mitarbeiter erfolgreich hinzugefügt.');
    document.getElementById('newEmployeeNumber').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('existingEmployee').checked = false;
    document.getElementById('existingHours').value = '';
    document.getElementById('existingHoursGroup').style.display = 'none';
    displayEmployees(); // Funktion aus admin.js
    toggleNewEmployeeForm(); // Formular nach dem Hinzufügen ausblenden
}