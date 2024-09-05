// Asegúrate de que API_URL esté disponible aquí
// Puedes importar API_URL desde otro archivo si estás usando módulos, o simplemente asegurarte de que no haya duplicados

function loadSurveys() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No estás autenticado. Por favor, inicia sesión.');
        window.location.href = '/index.html'; // Redirige al inicio de sesión si no hay token
        return;
    }

    fetch(API_URL, {
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

// Funciones adicionales aquí...
