document.addEventListener('DOMContentLoaded', function() {
    const printAllButton = document.getElementById('printAllButton');
    printAllButton.addEventListener('click', printAllEmployeeTimes);
});

function printAllEmployeeTimes() {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const times = JSON.parse(localStorage.getItem('erfassteZeiten')) || [];

    let printContent = '';

    employees.forEach((employee, index) => {
        const employeeTimes = times.filter(time => time.employeeNumber === employee.number);
        const stundenkonto = calculateStundenkonto(employee.number, times) + (employee.stundenkonto || 0);

        printContent += `
            <div class="employee-page">
                <h2>Zeiterfassung für ${employee.firstName} ${employee.lastName} (${employee.number})</h2>
                <p><strong>Aktuelles Stundenkonto: ${formatTime(stundenkonto)}</strong></p>
                <table>
                    <thead>
                        <tr>
                            <th>Zeitstempel</th>
                            <th>Datum</th>
                            <th>Arbeitsbeginn</th>
                            <th>Arbeitsende</th>
                            <th>Pause</th>
                            <th>Gesamtarbeitszeit</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${employeeTimes.map(time => `
                            <tr>
                                <td>${formatTimestamp(time.timestamp)}</td>
                                <td>${time.datum}</td>
                                <td>${time.start}</td>
                                <td>${time.end}</td>
                                <td>${time.pause} min</td>
                                <td>${formatTime(time.gesamtzeit)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    });

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Alle Mitarbeiter Zeiterfassungen</title>
            <style>
                body { 
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    font-size: 12px;
                }
                h2 {
                    margin-bottom: 5px;
                }
                p {
                    margin-top: 0;
                    margin-bottom: 10px;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-bottom: 20px; 
                }
                th, td { 
                    border: 1px solid #ddd; 
                    padding: 4px; 
                    text-align: left; 
                }
                th { 
                    background-color: #f2f2f2; 
                }
                .employee-page { 
                    page-break-after: always;
                    padding: 20px;
                }
                @media print {
                    .employee-page {
                        page-break-after: always;
                    }
                    .employee-page:last-child {
                        page-break-after: auto;
                    }
                }
            </style>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function calculateStundenkonto(employeeNumber, times) {
    return times
        .filter(time => time.employeeNumber === employeeNumber)
        .reduce((total, time) => total + (time.gesamtzeit - 8 * 60), 0);
}

function formatTime(minutes) {
    const hours = Math.floor(Math.abs(minutes) / 60);
    const mins = Math.abs(minutes) % 60;
    const sign = minutes < 0 ? '-' : '+';
    return `${sign}${hours},${mins < 10 ? '0' : ''}${mins} Std`;
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