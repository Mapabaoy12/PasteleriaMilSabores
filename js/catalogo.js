
const productos = [
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

    },
    {
        id:5,
        titulo: "Torta5",
        imagen : "../img/circulares/tortacircular5.jpg",
        forma : "Circulares",
        tamanio :"Grande",
        precio : 10000

    },
    {
        id:6,
        titulo: "Torta6",
        imagen : "../img/circulares/tortacircularpeque1.jpeg",
        forma : "Circulares",
        tamanio : "Pequenia",
        precio : 5000
    },
    {
        id:7,
        titulo: "Torta7",
        imagen : "../img/circulares/tortacircularpeque3.webp",
        forma : "Circulares",
        tamanio :"Pequenia",
        precio : 3490

    },
    {
        id:8,
        titulo: "Torta8",
        imagen : "../img/circulares/tortacircularpeque5.webp",
        forma : "Circulares",
        tamanio : "Pequenia",
        precio : 4990

    },
    {
        id:9,
        titulo: "Torta9",
        imagen : "../img/cuadradas/tortacuadrada1.jpg",
        forma : "Cuadrada",
        tamanio : "Grande",
        precio : 4990

    },
    {
        id:10,
        titulo: "Torta10",
        imagen : "../img/cuadradas/tortacuadrada2.jpg",
        forma : "Cuadrada",
        tamanio :"Grande",
        precio : 4990

    },
    {
        id:11,
        titulo: "Torta11",
        imagen : "../img/cuadradas/tortacuadrada3.jpg",
        forma : "Cuadrada",
        tamanio : "Grande",
        precio : 4990

    },
    {
        id:12,
        titulo: "Torta12",
        imagen : "../img/cuadradas/tortacuadrada4.jpg",
        forma : "Cuadrada",
        tamanio : "Grande",
        precio : 4990

    },
    {
        id:13,
        titulo: "Torta13",
        imagen : "../img/cuadradas/tortacuadrada5.jpg",
        forma : "Cuadrada",
        tamanio :"Grande",
        precio : 4990

    },
    {
        id:14,
        titulo: "Torta14",
        imagen : "../img/cuadradas/tortacuadradapeque1.jpg",
        forma : "Cuadrada",
        tamanio : "Pequenia",
        precio : 4990

    },
    {
        id:15,
        titulo: "Torta15",
        imagen : "../img/cuadradas/tortacuadradapeque2.jpg",
        forma : "Cuadrada",
        tamanio : "Pequenia",
        precio : 4990

    },
    {
        id:16,
        titulo: "Torta16",
        imagen : "../img/cuadradas/tortacuadradapeque3.webp",
        forma : "Cuadrada",
        tamanio : "Pequenia",
        precio : 4990

    },
    {
        id:17,
        titulo: "Torta17",
        imagen : "../img/cuadradas/tortacuadradapeque4.jpg",
        forma : "Cuadrada",
        tamanio : "Pequenia",
        precio : 4990

    },
    {
        id:18,
        titulo: "Torta18",
        imagen : "../img/cuadradas/tortacuadradapeque5.jpg",
        forma : "Cuadrada",
        tamanio : "Pequenia",
        precio : 4990

    },
    {
        id:19,
        titulo: "Torta9",
        imagen : "../img/cuadradas/tortacuadrada1.jpg",
        forma : "Cuadrada",
        tamanio : "Pequenia",
        precio : 4990

    },
    
]
const contenedorProductos = document.querySelector
("#contenedor-p")
const botonesFiltro = document.querySelectorAll(".botones-filtro")

let botonesAgregar = document.querySelectorAll(".producto-agregar");

const numerito = document.querySelector("#numerito")

function cargarProductos(lista = productos) {
    contenedorProductos.innerHTML = "";
    lista.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-informacion">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio} c/u</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div);
    });
    actualizarBotonesAgregar();
}


cargarProductos();

botonesFiltro.forEach(boton => { 
    boton.addEventListener("click", (e) => {
        const forma = e.currentTarget.dataset.forma;
        const tamanio = e.currentTarget.dataset.tamanio;

        let filtrados = productos;

        if (forma) {
            filtrados = filtrados.filter(p => p.forma === forma);
        }

        if (tamanio) {
            filtrados = filtrados.filter(p => p.tamanio === tamanio);
        }

        cargarProductos(filtrados);
    });
});

const btnLimpiar = document.querySelector("#btn-limpiar");

btnLimpiar.addEventListener("click", () => {
    // desmarcar todos los checkboxes
    document.querySelectorAll(".filtros input[type='checkbox']").forEach(chk => {
        chk.checked = false;
    });

    // recargar todos los productos
    cargarProductos(productos);
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => (
        boton.addEventListener("click", agregarAlCarrito)
    ));

};

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
};


function agregarAlCarrito(e){

    const idBoton = parseInt(e.currentTarget.id);
    const productoAgregado = productos.find(producto => producto.id === idBoton
    );
    if(productosEnCarrito.some(producto => producto.id === idBoton )){
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    productosEnCarrito[index].cantidad++;
    } else {
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
    }
    console.log(productosEnCarrito);

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito)); //local store asi bien brigido para luego poder seguir en el carrito

};

function actualizarNumerito(){
    let newNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)
    numerito.innerText = newNumerito;
}