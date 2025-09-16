const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));

const carroVacio = document.querySelector("#carro-vacio");
const carroProductos = document.querySelector("#carro-productos");
const carroOpciones = document.querySelector("#carro-opciones");
const carroComprado = document.querySelector("#carro-comprado");

if (productosEnCarrito){

    carroVacio.classList.add("disabled");
    carroProductos.classList.remove("disabled");
    carroOpciones.classList.remove("disabled");
    carroComprado.classList.add("disabled");

    carroProductos.innerHTML = "";

  






    productosEnCarrito.forEach(producto => {
        const div = document.createElement("div"); 
        div.classList.add("carrito-producto");
        div.innerHTML = `<img class="carro-img" src="${producto.imagen}" alt="${producto.titulo}">
        <div class="carro-producto-titulo">
            <small></small>
            <h3>${producto.titulo}</h3>
        </div>
        <div class="carro-producto-cantidad">
            <small>Cantidad</small>
            <p>${producto.cantidad}</p>
        </div>
        <div class="carro-producto-precio">
            <small>Precio</small>
            <p>$${producto.precio}</p>
        </div>
        <div class="carro-producto-subtotal">
            <small>subtotal</small>
            <p>$${producto.precio * producto.cantidad}</p>
        </div>
        <button id="${producto.id}" class="carro-producto-eliminar"><i class='bx  bx-trash'  ></i> </i> </button>`;

        carroProductos.append(div);
                        
        
         
    })

}else{

};