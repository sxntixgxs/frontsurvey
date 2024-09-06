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
                    <button id="adminButton" onclick="deleteSurvey(${survey.id})" class="bg-neon_violet hover:bg-lime_green text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
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
                    <!-- Contenedor de botones alineados en fila -->
                    <div class="flex space-x-2 mb-2">
                        <button onclick="toggleChapterDetails(${surveyId}, ${chapter.id})" id="readButton" class="bg-neon_violet hover:bg-lime_green text-white py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                            ${chapter.showDetails ? 'Hide' : 'Show'} Chapter Details
                        </button>
                        <button onclick="toggleEditChapter(${surveyId}, ${chapter.id})" class="bg-neon_violet hover:bg-lime_green text-white py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                            Edit Chapter
                        </button>
                        <button id="adminButton" onclick="deleteChapter(${chapter.id})" class="bg-bright_coral hover:bg-red-600 text-white py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600">
                            Delete Chapter
                        </button>
                        <button onclick="createChapter(${surveyId})" class="bg-lemon_yellow hover:bg-yellow-500 text-black py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                            Create Chapter
                        </button>
                    </div>

                    <div id="chapter-content-${surveyId}-${chapter.id}" class="hidden mt-2">
                        <p class="text-gray-400">Número de Capítulo: ${chapter.chapter_number}</p>
                        <!-- Contenedor de botones alineados en fila para preguntas -->
                        <div class="flex space-x-2 mb-2">
                            <div id="form-question-${chapter.id}"></div>
                            <button onclick="createQuestion(${surveyId}, ${chapter.id})" class="bg-lemon_yellow hover:bg-yellow-500 text-black py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                                Create Question
                            </button>
                        </div>

                        <div id="questions-container-${surveyId}-${chapter.id}" class="space-y-2 mt-2">
                            ${chapter.questions.map(question => `
                                <div class="question bg-gray-700 p-2 rounded-md">
                                    <p class="text-white font-semibold">${question.question_number}. ${question.question_text}</p>
                                    <!-- Contenedor de botones alineados en fila para cada pregunta -->
                                    <div class="flex space-x-2 mb-2">
                                        <button id="readButton" onclick="toggleQuestionDetails(${surveyId}, ${chapter.id}, ${question.id})" class="bg-neon_violet hover:bg-lime_green text-white py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                                            ${question.showDetails ? 'Hide' : 'Show'} Question Details
                                        </button>
                                        <button onclick="toggleEditQuestion(${surveyId}, ${chapter.id}, ${question.id})" class="bg-neon_violet hover:bg-lime_green text-white py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                                            Edit Question
                                        </button>
                                        <button id="adminButton" onclick="deleteQuestion(${question.id})" class="bg-bright_coral hover:bg-red-600 text-white py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600">
                                            Delete Question
                                        </button>
                                        <button onclick="createResponseOption(${surveyId}, ${chapter.id}, ${question.id})" class="bg-lemon_yellow hover:bg-yellow-500 text-black py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                                            Create Response 
                                        </button>
                                    </div>

                                    <div id="question-content-${surveyId}-${chapter.id}-${question.id}" class="hidden mt-2">
                                        <div id="response-options-container-${surveyId}-${chapter.id}-${question.id}" class="space-y-2 mt-2">
                                            ${question.responses.map(option => `
                                                <div class="response-option bg-gray-600 p-2 rounded-md">
                                                    <p class="text-white">${option.option_number}. ${option.option_text}</p>
                                                    <!-- Contenedor de botones alineados en fila para cada opción de respuesta -->
                                                    <div class="flex space-x-2 mb-2">
                                                        <button id="readButton" onclick="toggleResponseOptionDetails(${surveyId}, ${chapter.id}, ${question.id}, ${option.id})" class="bg-neon_violet hover:bg-lime_green text-white py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                                                            ${option.showDetails ? 'Hide' : 'Show'} Response Option Details
                                                        </button>
                                                        <button onclick="toggleEditResponseOption(${surveyId}, ${chapter.id}, ${question.id}, ${option.id})" class="bg-neon_violet hover:bg-lime_green text-white py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                                                            Edit Response Option
                                                        </button>
                                                        <button id="adminButton" onclick="deleteResponseOption(${option.id})" class="bg-bright_coral hover:bg-red-600 text-white py-1 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600">
                                                            Delete Response Option
                                                        </button>
                                                    </div>
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

// Funciones para Capítulos
function deleteChapter(chapterId) {
    fetch(`http://localhost:8080/api/chapters/${chapterId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`  
        }
    })
    .then(response => {
        if (response.ok) {
            // Opcional: Elimina el capítulo del DOM
            const chapterElement = document.getElementById(`chapter-${chapterId}`);
            if (chapterElement) {
                chapterElement.remove();
            }
            alert('Capítulo eliminado con éxito');
        } else {
            alert('Error al eliminar el capítulo');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud');
    });
}


function createChapter(surveyId) {
    // Muestra un formulario o un modal para que el usuario ingrese los detalles del nuevo capítulo
    const chapterTitle = prompt('Ingrese el título del nuevo capítulo:');
    const chapterNumber = prompt('Ingrese el número del nuevo capítulo:');
    const createdAt = new Date().toISOString(); // O usa una fecha específica si es necesario

    if (chapterTitle && chapterNumber) {
        const chapterRequest = {
            surveyId: surveyId,
            chapter_title: chapterTitle,
            chapter_number: chapterNumber,
            created_at: createdAt
        };

        fetch('http://localhost:8080/api/chapters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`  // Incluye el token si es necesario
            },
            body: JSON.stringify(chapterRequest)
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                // Opcional: Actualiza la interfaz de usuario para reflejar el nuevo capítulo
                alert('Capítulo creado con éxito');
                // Aquí puedes actualizar la lista de capítulos o agregar el nuevo capítulo al DOM
            } else {
                alert('Error al crear el capítulo');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            alert('Error en la solicitud');
        });
    } else {
        alert('Título y número del capítulo son obligatorios');
    }
}




