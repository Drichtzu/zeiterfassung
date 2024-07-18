document.addEventListener('DOMContentLoaded', function() {
    const printAllTimesButton = document.getElementById('printAllTimesButton');
    
    if (printAllTimesButton) {
        printAllTimesButton.addEventListener('click', printAllTimes);
    }
});

function printAllTimes() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert('Bitte wählen Sie Start- und Enddatum aus.');
        return;
    }

    fetch(`/zeiterfassung/api/get-all-times.php?startDate=${startDate}&endDate=${endDate}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>Alle Zeiten</title></head><body>');
            printWindow.document.write('<h1>Alle erfassten Zeiten</h1>');
            printWindow.document.write(`<p>Zeitraum: ${startDate} bis ${endDate}</p>`);
            printWindow.document.write('<table border="1">');
            printWindow.document.write('<tr><th>Mitarbeiter</th><th>Datum</th><th>Startzeit</th><th>Endzeit</th><th>Pausendauer</th><th>Gesamtzeit</th></tr>');
            
            data.times.forEach(entry => {
                printWindow.document.write(`<tr>
                    <td>${entry.employeeName}</td>
                    <td>${entry.date}</td>
                    <td>${entry.startTime}</td>
                    <td>${entry.endTime}</td>
                    <td>${entry.pauseDuration} min</td>
                    <td>${entry.totalTime}</td>
                </tr>`);
            });
            
            printWindow.document.write('</table>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        } else {
            alert('Fehler beim Abrufen der Zeiten: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    });
}
