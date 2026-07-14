let temaActual = localStorage.getItem("tema") || "light";
const btnTema = document.getElementById("btnTema");
const spinner = document.getElementById("carga-spinner");
const contenido = document.getElementById("contenido-principal");
document.documentElement.setAttribute("data-bs-theme", temaActual);

btnTema.addEventListener("click", function(e){
    e.preventDefault();
    temaActual = (temaActual === "light") ? "dark" : "light"; 
    document.documentElement.setAttribute("data-bs-theme", temaActual);
    localStorage.setItem("tema", temaActual);
});

function cargarPagina() {
    setTimeout(() => {
        spinner.style.display = "none";
        contenido.style.display = "block";
    }, 1500);
}

cargarPagina();
