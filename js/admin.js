document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('isAdmin') !== 'true') {
        window.location.href = '../index.html';
        return;
    }

    displayEmployees();
});

function displayEmployees() {
    fetch('/api/employees.php')
    .then(response => response.json())
    .then(employees => {
        const employeeList = document.getElementById('employeeList');
        employeeList.innerHTML = '';
        employees.forEach(employee => {
            const li = document.createElement('li');
            li.textContent = `${employee.firstName} ${employee.lastName} (${employee.number})`;
            employeeList.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Fehler beim Laden der Mitarbeiterliste.');
    });
}