function deleteQuestion(questionId) {
    console.log(`Eliminar pregunta con ID: ${questionId}`);
    

    if (confirm("¿Estás seguro de que deseas eliminar esta pregunta?")) {
        fetch(`http://localhost:8080/api/questions/${questionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (response.ok) {
                console.log(`Pregunta con ID ${questionId} eliminada.`);
                
                document.getElementById(`question-${questionId}`).remove(); 
            } else {
                console.error(`Error al eliminar la pregunta: ${response.statusText}`);
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
        });
    }
}


function createQuestion(surveyId, chapterId) {
    console.log(`Crear una nueva pregunta para el capítulo con ID: ${chapterId} en la encuesta con ID: ${surveyId}`);

    // Solicitar datos al usuario mediante prompt
    const questionText = prompt('Ingrese el texto de la pregunta:');
    if (!questionText) return; // Si el usuario cancela o no ingresa nada

    const questionNumber = prompt('Ingrese el número de la pregunta:');
    if (!questionNumber) return; // Si el usuario cancela o no ingresa nada

    const responseType = prompt('Ingrese el tipo de respuesta:');
    if (!responseType) return; // Si el usuario cancela o no ingresa nada

    const commentQuestion = prompt('Ingrese un comentario sobre la pregunta:');
    if (!commentQuestion) return; // Si el usuario cancela o no ingresa nada

    // Crear un objeto con los datos de la pregunta
    const questionData = {
        question_text: questionText,
        question_number: questionNumber,
        response_type: responseType,
        comment_question: commentQuestion,
        chapter_id: chapterId
    };

    console.log('Datos enviados:', JSON.stringify(questionData));

    // Enviar los datos al servidor
    fetch(`http://localhost:8080/api/questions/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(questionData)
    })
    .then(response => {
        console.log('Estado de la respuesta:', response.status);
        console.log('Encabezados de la respuesta:', response.headers);
        if (!response.ok) {
            return response.text().then(text => { throw new Error('Error en la solicitud: ' + text); });
        }
        return response.json();
    })
    .then(data => {
        console.log('Pregunta creada:', data);
    })
    .catch(error => {
        console.error('Error al crear la pregunta:', error);
    });
    
}




// Funciones para Opciones de Respuesta
function deleteResponseOption(optionId) {
    console.log(`Eliminar opción de respuesta con ID: ${optionId}`);
    // Aquí va la lógica para eliminar la opción de respuesta, como una llamada a la API
}

function createResponseOption(surveyId, chapterId, questionId) {
    console.log(`Crear una nueva opción de respuesta para la pregunta con ID: ${questionId} en el capítulo con ID: ${chapterId} de la encuesta con ID: ${surveyId}`);
    // Aquí va la lógica para crear una nueva opción de respuesta, como mostrar un formulario o hacer una llamada a la API
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

function adjustButtonVisibility() {
    // Obtener los roles del localStorage
    const userRoles = JSON.parse(localStorage.getItem('userRoles')) || [];

    // Obtener los botones
    const readButton = document.getElementById('readButton');
    const adminButton = document.getElementById('adminButton');

    // Verificar si el rol 'ADMIN' está presente
    if (userRoles.includes('ADMIN')) {
        // Mostrar ambos botones si el usuario es ADMIN
        readButton.style.display = 'block';
        adminButton.style.display = 'block';
    } else {
        // Mostrar solo el botón de lectura si no es ADMIN
        readButton.style.display = 'block';
        adminButton.style.display = 'none';
    }
}

// Llamar a la función para ajustar la visibilidad al cargar la página
adjustButtonVisibility();

document.addEventListener('DOMContentLoaded', getSurveys);
