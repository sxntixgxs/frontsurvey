document.getElementById('registerButton').addEventListener('click',()=>{
    const elements = document.querySelectorAll('.oculto');
    elements.forEach(e=>{
        e.classList.remove("oculto")
    })
    const elementsLogin = document.querySelectorAll('.loginElement').forEach(e=>{
        e.classList.add("oculto")
    })
});