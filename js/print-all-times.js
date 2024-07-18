function printAllTimes() {
    fetch('/api/all-times.php')
    .then(response => response.json())
    .then(timeEntries => {
        let printContent = '<h2>Alle Zeiteinträge</h2>';
        timeEntries.forEach(entry => {
            printContent += `<p>${entry.employeeName}: ${entry.date} - Start: ${entry.startTime}, Ende: ${entry.endTime}</p>`;
        });
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Fehler beim Laden der Zeiteinträge.');
    });
}