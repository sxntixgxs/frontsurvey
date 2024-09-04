// Función para enviar los datos de login
function sendLoginData(data) {
    fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login fallido');
        }
        return response.json();
    })
    .then(data => {
        console.log('Login exitoso:', data);
        handleLoginSuccess(data);
    })
    .catch(error => {
        console.error('Error en el login:', error);
        showLoginError('Credenciales incorrectas. Inténtalo de nuevo.');
    });
}

// Función para obtener los datos del formulario de login
function getLoginFormData() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        const formData = {
            "username": username,
            "password": password
        };
        return JSON.stringify(formData);
    } else {
        console.error('Todos los campos son necesarios para el login.');
        return null;
    }
}

// Función para manejar el éxito del login
function handleLoginSuccess(data) {
    localStorage.setItem('token', data.token);
    window.location.href = '/templates/survey.html'; // Redirigir a survey.html
}

// Función para mostrar el mensaje de error de login
function showLoginError(message) {
    let errorMessage = document.getElementById('loginErrorMessage');
    
    if (!errorMessage) {
        errorMessage = document.createElement('span');
        errorMessage.id = 'loginErrorMessage';
        errorMessage.classList.add('text-red-500', 'mt-2');
        const form = document.querySelector('#loginForm form');
        form.appendChild(errorMessage);
    }

    errorMessage.textContent = message;
}

// Añadir el event listener al botón de login
document.getElementById('loginButton').addEventListener('click', function(e) {
    e.preventDefault();
    const data = getLoginFormData();
    if (data) {
        sendLoginData(data);
    }
});
