const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [] ; // Obtener productos del carrito o inicializar vacío
//Se conecta con catalogo y detalleProducto

const carroVacio = document.querySelector("#carro-vacio");//Maneja cuando no hay productos
const carroProductos = document.querySelector("#carro-productos");//Container de productos en el caror
const carroOpciones = document.querySelector("#carro-opciones");//Botones de accion de comprar y vaciar
const carroComprado = document.querySelector("#carro-comprado");//Mensaje de compra exitosa
const botonVaciar = document.querySelector(".carro-acciones-v");//controles princiales
const botonComprar = document.querySelector(".carro-acciones-comprar");//Controles principales
let botonEliminar = document.querySelectorAll(".carro-producto-eliminar");//Botones de eliminar productos
const total = document.querySelector("#total");//Total a pagar

// Función para cargar productos en el carrito
function cargarProductosCarrito(){

    // Verificar si hay productos en el carrito
    if (productosEnCarrito && productosEnCarrito.length > 0  ){

        //Control de vista para mostrar segun el estado del carrito
        carroVacio.classList.add("disabled");//Oculta mensaje de carrito vacio
        carroProductos.classList.remove("disabled");//Muestra productos en el carrito
        carroOpciones.classList.remove("disabled");//Muestra opciones de carrito
        carroComprado.classList.add("disabled");//Mensaje de compra exitosa oculto

        // Limpiar contenedor antes de recargar
        carroProductos.innerHTML = "";

        // Recorrer productos y agregarlos al contenedor
        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div"); // Crear contenedor del producto
            //Agrega el elemento carrito producto, con su estructura e informacion
            div.classList.add("carrito-producto");
            
            // Mostrar información de descuento si aplica
            let infoDescuento = ''; // Inicializar vacío
            // Verificar si el producto tiene descuento
            if (producto.tieneDescuento && producto.infoDescuento) {
                infoDescuento = `<small style="color: #28a745; font-weight: bold;">${producto.infoDescuento}</small>`;// Etiqueta de descuento
            }
            
            // Mostrar precio original tachado si hay descuento
            // Construir el HTML del producto
            let precioDisplay = `$${producto.precio}`;
            if (producto.tieneDescuento && producto.precioOriginal && producto.precioOriginal !== producto.precio) {
                precioDisplay = `<span style="text-decoration: line-through; color: #999;">$${producto.precioOriginal}</span> <strong style="color: #28a745;">$${producto.precio}</strong>`;
            }// Precio con formato
             
             // Construir el HTML del producto
            
            div.innerHTML = `<img class="carro-img" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="carro-producto-titulo">
                ${infoDescuento}
                <h3>${producto.titulo}</h3>
            </div>
            <div class="carro-producto-cantidad">
                <small>Cantidad</small>
                <p>${producto.cantidad}</p>
            </div>
            <div class="carro-producto-precio">
                <small>Precio</small>
                <p>${precioDisplay}</p>
            </div>
            <div class="carro-producto-subtotal">
                <small>subtotal</small>
                <p>$${producto.precio * producto.cantidad}</p>
            </div>
            <button id="${producto.id}" class="carro-producto-eliminar"><i class='bx  bx-trash'  ></i> </i> </button>`;

            carroProductos.append(div);//Agrega el producto al contenedor del carrito
        })
        //    
    }else{
        //Control de vista para mostrar segun el estado del carrito
        carroVacio.classList.remove("disabled");//Muestra mensaje de carrito vacio
        carroProductos.classList.add("disabled");//Oculta productos en el carrito
        carroOpciones.classList.add("disabled");//Oculta opciones de carrito
        carroComprado.classList.add("disabled");//Oculta mensaje de compra exitosa

    };// Final del else

    actualizarBotonesEliminar();// Actualiza los botones eliminar
    actualizarTotal();// Actualiza total a pagar
}
cargarProductosCarrito();// Carga inicial del carrito

