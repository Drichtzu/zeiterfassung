function showEmployeeDetails(employeeNumber) {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const times = JSON.parse(localStorage.getItem('erfassteZeiten')) || [];
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin')) || false;
    
    const employee = employees.find(emp => emp.number === employeeNumber);
    if (!employee) {
        alert('Mitarbeiter nicht gefunden.');
        return;
    }

    const employeeTimes = times.filter(time => time.employeeNumber === employeeNumber);

    let detailsWindow = window.open('employee-details.html', 'EmployeeDetails', 'width=900,height=600');
    detailsWindow.employeeNumber = employeeNumber;

    detailsWindow.onload = function() {
        detailsWindow.document.title = `Zeiterfassung für ${employee.firstName} ${employee.lastName}`;
        detailsWindow.document.getElementById('employeeName').textContent = `${employee.firstName} ${employee.lastName}`;
        
        const tableBody = detailsWindow.document.getElementById('timeTableBody');
        const tableHead = detailsWindow.document.querySelector('thead tr');
        
        if (isAdmin) {
            const timestampHeader = document.createElement('th');
            timestampHeader.textContent = 'Zeitstempel';
            tableHead.insertBefore(timestampHeader, tableHead.firstChild);
        }

        employeeTimes.forEach((time, index) => {
            const row = tableBody.insertRow();
            let cellIndex = 0;

            if (isAdmin) {
                const timestampCell = row.insertCell(cellIndex++);
                timestampCell.textContent = formatTimestamp(time.timestamp);
                if (time.edited) {
                    timestampCell.textContent = '# ' + timestampCell.textContent;
                }
            }

            row.insertCell(cellIndex++).textContent = time.datum;
            row.insertCell(cellIndex++).textContent = time.start;
            row.insertCell(cellIndex++).textContent = time.end;
            row.insertCell(cellIndex++).textContent = `${time.pause} min`;
            row.insertCell(cellIndex++).textContent = formatTime(time.gesamtzeit);
        });
    };
}

function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} Std ${mins} Min`;
}