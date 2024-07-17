document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const employeeNumber = urlParams.get('number');
    
    if (employeeNumber) {
        fetchEmployeeDetails(employeeNumber);
    } else {
        alert('Keine Mitarbeiternummer angegeben.');
    }
});

function fetchEmployeeDetails(employeeNumber) {
    fetch(`/api/employee-details.php?number=${employeeNumber}`)
    .then(response => response.json())
    .then(employee => {
        if (employee) {
            document.getElementById('employeeName').textContent = `${employee.firstName} ${employee.lastName}`;
            document.getElementById('employeeNumber').textContent = employee.number;
            // Hier können Sie weitere Details anzeigen, z.B. Stundenkonto
        } else {
            alert('Mitarbeiter nicht gefunden.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Fehler beim Laden der Mitarbeiterdetails.');
    });
}