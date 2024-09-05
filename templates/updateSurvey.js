async function loadSurveyData() {
    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get('surveyId');
    const surveyUrl = `http://localhost:8080/api/surveys/${surveyId}`;
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(surveyUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const survey = await response.json();
        populateForm(survey);
    } catch (error) {
        console.error('Error al cargar la encuesta:', error);
    }
}

function populateForm(survey) {
    document.getElementById('name').value = survey.name;
    document.getElementById('description').value = survey.description;
    
    const chaptersContainer = document.getElementById('chapters-container');
    survey.chapters.forEach(chapter => {
        const chapterElement = document.createElement('div');
        chapterElement.innerHTML = `
            <h3>Capítulo: ${chapter.chapter_title}</h3>
            <p>Número de Capítulo: ${chapter.chapter_number}</p>
            <!-- Agrega inputs para actualizar -->
        `;
        chaptersContainer.appendChild(chapterElement);
    });
}

document.getElementById('update-survey-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get('surveyId');
    const updateUrl = `http://localhost:8080/api/surveys/${surveyId}`;
    const token = localStorage.getItem('token');
    
    const updatedSurvey = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        // Captura los datos actualizados de capítulos y preguntas si es necesario
    };

    try {
        const response = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedSurvey)
        });
        
        if (response.ok) {
            alert('Encuesta actualizada');
            window.location.href = '/index.html'; // Regresa a la página principal
        } else {
            console.error('Error actualizando la encuesta');
        }
    } catch (error) {
        console.error('Error en la solicitud PUT:', error);
    }
});

document.addEventListener('DOMContentLoaded', loadSurveyData);
