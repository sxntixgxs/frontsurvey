// scripts.js
const loginForm = document.getElementById('loginForm');
const formTitle = document.getElementById('formTitle');
const switchFormLink = document.getElementById('switchForm');
const submitButton = document.getElementById('submitButton');
const errorMessage = document.getElementById('errorMessage');
let isLoginForm = true;

// Function to switch between login and registration forms
function switchForm() {
    isLoginForm = !isLoginForm;
    formTitle.textContent = isLoginForm ? 'Login' : 'Register';
    switchFormLink.textContent = isLoginForm ? 'Register' : 'Back to Login';
    submitButton.textContent = isLoginForm ? 'Sign in' : 'Register';
    errorMessage.classList.add('hidden');
    loginForm.reset();
}

switchFormLink.addEventListener('click', function(e) {
    e.preventDefault();
    switchForm();
});

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Username validation (at least 3 characters)
    if (username.length < 3) {
        errorMessage.textContent = 'Username must be at least 3 characters long.';
        errorMessage.classList.remove('hidden');
        return;
    }
    
    // Password validation (at least 8 characters)
    if (password.length < 8) {
        errorMessage.textContent = 'Password must be at least 8 characters long.';
        errorMessage.classList.remove('hidden');
        return;
    }
    
    // If validation passes, prepare data for sending to the server
    const data = { 
        "username":username, 
        "password":password,
        "role":"USER" };
    
    // Determine which endpoint to use based on the current form
    const endpoint = isLoginForm ? 'http://localhost:8080/auth/login' : 'http://localhost:8080/auth/register';
    
    // Here you would typically send this data to your server
    console.log(`Attempting to ${isLoginForm ? 'login' : 'register'}:`, data);
    console.log(`Endpoint: ${endpoint}`);
    
    // Simulating a server request
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            // Para el registro, la respuesta es un string, no JSON
            return isLoginForm ? response.json() : response.text();
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .then(result => {
        if (isLoginForm) {
            localStorage.setItem('authToken', result.token)
            alert('Login successful');
            window.location.href = "templates/survey.html";
        } else {
            if (result === 'User saved') {
                alert('Registration successful');
                switchForm(); // Opcional: cambiar al formulario de login después del registro exitoso
            } else {
                throw new Error('Unexpected response from server');
            }
        }
        loginForm.reset();
        errorMessage.classList.add('hidden');
    })
    .catch(error => {
        console.error('Error:', error);
        errorMessage.textContent = `${isLoginForm ? 'Login' : 'Registration'} failed. Please try again.`;
        errorMessage.classList.remove('hidden');
    });
});


function fetchWithAuth(url,options = {}){
    const token = localStorage.getItem('authToken');
    if(token){
        options.headers = {...options.headers, 'Authorization': `Bearer ${token}`};
    }
    return fetch(url, options);
}