// Función para actualizar los botones de eliminar
function actualizarBotonesEliminar() {
    botonEliminar = document.querySelectorAll(".carro-producto-eliminar");//Selecciona todos los botones eliminar

    botonEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito)
    });// Agrega evento a cada boton eliminar
};

// Función para eliminar un producto del carrito
function eliminarDelCarrito(e){
    const idBoton = parseInt(e.currentTarget.id);// Obtener ID del botón clickeado
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);// Buscar índice del producto en el carrito
    productosEnCarrito.splice(index,1);// Eliminar producto del carrito
    cargarProductosCarrito();// Recargar carrito

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));// Actualizar localStorage
};

// Función para vaciar el carrito
botonVaciar.addEventListener("click", vaciarCarrito);// Escucha el evento click en el boton vaciar

// Función para vaciar el carrito
function vaciarCarrito () {
    productosEnCarrito.length = 0;// Vaciar array de productos
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));// Actualizar localStorage
    cargarProductosCarrito();// Recargar carrito

};


// Función para actualizar el total a pagar
function actualizarTotal() {
    const totalCalculado =  productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);// Sumar total
    total.innerText = `$${totalCalculado}`;// Actualizar total en el DOM
 
};

// Función para comprar el carrito
botonComprar.addEventListener("click", comprarCarrito);// Escucha el evento click en el boton comprar

// Función para comprar el carrito
function comprarCarrito () {
    // Guardar historial de compra antes de limpiar carrito
    guardarHistorialCompra();// Llama a la función para guardar el historial de compras
    
    // Limpiar carrito
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));// Actualizar localStorage

    carroVacio.classList.add("disabled");//Oculta mensaje de carrito vacio
    carroProductos.classList.add("disabled");//Oculta productos en el carrito
    carroOpciones.classList.add("disabled");//Oculta opciones de carrito
    carroComprado.classList.remove("disabled");//Muestra mensaje de compra exitosa
};

// Función para guardar historial de compras
function guardarHistorialCompra() {
    // Verificar si hay productos en el carrito
    if (productosEnCarrito.length === 0) return;// No hacer nada si el carrito está vacío
    
    // Obtener usuario logueado
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));// Obtener usuario logueado
    const emailUsuario = usuario ? usuario.email : 'invitado@pasteleria.com';// Email del usuario o invitado
    
    // Calcular total de la compra
    const totalCompra = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);// Sumar total
    
    // Crear objeto de compra
    const compra = {
        id: Date.now(), // ID único basado en timestamp
        fecha: new Date().toISOString() ,
        fechaLegible: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        emailUsuario: emailUsuario,// Email del usuario o invitado
        productos: [...productosEnCarrito], // Copia de los productos
        total: totalCompra,// Total de la compra
        estado: 'En preparación',// Estado inicial
        numeroOrden: generarNumeroOrden()// Generar número de orden único
    };// Objeto compra
    
    // Obtener historial existente
    const historial = JSON.parse(localStorage.getItem('historial-compras')) || [];
    
    // Agregar nueva compra al historial
    historial.unshift(compra); // unshift para que aparezca primero la más reciente
    
    // Limitar historial a últimas 50 compras para no saturar localStorage
    if (historial.length > 50) {
        historial.splice(50);// Elimina compras más antiguas
    }
    
    // Guardar historial actualizado
    localStorage.setItem('historial-compras', JSON.stringify(historial));// Actualiza localStorage
    
    console.log('Compra guardada en historial:', compra);// Log de la compra
}

// Función para generar número de orden único
function generarNumeroOrden() {
    const fecha = new Date();// Fecha actual
    const año = fecha.getFullYear().toString().slice(-2);// Últimos dos dígitos del año
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');// Mes con dos dígitos
    const dia = fecha.getDate().toString().padStart(2, '0');// Día con dos dígitos
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');// Número aleatorio de 3 dígitos
    
    return `PS${año}${mes}${dia}${random}`;// Retorna el número de orden
}
