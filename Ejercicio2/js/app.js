class Evento {
    constructor(
        codigo,
        nombre,
        lugar,
        fecha,
        hora,
        categoria,
        cupos,
        descripcion,
    ) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.lugar = lugar;
        this.fecha = fecha;
        this.hora = hora;
        this.categoria = categoria;
        this.cupos = cupos;
        this.descripcion = descripcion;
    }
}
const listaDeEventos = JSON.parse(localStorage.getItem("listaDeEventos")) || [];
let renderizado = "cards";
const frmEvento = document.getElementById("frmEvento");
const frmEditar = document.getElementById("frmEditarEvento");
const exitoToast = document.getElementById("toastExito");
const errorToast = document.getElementById("toastError");
const exitoEliminarToast = document.getElementById("toastExitoEliminar");
const codigoToast = document.getElementById("toastCodigo");
const contenedorEventos = document.getElementById("contenedorEventos");
const filtroInput = document.getElementById("inputBuscar");
const fechaInput = document.getElementById("filtroFecha");
const btnBuscar = document.getElementById("btnBuscar");
const btnOrdenar = document.getElementById("btnAplicarFiltros");
const selectOrdenar = document.getElementById("selectOrdenar");
const btnCards = document.getElementById("btnVistaCartas");
const btnTabla = document.getElementById("btnVistaTabla");
const modalAgregarEvento = document.getElementById("modalAgregarEvento");
const modalEditarEvento = document.getElementById("modalEditarEvento");
const modalEliminarEvento = document.getElementById("modalEliminarEvento");
const btnEliminar = document.getElementById("btnEliminarEvento");
const codEventoEliminar = document.getElementById("codEventoEliminar");
let filtro = "";
let categoriaBuscar = "Todas";
let fechaBuscar = "";
let paginaActual = 1;

frmEvento.addEventListener("submit", function (e) {
    e.preventDefault();
    const codigo = document.getElementById("codigo");
    const nombre = document.getElementById("nombre");
    const lugar = document.getElementById("lugar");
    const fecha = document.getElementById("fecha");
    const hora = document.getElementById("hora");
    const categoria = document.getElementById("categoria");
    const cupos = document.getElementById("cupos");
    const descripcion = document.getElementById("descripcion");

    if (
        validarCampos(
            codigo.value,
            nombre.value,
            lugar.value,
            fecha.value,
            hora.value,
            categoria.value,
            cupos.value,
            descripcion.value,
        )
    ) {
        if (listaDeEventos != null && listaDeEventos.length > 0) {
            const eventoConMismoId = listaDeEventos.find(
                (e) => e.codigo.toLowerCase() === codigo.value.toLowerCase(),
            );
            if (eventoConMismoId) {
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(codigoToast);
                toastBootstrap.show();
                return;
            }
        }

        const evento = new Evento(
            codigo.value,
            nombre.value,
            lugar.value,
            fecha.value,
            hora.value,
            categoria.value,
            cupos.value,
            descripcion.value,
        );
        listaDeEventos.push(evento);
        localStorage.setItem("listaDeEventos", JSON.stringify(listaDeEventos));
        limpiarFormularioEventos(
            codigo,
            nombre,
            lugar,
            fecha,
            hora,
            categoria,
            cupos,
            descripcion,
        );
        const modal = bootstrap.Modal.getInstance(modalAgregarEvento);
        modal.hide();
        cargarDatos(categoriaBuscar, filtro, fechaBuscar, selectOrdenar.value);
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(exitoToast);
        toastBootstrap.show();
    } else {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(errorToast);
        toastBootstrap.show();
    }
});

