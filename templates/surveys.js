// Verifica el contenido del localStorage
console.log('Token en localStorage:', localStorage.getItem('token'));

// Tu función para obtener categorías
async function getCategories() {
    const getCategoriesUrl = 'http://localhost:8080/api/surveys';
    
    const token = localStorage.getItem('token'); // Asegúrate de usar la clave correcta
    
    try {
        const response = await fetch(getCategoriesUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluye el token en el encabezado
            }
        });
        
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Network response was not ok: ${response.statusText} - ${text}`);
        }
        
        const data = await response.json();
        displaySurveys(data);
        console.log('Datos de categorías:', data);
        return data; // Asegúrate de retornar los datos para usarlos fuera de la función
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error; // Propaga el error para manejarlo más arriba si es necesario
    }
}

function displaySurveys(data) {
    const surveysListDiv = document.getElementById('survey-list');
    if (data.length === 0) {
        surveysListDiv.innerHTML = '<p>No hay encuestas disponibles.</p>';
    } else {
        const list = document.createElement('ul');
        data.forEach(survey => { // Cambiado de `element` a `survey`
            const ele = document.createElement('li');
            ele.className = 'survey-item';
            ele.innerHTML = `
                <h2>${survey.name}</h2>
                <p><strong>Descripción:</strong> ${survey.description}</p>
                <p><strong>Publicado:</strong> ${survey.published ? 'Sí' : 'No'}</p>
                <p><strong>Fecha de Creación:</strong> ${new Date(survey.created_at).toLocaleDateString()}</p>
                <p><strong>Fecha de Actualización:</strong> ${survey.update_at ? new Date(survey.update_at).toLocaleDateString() : 'No disponible'}</p>
            `;
            list.appendChild(ele);
        });
        surveysListDiv.appendChild(list);
    }
}

(async () => {
    try {
        const el = await getCategories();
        console.log('Datos obtenidos:', el); // Asegúrate de que `el` esté definido correctamente
    } catch (error) {
        console.error('Error handling the fetched categories:', error);
    }
})();
