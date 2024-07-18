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
