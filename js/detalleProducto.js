const parametro = new URLSearchParams(window.location.search);
const idProducto = parametro.get('id');
const productos = JSON.parse(localStorage.getItem("productos"))  || [];
const producto = productos.find(producto => producto.id == idProducto);
const contenedorDetalle = document.querySelector("#contenedor-d");

//Tuve que hacer esto ya que no estamos trabajando con base de datos para tener todos los productos en todo momento y no craneo un metodo mas eficiente la verdad.
if (!localStorage.getItem("productos")) {
    localStorage.setItem("productos", JSON.stringify([
        {
        id:1,
        titulo: "Torta1",
        imagen : "../img/circulares/tortacircular1.webp",
        forma : "Circulares",
        tamanio : "Grande",
        precio : 10000,
        descripcion :  "mish"

    },
     {
        id:2,
        titulo: "Torta2",
        imagen : "../img/circulares/tortacircular2.gif",
        forma : "Circulares",
        tamanio :"Grande",
        precio : 7500,
        descripcion :  "mish"

    },
     {
        id:3,
        titulo: "Torta3",
        imagen : "../img/circulares/tortacircular3.jpg",
        forma : "Circulares",
        tamanio :"Grande",
        precio : 7500,
        descripcion :  "mish"

    },
    {
        id:4,
        titulo: "Torta4",
        imagen : "../img/circulares/tortacircular4.webp",
        forma : "Circulares",
        tamanio :"Grande",
        precio : 11990,
        descripcion :  "mish"

    },
    {
        id:5,
        titulo: "Torta5",
        imagen : "../img/circulares/tortacircular5.jpg",
        forma : "Circulares",
        tamanio :"Grande",
        precio : 10000,
        descripcion :  "mish"

    },
    {
        id:6,
        titulo: "Torta6",
        imagen : "../img/circulares/tortacircularpeque1.jpeg",
        forma : "Circulares",
        tamanio : "Pequenia",
        precio : 5000,
        descripcion :  "mish"
    },
    {
        id:7,
        titulo: "Torta7",
        imagen : "../img/circulares/tortacircularpeque3.webp",
        forma : "Circulares",
        tamanio :"Pequenia",
        precio : 3490,
        descripcion :  "mish"

    },
    {
        id:8,
        titulo: "Torta8",
        imagen : "../img/circulares/tortacircularpeque5.webp",
        forma : "Circulares",
        tamanio : "Pequenia",
        precio : 4990,
        descripcion :  "mish"

    },
    {
        id:9,
        titulo: "Torta9",
        imagen : "../img/cuadradas/tortacuadrada1.jpg",
        forma : "Cuadrada",
        tamanio : "Grande",
        precio : 4990,
        descripcion :  "mish"

    },
    {
        id:10,
        titulo: "Torta10",
        imagen : "../img/cuadradas/tortacuadrada2.jpg",
        forma : "Cuadrada",
        tamanio :"Grande",
        precio : 4990,
        descripcion :  "mish"

    },
    {
        id:11,
        titulo: "Torta11",
        imagen : "../img/cuadradas/tortacuadrada3.jpg",
        forma : "Cuadrada",
        tamanio : "Grande",
        precio : 4990,
        descripcion :  "mish"

    },
    {
        id:12,
        titulo: "Torta12",
        imagen : "../img/cuadradas/tortacuadrada4.jpg",
        forma : "Cuadrada",
        tamanio : "Grande",
        precio : 4990,
        descripcion :  "mish"

    },
    {
        id:13,
        titulo: "Torta13",
        imagen : "../img/cuadradas/tortacuadrada5.jpg",
        forma : "Cuadrada",
        tamanio :"Grande",
        precio : 4990,
        descripcion :  "mish"

    },
    {
        id:14,
        titulo: "Torta14",
        imagen : "../img/cuadradas/tortacuadradapeque1.jpg",
        forma : "Cuadrada",
        tamanio : "Pequenia",
        precio : 4990,
        descripcion :  "mish"

    },
    {
        id:15,
        titulo: "Torta15",
        imagen : "../img/cuadradas/tortacuadradapeque2.jpg",
        forma : "Cuadrada",
        tamanio : "Pequenia",
        precio : 4990,
        descripcion :  "mish"

    },
    {
        id:16,
        titulo: "Torta16",
        imagen : "../img/cuadradas/tortacuadradapeque3.webp",
        forma : "Cuadrada",
        tamanio : "Pequenia",
        precio : 4990,
        descripcion :  "mish"

    },
    {
        id:17,
        titulo: "Torta17",
        imagen : "../img/cuadradas/tortacuadradapeque4.jpg",
        forma : "Cuadrada",
        tamanio : "Pequenia",
        precio : 4990,
        descripcion :  "mish"

    },
    {
        id:18,
        titulo: "Torta18",
        imagen : "../img/cuadradas/tortacuadradapeque5.jpg",
        forma : "Cuadrada",
        tamanio : "Pequenia",
        precio : 4990,
        descripcion :  "mish"

    },
    {
        id:19,
        titulo: "Torta9",
        imagen : "../img/cuadradas/tortacuadradapeque6.png",
        forma : "Cuadrada",
        tamanio : "Pequenia",
        precio : 4990,
        descripcion :  "mish"

    }
    ]));
}

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
