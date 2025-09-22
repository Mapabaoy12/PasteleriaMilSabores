
// Guardamos el catalogo completo de productos dentro del localStorage para tener facilidad al ocuparlo en detalle producto
if (typeof productos !== 'undefined' && productos.length > 0) {
    localStorage.setItem("productos", JSON.stringify(productos));// Guardar productos en localStorage
    console.log('Productos guardados en localStorage:', productos.length);
} else {
    console.error('No se encontró el array de productos o está vacío');
}

// Función para obtener el texto del precio con posible descuento
const contenedorProductos = document.querySelector
("#contenedor-p")//Selecciona el contenedor de productos
const botonesFiltro = document.querySelectorAll(".botones-filtro")//Selecciona todos los botones de filtro

let botonesAgregar = document.querySelectorAll(".producto-agregar");//Selecciona todos los botones agregar

const numerito = document.querySelector("#numerito")//Selecciona el numerito del carrito

// Función para cargar productos en el contenedor
function cargarProductos(lista = productos) {
    contenedorProductos.innerHTML = "";// Limpia el contenedor
    lista.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}" onclick="window.location.href='detalleProducto.html?id=${producto.id}'">
            <div class="producto-informacion">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">${obtenerTextoPrecionConDescuento(producto.precio)} c/u</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div);//Agrega el producto al contenedor
    });
    actualizarBotonesAgregar();// Actualiza los botones agregar
}


cargarProductos();// Carga inicial de productos

// Función para refrescar precios cuando cambie el estado del usuario
function refrescarPrecios() {
    cargarProductos();// Recargar productos para actualizar precios
}

// Escuchar cambios en el localStorage del usuario logueado
window.addEventListener('storage', function(e) {
    if (e.key === 'usuarioLogueado') {
        refrescarPrecios();// Recargar productos para actualizar precios
    }
});

// También refrescar cuando la página regana el foco (por si vuelve del login)
window.addEventListener('focus', function() {
    refrescarPrecios();// Recargar productos para actualizar precios
});

botonesFiltro.forEach(boton => { 
    boton.addEventListener("click", (e) => {
        const forma = e.currentTarget.dataset.forma;// Obtener valor del data-attribute
        const tamanio = e.currentTarget.dataset.tamanio;// Obtener valor del data-attribute

        let filtrados = productos;// Empezar con todos los productos

        if (forma) {
            filtrados = filtrados.filter(p => p.forma === forma);// Filtrar por forma
        }

        if (tamanio) {
            filtrados = filtrados.filter(p => p.tamanio === tamanio);// Filtrar por tamaño
        }

        cargarProductos(filtrados);// Cargar productos filtrados
    });
});

const btnLimpiar = document.querySelector("#btn-limpiar");//Selecciona el boton limpiar filtros

// Escuchar click en el boton limpiar filtros
btnLimpiar.addEventListener("click", () => {
    // desmarcar todos los checkboxes
    document.querySelectorAll(".filtros input[type='checkbox']").forEach(chk => {
        chk.checked = false;// Desmarca el checkbox
    });

    // recargar todos los productos
    cargarProductos(productos);
});

// Función para actualizar los botones agregar
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");//Selecciona todos los botones agregar

    botonesAgregar.forEach(boton => (
        boton.addEventListener("click", agregarAlCarrito)// Agrega evento a cada boton agregar
    ));

};

let productosEnCarrito;// Array para guardar productos en el carrito

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");// Obtener productos del localStorage

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);// Parsear JSON a array
    actualizarNumerito();// Actualizar numerito del carrito
} else {
    productosEnCarrito = [];// Inicializar como array vacío
};


