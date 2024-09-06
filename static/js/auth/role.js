function storeRolesFromToken() {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
        try {
            // Decodificar el token usando el script cargado desde el CDN
            const decodedToken = jwt_decode(token);
            
            // Extraer los roles del token
            const userRoles = decodedToken.roles || [];
            
            // Guardar los roles en el localStorage
            localStorage.setItem('userRoles', JSON.stringify(userRoles));
        } catch (error) {
            console.error('Error al decodificar el token:', error);
        }
    } else {
        console.warn('No hay token en el localStorage');
    }
}

// Llamar a la función para almacenar los roles
storeRolesFromToken();