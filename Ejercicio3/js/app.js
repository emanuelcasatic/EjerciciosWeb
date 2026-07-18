class Producto {
  constructor(codigo, nombre, precio, stock, categoria, estado) {
    this.codigo = codigo;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.categoria = categoria;
    this.estado = estado;
  }
}

class Cliente {
  constructor(id, nombre, correo) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
  }
}

class Pedido {
  constructor(id, codigoProducto, clienteId, cantidad, total) {
    this.id = id;
    this.codigoProducto = codigoProducto;
    this.clienteId = clienteId;
    this.cantidad = cantidad;
    this.total = total;
  }
}

const listaDeProductos = insertarDatos("listaDeProductos");
const listaDeClientes = insertarDatos("listaDeClientes");
const listaDePedidos = insertarDatos("listaDePedidos");

let temaActual = localStorage.getItem("tema") || "light";
const btnTema = document.getElementById("btnTema");
document.documentElement.setAttribute("data-bs-theme", temaActual);

let renderizado = "cards";
let filtro = "";
let categoriaBuscar = "Todas";
let estadoBuscar = "Todos";
let paginaActual = 1;
let claseARenderizar = "productos";

const frmProducto = document.getElementById("frmProducto");
const frmEditar = document.getElementById("frmEditarProducto");
const exitoToast = document.getElementById("toastExito");
const errorToast = document.getElementById("toastError");
const exitoEliminarToast = document.getElementById("toastExitoEliminar");
const codigoToast = document.getElementById("toastCodigo");
const contenedorProductos = document.getElementById("contenedorProductos");
const filtroInput = document.getElementById("inputBuscar");
const estadoSelect = document.getElementById("estadoSelect");
const btnBuscar = document.getElementById("btnBuscar");
const btnOrdenar = document.getElementById("btnAplicarFiltros");
const selectOrdenar = document.getElementById("selectOrdenar");
const btnCards = document.getElementById("btnVistaCartas");
const btnTabla = document.getElementById("btnVistaTabla");

const modalAgregarProducto = document.getElementById("modalAgregarProducto");
const modalEditarProducto = document.getElementById("modalEditarProducto");
const modalEliminarProducto = document.getElementById("modalEliminarProducto");
const btnEliminar = document.getElementById("btnEliminarProducto");
const codProductoEliminar = document.getElementById("codProductoEliminar");

btnTema.addEventListener("click", function (e) {
  e.preventDefault();
  temaActual = temaActual === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-bs-theme", temaActual);
  localStorage.setItem("tema", temaActual);
});

