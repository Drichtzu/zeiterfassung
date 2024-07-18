function addTimeEntry() {
    const employeeName = document.getElementById('employeeName').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    if (employeeName && date && startTime && endTime) {
        fetch('/api/add-time-entry.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                employeeName: employeeName,
                date: date,
                startTime: startTime,
                endTime: endTime
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Zeiteintrag erfolgreich hinzugefügt.');
                document.getElementById('employeeName').value = '';
                document.getElementById('date').value = '';
                document.getElementById('startTime').value = '';
                document.getElementById('endTime').value = '';
            } else {
                alert('Fehler beim Hinzufügen des Zeiteintrags: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        });
    } else {
        alert('Bitte füllen Sie alle Felder aus.');
    }
}

function calculateWorkingTime(startTime, endTime) {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    
    let diff = end - start;
    if (diff < 0) {
        diff += 24 * 60 * 60 * 1000; // Add 24 hours if end time is on the next day
    }
    
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    
    return { hours, minutes };
}