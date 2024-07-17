document.addEventListener('DOMContentLoaded', function() {
    const overviewButton = document.getElementById('overviewButton');
    overviewButton.addEventListener('click', checkEmployeeNumberForOverview);
});

function checkEmployeeNumberForOverview(event) {
    event.preventDefault();

    const employeeNumber = prompt("Bitte geben Sie Ihre Mitarbeiternummer ein:");

    if (employeeNumber) {
        if (isValidEmployeeNumber(employeeNumber)) {
            sessionStorage.setItem('currentEmployeeNumber', employeeNumber);
            window.location.href = 'html/uebersicht.html';
        } else {
            alert("Ungültige Mitarbeiternummer. Zugriff verweigert.");
        }
    }
}

function isValidEmployeeNumber(number) {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    return employees.some(emp => emp.number === number);
}