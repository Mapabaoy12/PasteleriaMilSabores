const params = new URLSearchParams(window.location.search);
const idProducto = params.get('id');
const productos = JSON.parse(localStorage.getItem("productos")) || [];
const producto = productos.find(p => p.id == idProducto);
const contenedorDetalle = document.querySelector("#contenedor-d");

if (producto) {
    const div = document.createElement("div");
    div.classList.add("producto-detalle");
    div.innerHTML = `
        <div id="contenedor-imagen-detalle" class="contenedor-producto-detalle">
            <img src="${producto.imagen}" alt="${producto.titulo}">
        </div>
        <div id="contenedor-detalle-p" class="contenedor-producto-detalle">
            <div id="titulo-precio-d">
                <h2>${producto.titulo}</h2>
                <h2>$${producto.precio}</h2>
            </div>
            <div id="descripcion-p">
                <p>${producto.descripcion || ''}</p>
            </div>
            <div id="btn-carro">
                <button class="producto-agregar">Agregar</button>
            </div>
        </div>
    `;
    contenedorDetalle.append(div);
}else{
    contenedorDetalle.innerHTML="<p>Producto no encontrado.</p>";
}
    
 

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
