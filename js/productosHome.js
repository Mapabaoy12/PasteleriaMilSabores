/*Listado de productos destacados*/
/*Puede ser el mismo listado que en catalogo.js o uno diferente con ofertas y promociones*/

const productosDestacados = [
    {
        id:1,
        titulo: "Torta1",
        imagen : "../img/circulares/tortacircular1.webp",
        forma : "Circulares",
        tamanio : "Grande",
        precio : 10000
    },
    {
        id:2,
        titulo: "Torta2",
        imagen : "../img/circulares/tortacircular2.gif",
        forma : "Circulares",
        tamanio :"Grande",
        precio : 7500
    },
    {
        id:3,
        titulo: "Torta3",
        imagen : "../img/circulares/tortacircular3.jpg",
        forma : "Circulares",
        tamanio :"Grande",
        precio : 7500
    },
    {
        id:4,
        titulo: "Torta4",
        imagen : "../img/circulares/tortacircular4.webp",
        forma : "Circulares",
        tamanio :"Grande",
        precio : 11990
    }
];

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, iniciando carga de productos destacados');
    
    const contenedor = document.querySelector("#contenedor-pd");
    console.log('Contenedor encontrado:', contenedor);
    
    if (!contenedor) {
        console.error('No se encontró el contenedor #contenedor-pd');
        return;
    }
    
    // Limpiar contenedor
    contenedor.innerHTML = "";
    console.log('Contenedor limpiado');
    
    // Cargar cada producto
    productosDestacados.forEach((producto, index) => {
        console.log(`Cargando producto ${index + 1}: ${producto.titulo}`);
        
        const divProducto = document.createElement("div");
        divProducto.className = "producto";
        
        // Obtener precio con descuento si existe la función
        let precioFinal = `$${producto.precio}`;
        if (typeof obtenerTextoPrecionConDescuento === 'function') {
            precioFinal = obtenerTextoPrecionConDescuento(producto.precio);
        }
        
        divProducto.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}" onclick="window.location.href='detalleProducto.html?id=${producto.id}'">
            <div class="producto-informacion">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">${precioFinal} c/u</p>
                <button class="producto-pagina" id="${producto.id}" onclick="window.location.href='detalleProducto.html?id=${producto.id}'">Me interesa</button>
            </div>
        `;
        
        contenedor.appendChild(divProducto);
        console.log(`Producto ${producto.titulo} agregado al contenedor`);
    });
    
    console.log('Todos los productos han sido cargados');
    console.log('Contenido final del contenedor:', contenedor.children.length, 'elementos');
});