frmEditar.addEventListener("submit", function (e) {
    e.preventDefault();
    const codigoActualEditar = document.getElementById("codigoActualEditar");
    const codigo = document.getElementById("codigoEditar");
    const nombre = document.getElementById("nombreEditar");
    const lugar = document.getElementById("lugarEditar");
    const fecha = document.getElementById("fechaEditar");
    const hora = document.getElementById("horaEditar");
    const categoria = document.getElementById("categoriaEditar");
    const cupos = document.getElementById("cuposEditar");
    const descripcion = document.getElementById("descripcionEditar");

    if (
        validarCampos(
            codigo.value,
            nombre.value,
            lugar.value,
            fecha.value,
            hora.value,
            categoria.value,
            cupos.value,
            descripcion.value,
        )
    ) {
        if (listaDeEventos != null && listaDeEventos.length > 0) {
            const eventoConMismoId = listaDeEventos.find(
                (e) =>
                    e.codigo.toLowerCase() === codigo.value.toLowerCase() &&
                    e.codigo.toLowerCase() !== codigoActualEditar.value.toLowerCase(),
            );
            if (eventoConMismoId) {
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(codigoToast);
                toastBootstrap.show();
                return;
            }
            const indexDelActual = listaDeEventos.findIndex(
                (e) =>
                    e.codigo.toLowerCase() === codigoActualEditar.value.toLowerCase(),
            );

            if (indexDelActual >= 0) {
                listaDeEventos[indexDelActual] = new Evento(
                    codigo.value,
                    nombre.value,
                    lugar.value,
                    fecha.value,
                    hora.value,
                    categoria.value,
                    cupos.value,
                    descripcion.value
                );
                localStorage.setItem("listaDeEventos", JSON.stringify(listaDeEventos));
                codigoActualEditar.value = "";
                limpiarFormularioEventos(
                    codigo,
                    nombre,
                    lugar,
                    fecha,
                    hora,
                    categoria,
                    cupos,
                    descripcion,
                );
                const modal = bootstrap.Modal.getInstance(modalEditarEvento);
                modal.hide();
                cargarDatos(categoriaBuscar, filtro, fechaBuscar, selectOrdenar.value);
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(exitoToast);
                toastBootstrap.show();
            }
        }
    } else {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(errorToast);
        toastBootstrap.show();
    }
});

btnBuscar.addEventListener("click", function (e) {
    e.preventDefault();

    filtro = filtroInput.value;
    cargarDatos(categoriaBuscar, filtro, fechaBuscar);
});

btnOrdenar.addEventListener("click", function (e) {
    e.preventDefault();

    filtro = filtroInput.value;
    fechaBuscar = fechaInput.value;
    console.log(fechaBuscar);
    cargarDatos(categoriaBuscar, filtro, fechaBuscar, selectOrdenar.value);
});

btnEliminar.addEventListener("click", function (e) {
    e.preventDefault();
    console.log(codEventoEliminar.textContent)
    let listaNueva = listaDeEventos.filter(e => e.codigo != codEventoEliminar.textContent);
    listaDeEventos.length = 0;
    listaNueva.forEach(e => listaDeEventos.push(e));
    localStorage.setItem("listaDeEventos", JSON.stringify(listaDeEventos));
    const toast = bootstrap.Toast.getOrCreateInstance(exitoEliminarToast);
    toast.show();
    const modal = bootstrap.Modal.getInstance(modalEliminarEvento);
    modal.hide();
    cargarDatos(categoriaBuscar, filtro, fechaBuscar, selectOrdenar.value);
});

btnCards.addEventListener("click", function (e) {
    e.preventDefault();

    btnCards.classList.add("active");
    btnTabla.classList.remove("active");
    renderizado = "cards";
    cargarDatos(categoriaBuscar, filtro, fechaBuscar, selectOrdenar.value);

});

btnTabla.addEventListener("click", function (e) {
    e.preventDefault();

    btnTabla.classList.add("active");
    btnCards.classList.remove("active");
    renderizado = "table";
    cargarDatos(categoriaBuscar, filtro, fechaBuscar, selectOrdenar.value);

});


