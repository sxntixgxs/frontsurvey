// Verifica el contenido del localStorage
if (!localStorage.getItem('token')) {
    window.location.href = 'index.html'; // Redirige si no hay token
}

async function getSurveys() {
    const getSurveysUrl = 'http://localhost:8080/api/surveys';
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(getSurveysUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener encuestas');
        }
        
        const data = await response.json();
        displaySurveys(data);
    } catch (error) {
        console.error('Error fetching surveys:', error);
    }
}

function displaySurveys(data) {
    const surveyListDiv = document.getElementById('survey-list');
    surveyListDiv.innerHTML = '';

    if (data.length === 0) {
        surveyListDiv.innerHTML = '<p class="text-white text-center">No hay encuestas disponibles.</p>';
    } else {
        data.forEach(survey => {
            const surveyElement = document.createElement('div');
            surveyElement.className = 'bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md border border-gray-800';
            surveyElement.innerHTML = `
                <h2 class="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">${survey.name}</h2>
                <p class="text-sm sm:text-base text-gray-400 mb-4">${survey.description}</p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                    <button onclick="readSurvey(${survey.id})" class="w-full bg-neon_violet hover:bg-lime_green text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                        Read Content
                    </button>
                    <button onclick="toggleUpdateForm(${survey.id})" class="w-full bg-neon_violet hover:bg-lime_green text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                        Update
                    </button>
                    <button onclick="deleteSurvey(${survey.id})" class="w-full bg-neon_violet hover:bg-lime_green text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                        Delete
                    </button>
                </div>
                <div id="update-form-${survey.id}" class="update-form hidden mt-4">
                    <!-- El formulario de actualización se insertará aquí -->
                </div>
                <div id="survey-content-${survey.id}" class="survey-content hidden mt-4">
                    <!-- El contenido de la encuesta se insertará aquí -->
                </div>
            `;
            surveyListDiv.appendChild(surveyElement);
        });
    }
}

async function toggleUpdateForm(surveyId) {
    const formContainer = document.getElementById(`update-form-${surveyId}`);
    if (formContainer.classList.contains('hidden')) {
        // Mostrar formulario
        const survey = await fetchSurveyData(surveyId);
        formContainer.innerHTML = generateUpdateForm(survey);
        formContainer.classList.remove('hidden');
    } else {
        // Ocultar formulario
        formContainer.classList.add('hidden');
    }
}

async function fetchSurveyData(surveyId) {
    const surveyUrl = `http://localhost:8080/api/surveys/${surveyId}`;
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(surveyUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error al cargar la encuesta:', error);
    }
}

function generateUpdateForm(survey) {
    return `
        <h3 class="text-lg sm:text-xl font-bold text-white mb-4">Actualizar Encuesta</h3>
        <form id="update-survey-form-${survey.id}" data-survey-id="${survey.id}" class="space-y-4">
            <div>
                <label for="name-${survey.id}" class="block text-sm font-medium text-white">Nombre de la Encuesta:</label>
                <input type="text" id="name-${survey.id}" name="name" value="${survey.name}" class="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon_violet focus:border-neon_violet">
            </div>
            <div>
                <label for="description-${survey.id}" class="block text-sm font-medium text-white">Descripción:</label>
                <input type="text" id="description-${survey.id}" name="description" value="${survey.description}" class="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon_violet focus:border-neon_violet">
            </div>
            <div id="chapters-container-${survey.id}" class="space-y-4">
                ${survey.chapters.map(chapter => `
                    <div class="chapter bg-gray-800 p-4 rounded-md">
                        <h4 class="text-base sm:text-lg font-medium text-white mb-2">Capítulo: ${chapter.chapter_title}</h4>
                        <p class="text-sm text-gray-400">Número de Capítulo: ${chapter.chapter_number}</p>
                        <!-- Agrega inputs para actualizar capítulos aquí -->
                    </div>
                `).join('')}
            </div>
            <button type="submit" class="w-full bg-neon_violet hover:bg-lime_green text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                Guardar cambios
            </button>
        </form>
    `;
}

document.addEventListener('submit', async (e) => {
    if (e.target && e.target.id.startsWith('update-survey-form-')) {
        e.preventDefault();
        const surveyId = e.target.dataset.surveyId;
        const updateUrl = `http://localhost:8080/api/surveys/${surveyId}`;
        const token = localStorage.getItem('token');
        
        const updatedSurvey = {
            name: document.getElementById(`name-${surveyId}`).value,
            description: document.getElementById(`description-${surveyId}`).value,
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
                getSurveys(); // Refrescar la lista de encuestas
            } else {
                console.error('Error actualizando la encuesta');
            }
        } catch (error) {
            console.error('Error en la solicitud PUT:', error);
        }
    }
});

async function deleteSurvey(surveyId) {
    const deleteUrl = `http://localhost:8080/api/surveys/${surveyId}`;
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            console.log(`Encuesta ${surveyId} eliminada`);
            getSurveys(); // Refrescar la lista de encuestas
        } else {
            console.error('Error eliminando la encuesta');
        }
    } catch (error) {
        console.error('Error en la solicitud DELETE:', error);
    }
}

// Función para eliminar un capítulo
function deleteChapter(chapterId) {
    // Lógica para eliminar el capítulo, por ejemplo, hacer una llamada a la API para eliminarlo
    console.log(`Eliminar capítulo con ID: ${chapterId}`);
}

// Función para crear un capítulo
function createChapter() {
    // Lógica para crear un nuevo capítulo, por ejemplo, mostrar un formulario o hacer una llamada a la API
    console.log('Crear un nuevo capítulo');
}


document.addEventListener('DOMContentLoaded', getSurveys);
