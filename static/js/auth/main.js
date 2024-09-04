document.addEventListener('DOMContentLoaded', () => {
    const currentView = 'surveys'; // Cambiar según necesidad
    let isAdmin = false; // Cambiar según necesidad

    const surveys = [
        { id: 1, name: 'Encuesta 1' },
        { id: 2, name: 'Encuesta 2' }
    ];

    const chapters = [
        { title: 'Capítulo 1', questions: [] },
        { title: 'Capítulo 2', questions: [] }
    ];

    function renderSurveys() {
        const surveysList = document.getElementById('surveys-list');
        surveysList.innerHTML = '';
        surveys.forEach(survey => {
            const listItem = document.createElement('li');
            listItem.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow', 'mb-4');
            listItem.innerHTML = `
                ${survey.name}
                <button onclick="viewSurvey(${survey.id})" class="ml-2 bg-blue-500 text-white px-2 py-1 rounded">Ver</button>
                ${isAdmin ? `<button onclick="editSurvey(${survey.id})" class="ml-2 bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                <button onclick="deleteSurvey(${survey.id})" class="ml-2 bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>` : ''}
            `;
            surveysList.appendChild(listItem);
        });
    }

    function viewSurvey(id) {
        document.getElementById('view-surveys').classList.add('hidden');
        document.getElementById('view-survey-form').classList.add('hidden');
        document.getElementById('view-survey-details').classList.remove('hidden');
        const survey = surveys.find(s => s.id === id);
        if (survey) {
            document.getElementById('survey-title').textContent = survey.name;
            document.getElementById('survey-description-details').textContent = survey.description;
            // Render chapters and questions
        }
    }

    function editSurvey(id) {
        document.getElementById('view-surveys').classList.add('hidden');
        document.getElementById('view-survey-details').classList.add('hidden');
        document.getElementById('view-survey-form').classList.remove('hidden');
        document.getElementById('form-title').textContent = 'Editar Encuesta';
        const survey = surveys.find(s => s.id === id);
        if (survey) {
            document.getElementById('survey-name').value = survey.name;
            document.getElementById('survey-description').value = survey.description;
            // Render chapters and questions
        }
    }

    function deleteSurvey(id) {
        const index = surveys.findIndex(s => s.id === id);
        if (index !== -1) {
            surveys.splice(index, 1);
            renderSurveys();
        }
    }

    function saveSurvey() {
        // Save survey logic
    }

    function addChapter() {
        // Add chapter logic
    }

    function removeChapter(index) {
        // Remove chapter logic
    }

    function addQuestion(chapter) {
        // Add question logic
    }

    function removeQuestion(chapter, index) {
        // Remove question logic
    }

    function addOption(question) {
        // Add option logic
    }

    function removeOption(question, index) {
        // Remove option logic
    }

    function submitSurvey() {
        alert('Encuesta enviada con éxito');
        document.getElementById('view-survey-details').classList.add('hidden');
        document.getElementById('view-surveys').classList.remove('hidden');
    }

    function logout() {
        alert('Sesión cerrada');
        localStorage.removeItem('authToken');
        window.location.href = 'index.html'; // Redirige al login
    }

    document.getElementById('logout').addEventListener('click', logout);

    document.getElementById('survey-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveSurvey();
    });

    document.getElementById('add-chapter').addEventListener('click', addChapter);

    renderSurveys(); // Inicializar la vista
});