frmProducto.addEventListener("submit", function (e) {
  e.preventDefault();
  const codigo = document.getElementById("codigo");
  const nombre = document.getElementById("nombre");
  const categoria = document.getElementById("categoria");
  const stock = document.getElementById("stock");
  const precio = document.getElementById("precio");
  const estado = document.getElementById("estado");

  if (validarCampos(codigo.value, nombre.value, categoria.value, precio.value, stock.value, estado.value)) {
    if (listaDeProductos != null && listaDeProductos.length > 0) {
      const productoConMismoId = listaDeProductos.find(
        (p) => p.codigo.toLowerCase() === codigo.value.toLowerCase(),
      );
      if (productoConMismoId) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(codigoToast);
        toastBootstrap.show();
        return;
      }
    }

    const producto = new Producto(
      codigo.value,
      nombre.value,
      precio.value,
      stock.value,
      categoria.value,
      estado.value
    );
    listaDeProductos.push(producto);
    localStorage.setItem("listaDeProductos", JSON.stringify(listaDeProductos));
    limpiarFormularioProductos(codigo, nombre, categoria, precio, stock, estado);

    const modal = bootstrap.Modal.getInstance(modalAgregarProducto);
    modal.hide();

    cargarDatos(categoriaBuscar, filtro, estadoBuscar, selectOrdenar.value);
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
  const categoria = document.getElementById("categoriaEditar");
  const stock = document.getElementById("stockEditar");
  const precio = document.getElementById("precioEditar");
  const estado = document.getElementById("estadoEditar");

  if (validarCampos(codigo.value, nombre.value, categoria.value, precio.value, stock.value, estado.value)) {
    if (listaDeProductos != null && listaDeProductos.length > 0) {
      const productoConMismoId = listaDeProductos.find(
        (p) => p.codigo.toLowerCase() === codigo.value.toLowerCase() &&
          p.codigo.toLowerCase() !== codigoActualEditar.value.toLowerCase()
      );
      if (productoConMismoId) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(codigoToast);
        toastBootstrap.show();
        return;
      }

      const indexDelActual = listaDeProductos.findIndex(
        (p) => p.codigo.toLowerCase() === codigoActualEditar.value.toLowerCase(),
      );

      if (indexDelActual >= 0) {
        listaDeProductos[indexDelActual] = new Producto(
          codigo.value,
          nombre.value,
          precio.value,
          stock.value,
          categoria.value,
          estado.value
        );
        localStorage.setItem("listaDeProductos", JSON.stringify(listaDeProductos));
        codigoActualEditar.value = "";
        limpiarFormularioProductos(codigo, nombre, categoria, precio, stock, estado);

        const modal = bootstrap.Modal.getInstance(modalEditarProducto);
        modal.hide();

        cargarDatos(categoriaBuscar, filtro, estadoBuscar, selectOrdenar.value);
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
  cargarDatos(categoriaBuscar, filtro, estadoBuscar, selectOrdenar.value);
});

btnOrdenar.addEventListener("click", function (e) {
  e.preventDefault();
  filtro = filtroInput.value;
  estadoBuscar = estadoSelect.value;
  cargarDatos(categoriaBuscar, filtro, estadoBuscar, selectOrdenar.value);
});

btnEliminar.addEventListener("click", function (e) {
  e.preventDefault();
  let listaNueva = listaDeProductos.filter(p => p.codigo != codProductoEliminar.textContent);
  listaDeProductos.length = 0;
  listaNueva.forEach(p => listaDeProductos.push(p));
  localStorage.setItem("listaDeProductos", JSON.stringify(listaDeProductos));

  const toast = bootstrap.Toast.getOrCreateInstance(exitoEliminarToast);
  toast.show();

  const modal = bootstrap.Modal.getInstance(modalEliminarProducto);
  modal.hide();

  cargarDatos(categoriaBuscar, filtro, estadoBuscar, selectOrdenar.value);
});

btnCards.addEventListener("click", function (e) {
  e.preventDefault();
  btnCards.classList.add("active");
  btnTabla.classList.remove("active");
  renderizado = "cards";
  cargarDatos(categoriaBuscar, filtro, estadoBuscar, selectOrdenar.value);
});

btnTabla.addEventListener("click", function (e) {
  e.preventDefault();
  btnTabla.classList.add("active");
  btnCards.classList.remove("active");
  renderizado = "table";
  cargarDatos(categoriaBuscar, filtro, estadoBuscar, selectOrdenar.value);
});

function validarCampos(codigo, nombre, categoria, precio, stock, estado) {
  if (codigo.trim() === "" || nombre.trim() === "" || categoria.trim() === "" || estado.trim() === "") {
    return false;
  }
  if (precio <= 0 || stock < 0) {
    return false;
  }
  return true;
}

function limpiarFormularioProductos(codigo, nombre, categoria, precio, stock, estado) {
  codigo.value = "";
  nombre.value = "";
  categoria.value = "";
  precio.value = "";
  stock.value = "";
  estado.value = "";
}

function filtrarProductos(lista, categoria, filtro, estado, ordenarPor) {
  let listaFiltrada = [...lista];

  let filtroFormateado = filtro.trim().toLowerCase();
  let categoriaFormateada = categoria.trim().toLowerCase();
  let estadoFormateado = estado.trim().toLowerCase();

  if (categoriaFormateada !== "todas" && categoriaFormateada !== "") {
    listaFiltrada = listaFiltrada.filter(p => p.categoria.toLowerCase() === categoriaFormateada);
  }

  if (filtroFormateado !== "") {
    listaFiltrada = listaFiltrada.filter(p =>
      p.nombre.toLowerCase().includes(filtroFormateado) ||
      p.codigo.toLowerCase().includes(filtroFormateado) ||
      p.categoria.toLowerCase().includes(filtroFormateado)
    );
  }

  if (estadoFormateado !== "" && estadoFormateado !== "todos") {
    listaFiltrada = listaFiltrada.filter(p => p.estado.trim().toLowerCase() === estadoFormateado);
  }

  if (ordenarPor !== "" && listaFiltrada.length > 0) {
    listaFiltrada.sort((p, q) => {
      switch (ordenarPor) {
        case "nombreAsc":
          return p.nombre.localeCompare(q.nombre);
        case "nombreDesc":
          return q.nombre.localeCompare(p.nombre);
        case "precioAsc":
          return p.precio - q.precio;
        case "precioDesc":
          return q.precio - p.precio;
      }
    });
  }

  return listaFiltrada;
}

function cargarDatos(categoria = "Todas", filtro = "", estado = "Todos", ordenarPor = "") {
  contenedorProductos.innerHTML = "";

    if (claseARenderizar === "clientes") {
    if (listaDeClientes.length <= 0) {
      contenedorProductos.innerHTML = `
            <div class="container-fluid text-center mt-5"> 
                <h2 class="text-muted"> No hay clientes aún. </h2>
            </div>`;
      document.getElementById("paginacion").innerHTML = `<p class="text-muted mt-2">Para paginación cambia la vista a productos.</p>`;
    } else {
      let htmlTabla = `<div class="table-responsive p-3 rounded shadow-sm" id="vistaTabla">
                <table class="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                        </tr>
                    </thead>
                    <tbody>`;
      listaDeClientes.forEach(c => {
        htmlTabla += `
                        <tr>
                            <td><span class="badge bg-secondary">${c.id}</span></td>
                            <td class="fw-bold text-custom-title">${c.nombre}</td>
                            <td class="fw-bold text-custom-title">${c.correo}</td>
                        </tr>`;
      });
      htmlTabla += `</tbody></table></div>`;
      contenedorProductos.innerHTML = htmlTabla;
      document.getElementById("paginacion").innerHTML = `<p class="text-muted mt-2">Para paginación cambia la vista a productos.</p>`;
    }

    return;
  }

  if (claseARenderizar ===  "pedidos") {
    if (listaDePedidos.length <= 0) {
      contenedorProductos.innerHTML = `
            <div class="container-fluid text-center mt-5"> 
                <h2 class="text-muted"> No hay pedidos aún. </h2>
            </div>`;
      document.getElementById("paginacion").innerHTML = `<p class="text-muted mt-2">Para paginación cambia la vista a productos.</p>`;
    } else {
      let htmlTabla = `<div class="table-responsive p-3 rounded shadow-sm" id="vistaTabla">
                <table class="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Código del Producto</th>
                            <th>Id del Cliente</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>`;
      listaDePedidos.forEach(p => {
        htmlTabla += `
                        <tr>
                            <td><span class="badge bg-secondary">${p.id}</span></td>
                            <td class="fw-bold text-custom-title">${p.codigoProducto}</td>
                            <td class="fw-bold text-custom-title">${p.clienteId}</td>
                            <td class="fw-bold text-custom-title">${p.cantidad}</td>
                            <td class="fw-bold text-custom-title">$${p.total}</td>
                        </tr>`;
      });
      htmlTabla += `</tbody></table></div>`;
      contenedorProductos.innerHTML = htmlTabla;
      document.getElementById("paginacion").innerHTML = `<p class="text-muted mt-2">Para paginación cambia la vista a productos.</p>`;
    }

    return;
  }

  if (listaDeProductos.length <= 0) {
    actualizarDashboard(listaDeProductos);
    contenedorProductos.innerHTML = `
            <div class="container-fluid text-center mt-5"> 
                <h2 class="text-muted"> No hay productos aún. </h2>
            </div>`;
    document.getElementById("paginacion").innerHTML = `<p class="text-muted mt-2">Para paginación agrega productos o filtra los que están.</p>`;
    return;
  }

  let listaDeProductosFiltrada = filtrarProductos(listaDeProductos, categoria, filtro, estado, ordenarPor);
  const productosPorPagina = 6;
  const cantidadDePaginas = Math.ceil(listaDeProductosFiltrada.length / productosPorPagina);
  const i = (paginaActual - 1) * productosPorPagina;
  const j = Math.min(i + productosPorPagina, listaDeProductosFiltrada.length);
  const paginacion = document.getElementById("paginacion");
  paginacion.innerHTML = "";

  let listaPartida = listaDeProductosFiltrada.slice(i, j);

  if (listaPartida.length > 0) {
    actualizarDashboard(listaPartida);
    let htmlPaginacion = `<li class="page-item ${(paginaActual - 1 <= 0) ? 'disabled' : ''}">
            <button ${(paginaActual - 1 <= 0) ? '' : `onclick="cambiarPagina('${paginaActual - 1}')"`} class="page-link">Anterior</button>
        </li>`;

    for (let cont = 0; cont < cantidadDePaginas; cont++) {
      htmlPaginacion += `
                <li class="page-item ${(paginaActual - 1 == cont) ? 'active' : ''}">
                    <button onclick="cambiarPagina('${cont + 1}')" class="page-link">${cont + 1}</button>
                </li>`;
    }

    htmlPaginacion += `<li class="page-item ${(paginaActual + 1 > cantidadDePaginas) ? 'disabled' : ''}">
            <button ${(paginaActual + 1 > cantidadDePaginas) ? '' : `onclick="cambiarPagina('${paginaActual + 1}')"`} class="page-link">Siguiente</button>
        </li>`;

    paginacion.innerHTML = htmlPaginacion;

    if (renderizado !== "table") {
      let htmlCartas = `<div class="row g-4" id="vistaCartas">`;
      listaPartida.forEach((p) => {
        htmlCartas += `
                <div class="col-12 col-md-6 col-xl-4">
                    <div class="card h-100 shadow-sm border-0 custom-card-hover">
                        <div class="card-body">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="badge bg-secondary">${p.codigo}</span>
                                <span class="badge ${p.estado === 'Activo' ? 'bg-success' : 'bg-danger'}">${p.estado}</span>
                            </div>
                            <h5 class="card-title text-custom-title fw-bold">${p.nombre}</h5>
                            <h6 class="card-subtitle mb-3 text-muted"><i class="bi bi-tag"></i> ${p.categoria}</h6>
                            <p class="card-text mb-1"><i class="bi bi-currency-dollar text-primary"></i> Precio: $${p.precio}</p>
                            <p class="card-text"><i class="bi bi-box2 text-primary"></i> Stock: ${p.stock}</p>
                        </div>
                        <div class="card-footer border-top d-flex justify-content-between align-items-center">
                            <button onclick="cargarDetalles('${p.codigo}')" class="btn btn-sm btn-outline-primary" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDetalle">Detalles</button>
                            <div class="btn-group">
                                <button onclick="editarProducto('${p.codigo}')" class="btn btn-sm btn-outline-warning" data-bs-toggle="modal" data-bs-target="#modalEditarProducto" title="Editar">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button onclick="eliminarProducto('${p.codigo}')" data-bs-toggle="modal" data-bs-target="#modalEliminarProducto" class="btn btn-sm btn-outline-danger" title="Eliminar">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
      });
      htmlCartas += `</div>`;
      contenedorProductos.innerHTML = htmlCartas;
    } else {
      let htmlTabla = `<div class="table-responsive p-3 rounded shadow-sm" id="vistaTabla">
                <table class="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>`;
      listaPartida.forEach(p => {
        htmlTabla += `
                        <tr>
                            <td><span class="badge bg-secondary">${p.codigo}</span></td>
                            <td class="fw-bold text-custom-title">${p.nombre}</td>
                            <td><span class="badge bg-primary">${p.categoria}</span></td>
                            <td>$${p.precio}</td>
                            <td>${p.stock}</td>
                            <td><span class="badge ${p.estado === 'Activo' ? 'bg-success' : 'bg-danger'}">${p.estado}</span></td>
                            <td>
                                <button onclick="cargarDetalles('${p.codigo}')" class="btn btn-sm btn-outline-primary" data-bs-toggle="offcanvas"
                                    data-bs-target="#offcanvasDetalle" title="Ver Detalles">
                                    <i class="bi bi-eye"></i>
                                </button>
                                <button onclick="editarProducto('${p.codigo}')" data-bs-toggle="modal" data-bs-target="#modalEditarProducto" class="btn btn-sm btn-outline-warning" title="Editar">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button onclick="eliminarProducto('${p.codigo}')" data-bs-toggle="modal" data-bs-target="#modalEliminarProducto" class="btn btn-sm btn-outline-danger" title="Eliminar">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>`;
      });
      htmlTabla += `</tbody></table></div>`;
      contenedorProductos.innerHTML = htmlTabla;
    }
  } else {
    actualizarDashboard(listaPartida);
    contenedorProductos.innerHTML = `
            <div class="container-fluid text-center mt-5"> 
                <h2 class="text-muted"> No hay productos con esos filtros. </h2>
            </div>`;
    paginacion.innerHTML = `<p class="text-muted mt-2">Para paginación agrega productos o cambia los filtros.</p>`;
  }
}

function editarProducto(codigoActual) {
  const codigoActualEditar = document.getElementById("codigoActualEditar");
  const codigo = document.getElementById("codigoEditar");
  const nombre = document.getElementById("nombreEditar");
  const precio = document.getElementById("precioEditar");
  const stock = document.getElementById("stockEditar");
  const categoria = document.getElementById("categoriaEditar");
  const estado = document.getElementById("estadoEditar");

  const productoActual = listaDeProductos.find((p) => p.codigo === codigoActual);
  codigoActualEditar.value = productoActual.codigo;
  codigo.value = productoActual.codigo;
  nombre.value = productoActual.nombre;
  categoria.value = productoActual.categoria;
  stock.value = productoActual.stock;
  precio.value = productoActual.precio;
  estado.value = productoActual.estado;
}

function eliminarProducto(codigoActual) {
  codProductoEliminar.innerText = codigoActual;
}

function cargarDetalles(codigoActual) {
  const nombre = document.getElementById("detNombre");
  const codigo = document.getElementById("detCodigo");
  const categoria = document.getElementById("detCategoria");
  const precio = document.getElementById("detPrecio");
  const stock = document.getElementById("detStock");
  const estado = document.getElementById("detEstado");

  const productoDetalles = listaDeProductos.find(p => p.codigo === codigoActual);

  if (productoDetalles) {
    nombre.innerText = productoDetalles.nombre;
    codigo.innerText = productoDetalles.codigo;
    categoria.innerText = productoDetalles.categoria;
    precio.innerText = productoDetalles.precio;
    stock.innerText = productoDetalles.stock;
    estado.innerText = productoDetalles.estado;
  } else {
    nombre.innerText = "Error al cargar o inexistente.";
    codigo.innerText = "Error al cargar o inexistente.";
    categoria.innerText = "Error al cargar o inexistente.";
    precio.innerText = "Error al cargar o inexistente.";
    stock.innerText = "Error al cargar o inexistente.";
    estado.innerText = "Error al cargar o inexistente.";
  }
}

function actualizarDashboard(lista, inicio = false) {
  const statTotalProductosLabel = document.getElementById("statTotalProductosLabel");
  const statTotalProductos = document.getElementById("statTotalProductos");
  const statTotalClientes = document.getElementById("statTotalClientes");
  const statTotalPedidos = document.getElementById("statTotalPedidos");
  const statSinStock = document.getElementById("statSinStock");
  let sinStock = 0;
  let clientes = 0;
  let pedidos = 0;

  if (lista.length > 0) {
    lista.forEach(p => {
      if (p.stock <= 0) {
        sinStock += 1;
      }
    });
  }
  statTotalProductosLabel.innerText = (inicio) ? "Total Productos" : "Total - En Pantalla"
  statTotalProductos.innerText = (inicio) ? `${listaDeProductos.length}` : `${listaDeProductos.length} - ${lista.length}`;
  statTotalClientes.innerText = String(listaDeClientes.length);
  statTotalPedidos.innerText = String(listaDePedidos.length);
  statSinStock.innerText = String(sinStock);

}

function insertarDatos(localStoreyKey) {
  switch (localStoreyKey) {
    case "listaDeProductos":
      let productos = JSON.parse(localStorage.getItem("listaDeProductos")) || [
        new Producto("COD-001", "Laptop Lenovo LOQ", 1000, 9, "Computadoras", "Activo"),
        new Producto("COD-002", "Monitor Samsung", 250, 49, "Accesorios", "Activo"),
        new Producto("COD-003", "Mouse Gamer", 15, 0, "Periféricos", "Inactivo"),
      ];
      localStorage.setItem(localStoreyKey, JSON.stringify(productos));
      return productos;
    case "listaDeClientes":
      let clientes = JSON.parse(localStorage.getItem("listaDeClientes")) || [
        new Cliente(1, "Emanuel", "ema@example.com"),
        new Cliente(2, "Kevin", "kev@example.com"),
        new Cliente(3, "Mario", "mar@example.com")
      ];
      localStorage.setItem(localStoreyKey, JSON.stringify(clientes));
      return clientes;
    case "listaDePedidos":
      let pedidos = JSON.parse(localStorage.getItem("listaDePedidos")) || [
        new Pedido(1, "COD-001", 1, 1, 1000),
        new Pedido(2, "COD-002", 1, 1, 250),
        new Pedido(3, "COD-003", 1, 1, 15)
      ];
      localStorage.setItem(localStoreyKey, JSON.stringify(pedidos));
      return pedidos;
    default:
      return [];
  }
}

function asignarCategoria(c, categoriaClickeada) {
  categoriaBuscar = c;
  const categorias = document.querySelectorAll('#listaCategorias button');
  categorias.forEach(boton => {
    boton.classList.remove('active');
  });
  categoriaClickeada.classList.add('active');
  cargarDatos(categoriaBuscar, filtro, estadoBuscar, selectOrdenar.value);
}

function cambiarVista(navClickeado, c) {
  console.log(navClickeado);
  claseARenderizar = c;
  const renderizadoFiltrosProductos = document.getElementById("renderizadoFiltrosProductos");
  if (c !== 'productos') {
    renderizadoFiltrosProductos.classList.add('d-none');
  } else {
    renderizadoFiltrosProductos.classList.remove('d-none');
  }
  const navs = document.querySelectorAll('#seccionesNav li button');
  navs.forEach(nav => {
    nav.classList.remove('active', 'text-white', 'fw-bold');
    nav.classList.add('text-white-50');
  });
  navClickeado.classList.remove('text-white-50');
  navClickeado.classList.add('active', 'text-white', 'fw-bold');
  cargarDatos(categoriaBuscar, filtro, estadoBuscar, selectOrdenar.value);
}

function cambiarPagina(p) {
  paginaActual = Number(p);
  cargarDatos(categoriaBuscar, filtro, estadoBuscar, selectOrdenar.value);
}

cargarDatos();
actualizarDashboard(listaDeProductos, true);