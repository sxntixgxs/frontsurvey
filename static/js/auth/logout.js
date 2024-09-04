document.getElementById("logout").addEventListener("click", function(){
    console.log("logout");
    localStorage.removeItem("token");
    window.location.href = "../index.html";
});
