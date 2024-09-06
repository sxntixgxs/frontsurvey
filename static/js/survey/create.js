document.addEventListener('DOMContentLoaded', function () {
    const createSurveyButton = document.getElementById('createSurvey');
    let formVisible = false;

    createSurveyButton.addEventListener('click', function () {
        if (formVisible) {
            hideCreateSurveyForm();
        } else {
            showCreateSurveyForm();
        }
        formVisible = !formVisible;
    });
});

function showCreateSurveyForm() {
    // Crea el formulario dinámicamente
    const formHTML = `
        <form id="createSurveyForm" class="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 class="text-xl font-bold text-white mb-4">Create New Survey</h2>
            <label for="name" class="block text-white mb-2">Survey Name:</label>
            <input type="text" id="name" name="name" class="w-full p-2 mb-4 rounded border border-gray-600 bg-gray-800 text-white" required>
            <label for="description" class="block text-white mb-2">Survey Description:</label>
            <textarea id="description" name="description" class="w-full p-2 mb-4 rounded border border-gray-600 bg-gray-800 text-white" required></textarea>
            <label for="published" class="block text-white mb-2">Published:</label>
            <input type="checkbox" id="published" name="published" class="mb-4">
            <button type="submit" class="bg-neon_violet hover:bg-lime_green text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">Submit</button>
            <button type="button" id="cancelForm" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 mt-4">Cancel</button>
        </form>
    `;

    // Inserta el formulario en el contenedor deseado
    const surveyList = document.getElementById('survey-list');
    surveyList.innerHTML = formHTML;

    // Añade el evento para el envío del formulario
    document.getElementById('createSurveyForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío por defecto del formulario

        // Recolecta los datos del formulario
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const published = document.getElementById('published').checked;

        const token = localStorage.getItem('token');

        // Crea el objeto JSON
        const surveyData = {
            name: name,
            description: description,
            published: published
        };

        // Envia los datos al servidor
        fetch('http://localhost:8080/api/surveys/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(surveyData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Survey created successfully!');
            window.location.href = 'surveySection.html'; // Redirige a surveySection.html
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to create survey.');
        });
    });

    // Añade el evento para cancelar el formulario
    document.getElementById('cancelForm').addEventListener('click', function () {
        hideCreateSurveyForm();
    });
}

function hideCreateSurveyForm() {
    // Reemplaza el contenido de survey-list con el contenido original o el estado deseado
    document.getElementById('survey-list').innerHTML = `
        <!-- Ejemplo de encuesta con capítulos editables -->
        <div class="survey-card bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <h2 class="text-xl font-bold text-white">Survey Title</h2>
            <p class="text-gray-400">Survey Description</p>
            <div class="chapters mt-4">
                <!-- Ejemplo de capítulo -->
                <div class="chapter mb-4">
                    <h3 class="text-lg font-semibold text-white">Chapter Title</h3>
                    <button onclick="toggleEditChapter(1, 1)" class="bg-neon_violet hover:bg-lime_green text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">Edit Chapter</button>
                    <div id="edit-chapter-form-1-1" class="edit-chapter-form hidden"></div>
                </div>
                <!-- Más capítulos aquí -->
            </div>
        </div>
        <!-- Más encuestas aquí -->
    `;
}
