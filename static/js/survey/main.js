document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/index.html';
    } else {
        showView('view-surveys');
        loadSurveys(); // Cargar encuestas al iniciar
    }
});