function validarCampos(
    codigo,
    nombre,
    lugar,
    fecha,
    hora,
    categoria,
    cupos,
    descripcion,
) {
    if (
        codigo.trim() === "" ||
        nombre.trim() === "" ||
        lugar.trim() === "" ||
        categoria.trim() === "" ||
        descripcion.trim() === "" ||
        hora.trim() === ""
    ) {
        return false;
    }

    if (cupos <= 0) {
        return false;
    }
    const tiempo = hora.split(":");

    if (tiempo.length < 2) {
        return false;
    }
    const partesFecha = fecha.split("-");
    if (partesFecha.length < 3) {
        return false;
    }

    const fechaEspecifica = new Date(
        Number(partesFecha[0]),
        Number(partesFecha[1]) - 1,
        Number(partesFecha[2]),
        Number(tiempo[0]),
        Number(tiempo[1]),
        0
    );

    const fechaActual = new Date();
    if (fechaEspecifica.getTime() < fechaActual.getTime()) {
        return false;
    }

    return true;
}

function limpiarFormularioEventos(
    codigo,
    nombre,
    lugar,
    fecha,
    hora,
    categoria,
    cupos,
    descripcion,
) {
    codigo.value = "";
    nombre.value = "";
    lugar.value = "";
    fecha.value = "";
    hora.value = "";
    categoria.value = "";
    cupos.value = "";
    descripcion.value = "";
}

function obtenerFechaLocal(fechaString) {
    const partes = fechaString.split("-");
    if (partes.length < 3) { return new Date() }
    return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]), 0, 0, 0, 0);
}

function filtrarEventos(lista, categoria, filtro, fecha, ordenarPor) {
    let listaFiltrada = [...lista];

    let filtroFormateado = filtro.trim().toLowerCase();
    let categoriaFormateada = categoria.trim().toLowerCase();

    if (categoriaFormateada !== "todas" && categoriaFormateada !== "") {
        listaFiltrada = listaFiltrada.filter(e => e.categoria.toLowerCase() === categoriaFormateada);
    }

    if (filtroFormateado !== "") {
        listaFiltrada = listaFiltrada.filter(e =>
            e.nombre.toLowerCase().includes(filtroFormateado) ||
            e.codigo.toLowerCase().includes(filtroFormateado) ||
            e.descripcion.toLowerCase().includes(filtroFormateado) ||
            e.lugar.toLowerCase().includes(filtroFormateado)
        );
    }

    if (fecha.trim() !== "") {
        const fechaDesde = obtenerFechaLocal(fecha);

        listaFiltrada = listaFiltrada.filter(e => {
            const fechaEvento = obtenerFechaLocal(e.fecha);
            return fechaEvento.getTime() >= fechaDesde.getTime();
        });
    }

    if (ordenarPor !== "" && listaFiltrada.length > 0) {
        listaFiltrada.sort((e, f) => {
            switch (ordenarPor) {
                case "fechaAsc":
                    const tiempoE_Asc = obtenerFechaLocal(e.fecha).getTime();
                    const tiempoF_Asc = obtenerFechaLocal(f.fecha).getTime();
                    return tiempoE_Asc - tiempoF_Asc;
                case "fechaDesc":
                    const tiempoE_Desc = obtenerFechaLocal(e.fecha).getTime();
                    const tiempoF_Desc = obtenerFechaLocal(f.fecha).getTime();
                    return tiempoF_Desc - tiempoE_Desc;
                case "nombreAsc":
                    return e.nombre.localeCompare(f.nombre);
            }
        });
    }

    return listaFiltrada;
}

