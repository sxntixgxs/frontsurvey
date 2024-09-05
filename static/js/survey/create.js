// Variables globales
const API_URL = 'http://localhost:8080/api/surveys';


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
            listItem.classList.add('mb-2');
            listItem.innerHTML = `
                <div class="p-4 border rounded">
                    <h3 class="text-xl font-bold">${survey.name}</h3>
                    <p>${survey.description}</p>
                    <a href="#" data-id="${survey.id}" class="text-blue-600 hover:text-blue-800 view-details">Ver Detalles</a>
                </div>
            `;
            surveysList.appendChild(listItem);
        });

        // Añadir evento para ver detalles de la encuesta
        document.querySelectorAll('.view-details').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showSurveyDetails(e.target.getAttribute('data-id'));
            });
        });
    })
    .catch(error => {
        console.error('Error al cargar las encuestas:', error);
    });
}




// Crear Encuesta
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




// Leer Encuestas
function loadSurveys() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No estás autenticado. Por favor, inicia sesión.');
        window.location.href = '/index.html'; // Redirige al inicio de sesión si no hay token
        return;
    }

    fetch('http://localhost:8080/api/surveys', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.status === 403) {
            alert('No tienes permiso para acceder a esta información.');
            // Redirige al usuario a la página de inicio de sesión o maneja el error
            window.location.href = '/index.html';
            return;
        }
        return response.json();
    })
    .then(data => {
        const surveysList = document.getElementById('surveys-list');
        surveysList.innerHTML = '';
        data.forEach(survey => {
            const listItem = document.createElement('li');
            listItem.classList.add('mb-2', 'p-4', 'bg-white', 'shadow-md', 'rounded');
            listItem.innerHTML = `
                <h3 class="text-lg font-bold">${survey.name}</h3>
                <p>${survey.description}</p>
                <button class="bg-blue-500 text-white px-2 py-1 rounded" onclick="editSurvey(${survey.id})">Editar</button>
                <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteSurvey(${survey.id})">Eliminar</button>
                <button class="bg-green-500 text-white px-2 py-1 rounded" onclick="viewSurveyDetails(${survey.id})">Ver Detalles</button>
            `;
            surveysList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error al cargar las encuestas:', error);
    });
}



// Editar Encuesta
function editSurvey(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('survey-name').value = data.name;
            document.getElementById('survey-description').value = data.description;
            const chaptersContainer = document.getElementById('chapters-container');
            chaptersContainer.innerHTML = '';
            data.chapters.forEach((chapter, index) => {
                const chapterDiv = document.createElement('div');
                chapterDiv.classList.add('mb-4');
                chapterDiv.innerHTML = `
                    <label class="block mb-2">Capítulo ${index + 1}</label>
                    <input type="text" class="w-full p-2 border rounded chapter-title" value="${chapter.title}">
                `;
                chaptersContainer.appendChild(chapterDiv);
            });
            document.getElementById('form-title').textContent = 'Editar Encuesta';
            document.getElementById('survey-form').onsubmit = function (e) {
                e.preventDefault();
                updateSurvey(id);
            };
            showView('view-survey-form');
        })
        .catch(error => {
            console.error('Error al cargar la encuesta:', error);
        });
}

// Actualizar Encuesta
function updateSurvey(id) {
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

    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(surveyData)
    })
        .then(response => response.json())
        .then(data => {
            alert('Encuesta actualizada con éxito.');
            showView('surveys');
            loadSurveys(); // Actualizar la lista de encuestas
        })
        .catch(error => {
            console.error('Error al actualizar la encuesta:', error);
        });
}


// Eliminar Encuesta
function deleteSurvey(id) {
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                alert('Encuesta eliminada con éxito.');
                loadSurveys(); // Actualizar la lista de encuestas
            } else {
                alert('Error al eliminar la encuesta.');
            }
        })
        .catch(error => {
            console.error('Error al eliminar la encuesta:', error);
        });
}


// Ver Detalles de Encuesta
function viewSurveyDetails(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('survey-title').textContent = data.name;
            document.getElementById('survey-description-details').textContent = data.description;
            const chaptersDetails = document.getElementById('chapters-details');
            chaptersDetails.innerHTML = '';
            data.chapters.forEach(chapter => {
                const chapterDiv = document.createElement('div');
                chapterDiv.classList.add('mb-2');
                chapterDiv.innerHTML = `<p>${chapter.title}</p>`;
                chaptersDetails.appendChild(chapterDiv);
            });
            showView('view-survey-details');
        })
        .catch(error => {
            console.error('Error al cargar los detalles de la encuesta:', error);
        });
}
