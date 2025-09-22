// Las funciones de descuento están definidas en productos.js
//Busca extraer el parametro de la ID para ingresarlo dentro de la URL
const params = new URLSearchParams(window.location.search);// Obtener parámetros de la URL
const idProducto = parseInt(params.get('id'));// Obtener ID del producto de los parámetros de la URL

// Intentar obtener productos del localStorage, si no existe usar el array global
let productosData = JSON.parse(localStorage.getItem("productos")) || [];// Obtener productos del localStorage

// Si localStorage está vacío pero tenemos el array global, usarlo y guardarlo
if (productosData.length === 0 && typeof productos !== 'undefined' && productos.length > 0) {
    productosData = productos;// Usar el array global
    localStorage.setItem("productos", JSON.stringify(productos));
    console.log('Productos obtenidos del array global y guardados en localStorage');// Debug
}

// Debug: Verificar que tenemos los datos necesarios
console.log('ID del producto:', idProducto);// Debug
console.log('Productos disponibles:', productosData.length);
console.log('Lista de productos:', productosData.map(p => ({ id: p.id, titulo: p.titulo })));// Debug

const producto = productosData.find(p => p.id === idProducto);// Buscar el producto por ID
console.log('Producto encontrado:', producto);// Debug

const contenedorDetalle = document.querySelector("#contenedor-d");// Contenedor donde se mostrará el detalle


if (producto) {
    const div = document.createElement("div");// Crear div para el detalle
    div.classList.add("producto-detalle");//Agrega el div creado anteriormente
    div.innerHTML = `
        <div id="contenedor-imagen-detalle" class="contenedor-producto-detalle">
            <img src="${producto.imagen}" alt="${producto.titulo}">
        </div>
        <div id="contenedor-detalle-p" class="contenedor-producto-detalle">
            <div id="titulo-precio-d">
                <h2>${producto.titulo}</h2>
                <h2>${obtenerTextoPrecionConDescuento(producto.precio)}</h2>
            </div>
            <div id="descripcion-p">
                <p>${producto.descripcion || ''}</p>
            </div>
            <div id="btn-carro">
                <button class="producto-agregar" data-id="${producto.id}">
                    <i class='bx bx-cart-add'></i>
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `;
    contenedorDetalle.append(div);// Agregar el detalle al contenedor
    
    // Agregar funcionalidad al botón de agregar al carrito
    const botonAgregar = div.querySelector('.producto-agregar');// Seleccionar el botón dentro del div creado
    botonAgregar.addEventListener('click', function() {
        agregarAlCarritoDetalle(producto);// Pasar el producto original sin modificar
    });
} else {
    console.log('Producto no encontrado. ID buscado:', idProducto, 'Tipo:', typeof idProducto);// Debug
    console.log('IDs disponibles:', productosData.map(p => ({ id: p.id, tipo: typeof p.id })));// Debug
    
    // Mostrar mensaje de producto no encontrado
    contenedorDetalle.innerHTML = `
        <div style="padding: 2rem; text-align: center;">
            <h2>Producto no encontrado</h2>
            <p>No se pudo encontrar el producto con ID: ${idProducto}</p>
            <p><a href="catalogo.html" style="color: #FFC0CB;">Volver al catálogo</a></p>
        </div>
    `;
}

// Función para agregar producto al carrito desde detalle
function agregarAlCarritoDetalle(productoOriginal) {
    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];// Obtener productos en carrito o iniciar array vacío
    
    // Obtener información de descuentos
    const infoDescuentos = obtenerInfoDescuentos();
    
    // Verificar si es torta gratis de cumpleaños DuocUC
    let precioConDescuento = calcularPrecioConDescuento(productoOriginal.precio);
    let esTortaGratisCumpleanos = false;
    
    if (infoDescuentos.tortaGratisCumpleanos) {
        // Confirmar si quiere usar su torta gratis de cumpleaños
        const confirmar = confirm(`🎂 ¡Feliz Cumpleaños! 🎉\n\n¿Quieres usar tu torta GRATIS de cumpleaños DuocUC en "${productoOriginal.titulo}"?\n\n⚠️ Solo puedes elegir UNA torta gratis por año en tu cumpleaños.`);
        
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
        infoDescuento: esTortaGratisCumpleanos ? '🎂 TORTA GRATIS Cumpleaños DuocUC' : (infoDescuentos.etiquetas[0] || null),// Etiqueta del descuento
        esTortaGratisCumpleanos: esTortaGratisCumpleanos// Marcar si es torta gratis de cumpleaños
    };
    
    const productoExistente = productosEnCarrito.find(p => p.id === productoOriginal.id);// Verificar si ya está en el carrito
    
    if (productoExistente && !esTortaGratisCumpleanos) {
        productoExistente.cantidad++;// Incrementar cantidad
        // Actualizar el precio del producto existente en caso de que haya cambiado el descuento
        productoExistente.precio = precioConDescuento;// Precio con descuento si aplica
        productoExistente.tieneDescuento = infoDescuentos.tieneDescuento;// Actualizar si tiene descuento
        productoExistente.infoDescuento = infoDescuentos.etiquetas[0] || null;// Actualizar etiqueta
    } else {
        // Si es torta gratis de cumpleaños o producto nuevo, agregar como entrada separada
        productoAgregado.cantidad = 1;// Inicializar cantidad
        productosEnCarrito.push(productoAgregado);// Agregar nuevo producto al carrito
    }
    
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));// Guardar carrito actualizado
    
    // Mostrar mensaje de confirmación apropiado
    if (esTortaGratisCumpleanos) {
        alert('🎂 ¡Felicidades! Tu torta GRATIS de cumpleaños ha sido agregada al carrito. ¡Disfrútala! 🎉');
    } else {
        alert('Producto agregado al carrito');// Mensaje simple, se puede mejorar con un modal o notificación
    }
}
    
 
//Para agregar al div y verificar
 /*
 <div id="contenedor-imagen-detalle" class="contenedor-producto-detalle">
                <img src="../img/tortaqueso.jpg" alt="Torta queso">
            </div>
            <div id="contenedor-detalle-p" class="contenedor-producto-detalle">
                <div id="titulo-precio-d">
                    <h2>Nombre producto</h2>
                    <h2>$10000</h2>
                </div>
                <div id="descripcion-p">
                    <p>mishhh</p>
                </div>
                <div id="btn-carro">
                    <button class="producto-agregar">Agregar</button>
                </div>
            </div>

 */
