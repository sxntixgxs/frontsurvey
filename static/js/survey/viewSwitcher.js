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

// Mostrar vista de crear encuesta
document.querySelector('[data-view="create-survey"]').addEventListener('click', function() {
    showView('view-survey-form');
    document.getElementById('form-title').textContent = 'Crear Encuesta';
});

// Mostrar vista de encuestas
document.querySelector('[data-view="surveys"]').addEventListener('click', function() {
    showView('view-surveys');
    loadSurveys(); // Cargar encuestas al mostrar la vista
});
