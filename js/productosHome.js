/*Listado de productos destacados*/
/*Puede ser el mismo listado que en catalogo.js o uno diferente con ofertas y promociones*/
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

    }

];

const contenedorProductosDestacados = document.querySelector
("#contenedor-pd")

function cargarProductos(lista = productos) {
    contenedorProductosDestacados.innerHTML = "";
    lista.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-informacion">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio} c/u</p>
                <button class="producto-pagina" id="${producto.id}">Me interesa</button>
            </div>
        `;
        contenedorProductosDestacados.append(div);
    });
}

cargarProductos();