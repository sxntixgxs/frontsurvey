document.getElementById('survey-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('survey-name').value;
    const description = document.getElementById('survey-description').value;
    const chapters = Array.from(document.querySelectorAll('.chapter-title')).map(input => ({
        title: input.value
    }));

    const surveyData = {
        name: name,
        description: description,
        chapters: chapters
    };

    fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(surveyData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Encuesta guardada con éxito.');
        showView('view-surveys');
        loadSurveys(); // Actualizar la lista de encuestas
    })
    .catch(error => {
        console.error('Error al guardar la encuesta:', error);
    });
});