function cargarDatos(categoria = "Todas", filtro = "", fecha = "", ordenarPor = "") {
    contenedorEventos.innerHTML = "";
    if (listaDeEventos.length <= 0) {
        contenedorEventos.innerHTML = `
            <div class="container-fluid text-center mt-5"> 
                <h2 class="text-muted"> No hay eventos aún. </h2>
            </div>`;
        return;
    }
    let listaDeEventosFiltrada = filtrarEventos(listaDeEventos, categoria, filtro, fecha, ordenarPor);
    const eventosPorPagina = 6;
    const cantidadDePaginas = Math.ceil(listaDeEventosFiltrada.length / eventosPorPagina);
    const i = (paginaActual - 1) * eventosPorPagina;
    const j = Math.min(i + eventosPorPagina, listaDeEventosFiltrada.length);
    const paginacion = document.getElementById("paginacion");
    paginacion.innerHTML = "";

    let listaPartida = listaDeEventosFiltrada.slice(i, j);
    console.log(listaPartida);


    if (listaPartida.length > 0) {
        let htmlPaginacion = `<li class="page-item ${(paginaActual - 1 <= 0) ? 'disabled' : ''}">
                            <button ${(paginaActual - 1 <= 0) ? '' : `onclick="cambiarPagina('${paginaActual - 1}')"`}" class="page-link">Anterior</button>
                        </li>`;
        for (let cont = 0; cont < cantidadDePaginas; cont++) {
            htmlPaginacion += `
                        <li class="page-item ${(paginaActual - 1 == cont) ? 'active' : ''}">
                            <button onclick="cambiarPagina('${cont + 1}')" class="page-link">${cont + 1}</button>
                        </li>   
            `;
        }

        htmlPaginacion += `<li class="page-item ${(paginaActual + 1 > cantidadDePaginas) ? 'disabled' : ''}">
                              <button ${(paginaActual + 1 > cantidadDePaginas) ? '' : `onclick="cambiarPagina('${paginaActual + 1}')"`}" class="page-link">Siguiente</button>
                        </li>`

        paginacion.innerHTML = htmlPaginacion;

        if (renderizado !== "table") {
            let htmlCartas = `<div class="row g-4" id="vistaCartas">`;

            listaPartida.forEach((e) => {
                htmlCartas += `
                <div class="col-12 col-md-6 col-xl-4">
                    <div class="card h-100 shadow-sm border-0 custom-card-hover">
                        <!-- Todo el interior de tu card se mantiene intacto -->
                        <div class="card-body">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="badge bg-secondary">${e.codigo}</span>
                                <span class="badge bg-primary">${e.categoria}</span>
                            </div>
                            <h5 class="card-title text-custom-title fw-bold">${e.nombre}</h5>
                            <h6 class="card-subtitle mb-3 text-muted"><i class="bi bi-geo-alt"></i> ${e.lugar}</h6>
                            <p class="card-text mb-1"><i class="bi bi-calendar-event text-primary"></i> ${e.fecha} - ${e.hora}</p>
                            <p class="card-text"><i class="bi bi-people text-primary"></i> Cupos: ${e.cupos}</p>
                        </div>
                        <div class="card-footer bg-white border-top d-flex justify-content-between align-items-center">
                            <button onclick="cargarDetalles('${e.codigo}')" class="btn btn-sm btn-outline-primary" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDetalle">Detalles</button>
                            <div class="btn-group">
                                <button onclick="editarEvento('${e.codigo}')" class="btn btn-sm btn-outline-warning" data-bs-toggle="modal" data-bs-target="#modalEditarEvento" title="Editar">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button onclick="eliminarEvento('${e.codigo}')" data-bs-toggle="modal" data-bs-target="#modalEliminarEvento" class="btn btn-sm btn-outline-danger" title="Eliminar">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
            });
            htmlCartas += `</div>`;

            contenedorEventos.innerHTML = htmlCartas;
        } else {
            let htmlTabla = `<div class="table-responsive bg-white p-3 rounded shadow-sm" id="vistaTabla">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Fecha y Hora</th>
                                    <th>Categoría</th>
                                    <th>Cupos</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>`;

            listaPartida.forEach(e => {
                htmlTabla += `
                                <tr>
                                    <td><span class="badge bg-secondary">${e.codigo}</span></td>
                                    <td class="fw-bold text-custom-title">
                                        ${e.nombre}
                                    </td>
                                    <td>${e.fecha} - ${e.hora}</td>
                                    <td><span class="badge bg-primary">${e.categoria}</span></td>
                                    <td>${e.cupos}</td>
                                    <td>
                                        <button onclick="cargarDetalles('${e.codigo}')" class="btn btn-sm btn-outline-primary" data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasDetalle" title="Ver Detalles">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                        <button onclick="editarEvento('${e.codigo}')" data-bs-toggle="modal" data-bs-target="#modalEditarEvento" class="btn btn-sm btn-outline-warning" title="Editar">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button onclick="eliminarEvento('${e.codigo}')" data-bs-toggle="modal" data-bs-target="#modalEliminarEvento" class="btn btn-sm btn-outline-danger" title="Eliminar">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                `
            });

            htmlTabla += `</tbody>
                        </table>
                    </div>`

            contenedorEventos.innerHTML = htmlTabla;
        }
    } else {
        contenedorEventos.innerHTML = `
            <div class="container-fluid text-center mt-5"> 
                <h2 class="text-muted"> No hay eventos aún. </h2>
            </div>`;

        paginacion.innerHTML += `<p>Para paginación agrega eventos o filtra los que están.</p>`;
    }
}

