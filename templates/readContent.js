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
            surveyElement.className = 'bg-gray-900 p-6 rounded-lg shadow-md border border-gray-800';
            surveyElement.innerHTML = `
                <h2 class="text-xl font-bold text-white mb-3">${survey.name}</h2>
                <p class="text-gray-400 mb-4">${survey.description}</p>
                <div class="grid grid-cols-3 gap-4">
                    <button onclick="readSurvey(${survey.id})" class="bg-neon_violet hover:bg-lime_green text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                        Read Content
                    </button>
                    <button onclick="toggleUpdateForm(${survey.id})" class="bg-neon_violet hover:bg-lime_green text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                        Update
                    </button>
                    <button onclick="deleteSurvey(${survey.id})" class="bg-neon_violet hover:bg-lime_green text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
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

async function readSurvey(surveyId) {
    const surveyUrl = `http://localhost:8080/api/surveys/${surveyId}`;
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(surveyUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const survey = await response.json();
        displaySurveyContent(surveyId, survey);
    } catch (error) {
        console.error('Error al cargar la encuesta:', error);
    }
}

function displaySurveyContent(surveyId, survey) {
    const contentDiv = document.getElementById(`survey-content-${surveyId}`);
    contentDiv.innerHTML = `
        <h3 class="text-xl font-bold text-white mb-4">Contenido de la Encuesta</h3>
        <div>
            <p class="text-white font-semibold">Descripción:</p>
            <p class="text-gray-400">${survey.description}</p>
        </div>
        <div id="chapters-container-${surveyId}" class="space-y-4 mt-4">
            ${survey.chapters.map(chapter => `
                <div class="chapter bg-gray-800 p-4 rounded-md">
                    <h4 class="text-lg font-medium text-white mb-2">Capítulo: ${chapter.chapter_title}</h4>
                    <button onclick="toggleChapterDetails(${surveyId}, ${chapter.id})" class="bg-neon_violet hover:bg-lime_green text-white py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                        ${chapter.showDetails ? 'Hide' : 'Show'} Chapter Details
                    </button>
                    <button onclick="toggleEditChapter(${surveyId}, ${chapter.id})" class="bg-neon_violet hover:bg-lime_green text-white py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                        Edit Chapter
                    </button>
                    <div id="chapter-content-${surveyId}-${chapter.id}" class="hidden mt-2">
                        <p class="text-gray-400">Número de Capítulo: ${chapter.chapter_number}</p>
                        <div id="questions-container-${surveyId}-${chapter.id}" class="space-y-2 mt-2">
                            ${chapter.questions.map(question => `
                                <div class="question bg-gray-700 p-2 rounded-md">
                                    <p class="text-white font-semibold">${question.question_number}. ${question.question_text}</p>
                                    <button onclick="toggleQuestionDetails(${surveyId}, ${chapter.id}, ${question.id})" class="bg-neon_violet hover:bg-lime_green text-white py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                                        ${question.showDetails ? 'Hide' : 'Show'} Question Details
                                    </button>
                                    <button onclick="toggleEditQuestion(${surveyId}, ${chapter.id}, ${question.id})" class="bg-neon_violet hover:bg-lime_green text-white py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                                        Edit Question
                                    </button>
                                    <div id="question-content-${surveyId}-${chapter.id}-${question.id}" class="hidden mt-2">
                                        <div id="response-options-container-${surveyId}-${chapter.id}-${question.id}" class="space-y-2 mt-2">
                                            ${question.responses.map(option => `
                                                <div class="response-option bg-gray-600 p-2 rounded-md">
                                                    <p class="text-white">${option.option_number}. ${option.option_text}</p>
                                                    <button onclick="toggleResponseOptionDetails(${surveyId}, ${chapter.id}, ${question.id}, ${option.id})" class="bg-neon_violet hover:bg-lime_green text-white py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                                                        ${option.showDetails ? 'Hide' : 'Show'} Response Option Details
                                                    </button>
                                                    <button onclick="toggleEditResponseOption(${surveyId}, ${chapter.id}, ${question.id}, ${option.id})" class="bg-neon_violet hover:bg-lime_green text-white py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                                                        Edit Response Option
                                                    </button>
                                                    <div id="response-option-content-${surveyId}-${chapter.id}-${question.id}-${option.id}" class="hidden mt-2">
                                                        <!-- Aquí se pueden mostrar más detalles si es necesario -->
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    contentDiv.classList.toggle('hidden'); // Alternar la visibilidad del contenido
}

function toggleChapterDetails(surveyId, chapterId) {
    const chapterContent = document.getElementById(`chapter-content-${surveyId}-${chapterId}`);
    chapterContent.classList.toggle('hidden');
}

function toggleQuestionDetails(surveyId, chapterId, questionId) {
    const questionContent = document.getElementById(`question-content-${surveyId}-${chapterId}-${questionId}`);
    questionContent.classList.toggle('hidden');
}

function toggleResponseOptionDetails(surveyId, chapterId, questionId, optionId) {
    const responseOptionContent = document.getElementById(`response-option-content-${surveyId}-${chapterId}-${questionId}-${optionId}`);
    responseOptionContent.classList.toggle('hidden');
}

function toggleUpdateForm(surveyId) {
    const formDiv = document.getElementById(`update-form-${surveyId}`);
    formDiv.classList.toggle('hidden');
    if (!formDiv.classList.contains('hidden')) {
        generateUpdateForm(surveyId);
    }
}

function generateUpdateForm(surveyId) {
    const formDiv = document.getElementById(`update-form-${surveyId}`);
    formDiv.innerHTML = `
        <h3 class="text-xl font-bold text-white mb-4">Actualizar Encuesta</h3>
        <form id="update-survey-form-${surveyId}">
            <!-- Campos del formulario para actualizar la encuesta -->
            <div class="mb-4">
                <label for="update-survey-name-${surveyId}" class="block text-white font-semibold">Nombre:</label>
                <input type="text" id="update-survey-name-${surveyId}" class="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-md">
            </div>
            <div class="mb-4">
                <label for="update-survey-description-${surveyId}" class="block text-white font-semibold">Descripción:</label>
                <textarea id="update-survey-description-${surveyId}" class="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-md"></textarea>
            </div>
            <button type="button" onclick="updateSurvey(${surveyId})" class="bg-neon_violet hover:bg-lime_green text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                Save Changes
            </button>
        </form>
    `;
    loadSurveyData(surveyId);
}

async function loadSurveyData(surveyId) {
    const surveyUrl = `http://localhost:8080/api/surveys/${surveyId}`;
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(surveyUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const survey = await response.json();
        populateUpdateForm(surveyId, survey);
    } catch (error) {
        console.error('Error al cargar los datos de la encuesta:', error);
    }
}

function populateUpdateForm(surveyId, survey) {
    document.getElementById(`update-survey-name-${surveyId}`).value = survey.name;
    document.getElementById(`update-survey-description-${surveyId}`).value = survey.description;
}

async function updateSurvey(surveyId) {
    const name = document.getElementById(`update-survey-name-${surveyId}`).value;
    const description = document.getElementById(`update-survey-description-${surveyId}`).value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:8080/api/surveys/${surveyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, description })
        });

        if (response.ok) {
            alert('Encuesta actualizada correctamente');
            getSurveys();
        } else {
            throw new Error('Error al actualizar la encuesta');
        }
    } catch (error) {
        console.error('Error al actualizar la encuesta:', error);
    }
}

async function deleteSurvey(surveyId) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:8080/api/surveys/${surveyId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Encuesta eliminada correctamente');
            getSurveys();
        } else {
            throw new Error('Error al eliminar la encuesta');
        }
    } catch (error) {
        console.error('Error al eliminar la encuesta:', error);
    }
}

document.addEventListener('DOMContentLoaded', getSurveys);
