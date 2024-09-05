// Función para mostrar/ocultar el formulario de edición del capítulo
function toggleEditChapter(surveyId, chapterId) {
    const chapterEditForm = document.getElementById(`edit-chapter-form-${surveyId}-${chapterId}`);
    chapterEditForm.classList.toggle('hidden');
    if (!chapterEditForm.classList.contains('hidden')) {
        generateEditChapterForm(surveyId, chapterId);
    }
}

// Función para generar el formulario de edición del capítulo
function generateEditChapterForm(surveyId, chapterId) {
    const formDiv = document.getElementById(`edit-chapter-form-${surveyId}-${chapterId}`);
    formDiv.innerHTML = `
        <h4 class="text-lg font-bold text-white mb-2">Editar Capítulo</h4>
        <form id="update-chapter-form-${surveyId}-${chapterId}">
            <div class="mb-4">
                <label for="edit-chapter-title-${surveyId}-${chapterId}" class="block text-white font-semibold">Título del Capítulo:</label>
                <input type="text" id="edit-chapter-title-${surveyId}-${chapterId}" class="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-md">
            </div>
            <div class="mb-4">
                <label for="edit-chapter-number-${surveyId}-${chapterId}" class="block text-white font-semibold">Número del Capítulo:</label>
                <input type="number" id="edit-chapter-number-${surveyId}-${chapterId}" class="w-full p-2 border border-gray-600 bg-gray-800 text-white rounded-md">
            </div>
            <button type="button" onclick="updateChapter(${surveyId}, ${chapterId})" class="bg-neon_violet hover:bg-lime_green text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                Save Changes
            </button>
        </form>
    `;
    loadChapterData(surveyId, chapterId);
}

async function loadChapterData(surveyId, chapterId) {
    const chapterUrl = `http://localhost:8080/api/surveys/${surveyId}/chapters/${chapterId}`;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(chapterUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const chapter = await response.json();
        populateEditChapterForm(surveyId, chapterId, chapter);
    } catch (error) {
        console.error('Error al cargar los datos del capítulo:', error);
    }
}

function populateEditChapterForm(surveyId, chapterId, chapter) {
    document.getElementById(`edit-chapter-title-${surveyId}-${chapterId}`).value = chapter.chapter_title;
    document.getElementById(`edit-chapter-number-${surveyId}-${chapterId}`).value = chapter.chapter_number;
}

async function updateChapter(surveyId, chapterId) {
    const title = document.getElementById(`edit-chapter-title-${surveyId}-${chapterId}`).value;
    const number = document.getElementById(`edit-chapter-number-${surveyId}-${chapterId}`).value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:8080/api/surveys/${surveyId}/chapters/${chapterId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ chapter_title: title, chapter_number: number })
        });

        if (response.ok) {
            alert('Capítulo actualizado correctamente');
            getSurveys(); // Actualizar la lista de encuestas
        } else {
            throw new Error('Error al actualizar el capítulo');
        }
    } catch (error) {
        console.error('Error al actualizar el capítulo:', error);
    }
}

// Agrega definiciones similares para toggleEditQuestion y toggleEditResponseOption