function editarEvento(codigoActual) {
    const codigoActualEditar = document.getElementById("codigoActualEditar");
    const codigo = document.getElementById("codigoEditar");
    const nombre = document.getElementById("nombreEditar");
    const lugar = document.getElementById("lugarEditar");
    const fecha = document.getElementById("fechaEditar");
    const hora = document.getElementById("horaEditar");
    const categoria = document.getElementById("categoriaEditar");
    const cupos = document.getElementById("cuposEditar");
    const descripcion = document.getElementById("descripcionEditar");

    const eventoActual = listaDeEventos.find((e) => e.codigo === codigoActual);
    codigoActualEditar.value = eventoActual.codigo;
    codigo.value = eventoActual.codigo;
    nombre.value = eventoActual.nombre;
    lugar.value = eventoActual.lugar;
    fecha.value = eventoActual.fecha;
    hora.value = eventoActual.hora;
    categoria.value = eventoActual.categoria;
    cupos.value = eventoActual.cupos;
    descripcion.value = eventoActual.descripcion;
}

function eliminarEvento(codigoActual) {
    codEventoEliminar.innerText = codigoActual;
}

function cargarDetalles(codigoActual) {
    const nombre = document.getElementById("detNombre");
    const codigo = document.getElementById("detCodigo");
    const categoria = document.getElementById("detCategoria");
    const lugar = document.getElementById("detLugar");
    const fecha = document.getElementById("detFecha");
    const hora = document.getElementById("detHora");
    const cupos = document.getElementById("detCupos");
    const descripcion = document.getElementById("detDescripcion");

    const eventoDetalles = listaDeEventos.find(e => e.codigo == codigoActual);

    if (eventoDetalles) {
        nombre.innerText = eventoDetalles.nombre;
        codigo.innerText = eventoDetalles.codigo;
        categoria.innerText = eventoDetalles.categoria;
        lugar.innerText = eventoDetalles.lugar;
        fecha.innerText = eventoDetalles.fecha;
        hora.innerText = eventoDetalles.hora;
        cupos.innerText = eventoDetalles.cupos;
        descripcion.innerText = eventoDetalles.descripcion;
    } else {
        nombre.innerText = "Error al cargar o inexistente.";
        codigo.innerText = "Error al cargar o inexistente.";
        categoria.innerText = "Error al cargar o inexistente.";
        lugar.innerText = "Error al cargar o inexistente.";
        fecha.innerText = "Error al cargar o inexistente.";
        hora.innerText = "Error al cargar o inexistente.";
        cupos.innerText = "Error al cargar o inexistente.";
        descripcion.innerText = "Error al cargar o inexistente.";
    }
}

function asignarCategoria(c, categoriaClickeada) {
    categoriaBuscar = c;
    const categorias = document.querySelectorAll('#listaCategorias button');

    categorias.forEach(boton => {
        boton.classList.remove('active');
    });

    categoriaClickeada.classList.add('active');
    cargarDatos(categoriaBuscar, filtro, fechaBuscar, selectOrdenar.value);
}

function cambiarPagina(p) {
    paginaActual = Number(p);
    cargarDatos(categoriaBuscar, filtro, fechaBuscar, selectOrdenar.value);
}

cargarDatos();
