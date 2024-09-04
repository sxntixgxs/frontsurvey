document.getElementById('loginButton').addEventListener('click',()=>{
    const elements = document.querySelectorAll('.oculto');
    elements.forEach(e=>{
        e.classList.remove("oculto")
    })
    const elementsLogin = document.querySelectorAll('.registerElement').forEach(e=>{
        e.classList.add("oculto")
    })
});