const API_URL = 'http://localhost:8080/api/surveys';

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/index.html';
    } else {
        showView('view-surveys');
        loadSurveys(); // Cargar encuestas al iniciar
    }
});

document.getElementById('logout').addEventListener('click', function() {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
});

function showView(viewId) {
    const views = document.querySelectorAll('#app > div');
    views.forEach(view => {
        if (view.id === viewId) {
            view.classList.remove('hidden');
        } else {
            view.classList.add('hidden');
        }
    });
}

function loadSurveys() {
    fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const surveysList = document.getElementById('surveys-list');
        surveysList.innerHTML = '';
        data.forEach(survey => {
            const listItem = document.createElement('li');
            listItem.classList.add('mb-2', 'p-4', 'bg-white', 'shadow-md', 'rounded');
            listItem.innerHTML = `
                <h3 class="text-lg font-bold">${survey.name}</h3>
                <p>${survey.description}</p>
                <button class="bg-blue-500 text-white px-2 py-1 rounded" onclick="viewSurveyDetails(${survey.id})">Ver Detalles</button>
                <button class="bg-yellow-500 text-white px-2 py-1 rounded" onclick="editSurvey(${survey.id})">Editar</button>
                <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="confirmDeleteSurvey(${survey.id})">Eliminar</button>
            `;
            surveysList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error al cargar las encuestas:', error);
    });
}

function viewSurveyDetails(id) {
    fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('survey-title').textContent = data.name;
        document.getElementById('survey-description-details').textContent = data.description;
        // Aquí puedes añadir capítulos u otros detalles si es necesario
        showView('view-survey-details');
    })
    .catch(error => {
        console.error('Error al cargar los detalles de la encuesta:', error);
    });
}
