// Función para enviar los datos de registro
function sendRegisterData(data) {
    fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })
    .then(response => response.text())  // Cambiar a text() para manejar respuestas de texto
    .then(message => {
        console.log('Registro exitoso:', message);
        showRegisterSuccess(message);  // Mostrar el mensaje recibido
        showLoginForm();  // Cambiar a la vista de login
    })
    .catch(error => {
        console.error('Error en el registro:', error);
        showRegisterError('Error al registrar el usuario. Inténtalo de nuevo.');
    });
}

// Función para obtener los datos del formulario de registro
function getRegisterFormData() {
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;

    if (username && password) {
        const formData = {
            "username": username,
            "password": password,
            "role": "USER"
        };
        return JSON.stringify(formData);
    } else {
        console.error('Todos los campos son necesarios para el registro.');
        return null;
    }
}

// Función para mostrar el mensaje de éxito de registro
function showRegisterSuccess(message) {
    alert(message);  // Mostrar el mensaje como un alert
}

// Función para mostrar el mensaje de error de registro
function showRegisterError(message) {
    alert(message);  // Mostrar el mensaje de error como un alert
}

// Función para mostrar el formulario de login y ocultar el de registro
function showLoginForm() {
    document.getElementById('registerForm').classList.add('oculto');
    document.getElementById('loginForm').classList.remove('oculto');
}

// Añadir el event listener al botón de registro
document.getElementById('registerButton').addEventListener('click', function(e) {
    e.preventDefault();
    const data = getRegisterFormData();
    if (data) {
        sendRegisterData(data);
    }
});
