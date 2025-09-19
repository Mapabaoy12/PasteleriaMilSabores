const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [] ;

const carroVacio = document.querySelector("#carro-vacio");
const carroProductos = document.querySelector("#carro-productos");
const carroOpciones = document.querySelector("#carro-opciones");
const carroComprado = document.querySelector("#carro-comprado");
const botonVaciar = document.querySelector(".carro-acciones-v")
const botonComprar = document.querySelector(".carro-acciones-comprar");
let botonEliminar = document.querySelectorAll(".carro-producto-eliminar");
const total = document.querySelector("#total")

function cargarProductosCarrito(){


    if (productosEnCarrito && productosEnCarrito.length > 0  ){

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
        carroVacio.classList.remove("disabled");
        carroProductos.classList.add("disabled");
        carroOpciones.classList.add("disabled");
        carroComprado.classList.add("disabled");

    };
    actualizarBotonesEliminar();
    actualizarTotal();
}
cargarProductosCarrito();


function actualizarBotonesEliminar() {
    botonEliminar = document.querySelectorAll(".carro-producto-eliminar");

    botonEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito)
    });
};

function eliminarDelCarrito(e){
    const idBoton = parseInt(e.currentTarget.id);
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    productosEnCarrito.splice(index,1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
};

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito () {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito))
    cargarProductosCarrito();

};



function actualizarTotal() {
    const totalCalculado =  productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado}`;
 
};

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito () {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    carroVacio.classList.add("disabled");
        carroProductos.classList.add("disabled");
        carroOpciones.classList.add("disabled");
        carroComprado.classList.remove("disabled");


};