// Función para agregar producto al carrito
function agregarAlCarrito(e){
    const idBoton = parseInt(e.currentTarget.id);// Obtener ID del botón clickeado
    const productoOriginal = productos.find(producto => producto.id === idBoton);// Buscar el producto original por ID
    
    // Obtener información de descuentos (funciona con o sin usuario logueado)
    const infoDescuentos = obtenerInfoDescuentos();// Obtener info de descuentos
    
    // Verificar si es torta gratis de cumpleaños DuocUC
    let precioConDescuento = calcularPrecioConDescuento(productoOriginal.precio);
    let esTortaGratisCumpleanos = false;
    
    if (infoDescuentos.tortaGratisCumpleanos) {
        // Confirmar si quiere usar su torta gratis de cumpleaños
        const confirmar = confirm(`¡Feliz Cumpleaños! \n\n¿Quieres usar tu torta GRATIS de cumpleaños DuocUC en "${productoOriginal.titulo}"?\n\n Solo puedes elegir UNA torta gratis por año en tu cumpleaños.`);
        
        if (confirmar) {
            precioConDescuento = 0; // Precio gratis
            esTortaGratisCumpleanos = true;
            marcarTortaGratisCumpleanosUsada(); // Marcar como usada
        }
    }
    
    // Crear una copia del producto con el precio actualizado si hay descuento
    const productoAgregado = {
        ...productoOriginal,// Copiar todas las propiedades del producto original
        precio: precioConDescuento,// Precio con descuento si aplica
        precioOriginal: productoOriginal.precio,// Precio original sin descuento
        tieneDescuento: infoDescuentos.tieneDescuento || esTortaGratisCumpleanos,// Indicar si tiene descuento
        infoDescuento: esTortaGratisCumpleanos ? ' TORTA GRATIS Cumpleaños DuocUC' : (infoDescuentos.etiquetas[0] || null),// Etiqueta del descuento
        esTortaGratisCumpleanos: esTortaGratisCumpleanos// Marcar si es torta gratis de cumpleaños
    };

    // Verificar si el producto ya está en el carrito
    if(productosEnCarrito.some(producto => producto.id === idBoton )){
        // Si ya está en el carrito y no es torta gratis de cumpleaños, incrementar cantidad
        if (!esTortaGratisCumpleanos) {
            const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);// Buscar índice del producto en el carrito
            productosEnCarrito[index].cantidad++;// Incrementar cantidad
            // Actualizar el precio del producto existente en caso de que haya cambiado el descuento
            productosEnCarrito[index].precio = precioConDescuento;// Actualizar precio
            productosEnCarrito[index].tieneDescuento = infoDescuentos.tieneDescuento;// Actualizar si tiene descuento
            productosEnCarrito[index].infoDescuento = infoDescuentos.etiquetas[0] || null;// Actualizar etiqueta
        } else {
            // Si es torta gratis de cumpleaños, agregarla como producto separado
            productoAgregado.cantidad = 1;// Inicializar cantidad
            productosEnCarrito.push(productoAgregado);// Agregar como producto separado
        }
    } else {
        productoAgregado.cantidad = 1;// Inicializar cantidad
        productosEnCarrito.push(productoAgregado);// Agregar nuevo producto al carrito
    }
    
    console.log('Producto agregado al carrito:', productoAgregado);// Log del producto agregado
    console.log('Carrito actual:', productosEnCarrito);// Log del carrito actual

    actualizarNumerito();// Actualizar numerito del carrito
    
    // Mostrar mensaje de confirmación
    mostrarMensajeCarrito(productoOriginal.titulo, infoDescuentos);// Mostrar mensaje

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));// Guardar carrito actualizado en localStorage
};

// Función para obtener información de descuentos del usuario actual
function mostrarMensajeCarrito(nombreProducto, infoDescuentos) {
    let mensaje = ` "${nombreProducto}" agregado al carrito`;// Mensaje base

    // Verificar si hay descuentos aplicables
    if (infoDescuentos.tieneDescuento) {
        mensaje += `\n ${infoDescuentos.etiquetas[0]}`;
    }
    
    // Si no hay usuario logueado, mencionar que pueden crear cuenta para descuentos
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));// Obtener usuario logueado
    if (!usuario) {
        mensaje += '\n ¡Regístrate para acceder a descuentos especiales!';
    }
    
    alert(mensaje);
}

// Función para obtener información de descuentos del usuario actual
function actualizarNumerito(){
    let newNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)// Sumar cantidades
    numerito.innerText = newNumerito;// Actualizar numerito en el DOM
}