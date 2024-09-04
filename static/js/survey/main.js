document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirigir al login si no hay token
        window.location.href = '/index.html';
    } else {
        // Mostrar la vista de encuestas si hay token
        showView('view-surveys');
        loadSurveys(); // Cargar encuestas al iniciar
    }
});

// Añadir funcionalidad de logout
document.getElementById('logout').addEventListener('click', function() {
    localStorage.removeItem('token');
    window.location.href = '/index.html'; // Redirigir al inicio de sesión
});
