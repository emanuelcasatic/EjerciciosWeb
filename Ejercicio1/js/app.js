let temaActual = localStorage.getItem("tema") || "light";
const btnTema = document.getElementById("btnTema");
const spinner = document.getElementById("carga-spinner");
const contenido = document.getElementById("contenido-principal");
const frmContacto = document.getElementById("frmContacto");
const enviadoToast = document.getElementById("enviadoToast");
const errorToast = document.getElementById("errorToast");
document.documentElement.setAttribute("data-bs-theme", temaActual);

btnTema.addEventListener("click", function (e) {
  e.preventDefault();
  temaActual = temaActual === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-bs-theme", temaActual);
  localStorage.setItem("tema", temaActual);
});

frmContacto.addEventListener("submit", function (e) {
  e.preventDefault();
  const nombreInput = document.getElementById("nombre");
  const correoInput = document.getElementById("correo");
  const telefonoInput = document.getElementById("telefono");
  const mensajeInput = document.getElementById("mensaje");
  const confirmarInput = document.getElementById("confirmarTerminos");

  if (
    nombreInput.value.trim() === "" ||
    correoInput.value.trim() === "" ||
    telefonoInput.value.trim() === "" ||
    mensajeInput.value.trim() === "" ||
    confirmarInput.checked === false
  ) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(errorToast);
    toastBootstrap.show();
  } else {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(enviadoToast);
    nombreInput.value = "";
    correoInput.value = "";
    telefonoInput.value = ""; 
    mensajeInput.value = "";
    confirmarInput.checked = false;
    toastBootstrap.show();
  }
});

function cargarPagina() {
  setTimeout(() => {
    spinner.style.display = "none";
    contenido.style.display = "block";
  }, 1500);
}

cargarPagina();
