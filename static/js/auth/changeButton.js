// Función para mostrar el formulario de registro y ocultar el de login
function showRegisterForm() {
    document.getElementById('loginForm').classList.add('oculto');
    document.getElementById('registerForm').classList.remove('oculto');
}

// Función para mostrar el formulario de login y ocultar el de registro
function showLoginForm() {
    document.getElementById('registerForm').classList.add('oculto');
    document.getElementById('loginForm').classList.remove('oculto');
}

// Añadir el event listener al botón para cambiar al formulario de registro
document.getElementById('switchToRegisterButton').addEventListener('click', function() {
    showRegisterForm();
});

// Añadir el event listener al botón para cambiar al formulario de login
document.getElementById('switchToLoginButton').addEventListener('click', function() {
    showLoginForm();
});
