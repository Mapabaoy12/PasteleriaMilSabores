
// Función para verificar si es el cumpleaños del usuario
function esElCumpleanosDelUsuario(usuario) {
    if (!usuario.fechaNacimiento) return false;
    
    const hoy = new Date();
    const fechaNacimiento = new Date(usuario.fechaNacimiento);
    
    return hoy.getDate() === fechaNacimiento.getDate() && 
           hoy.getMonth() === fechaNacimiento.getMonth();
}

// Función para verificar si el usuario ya usó su torta gratis de cumpleaños este año
function yaUsoTortaGratisCumpleanos(usuario) {
    const hoy = new Date();
    const añoActual = hoy.getFullYear();
    
    return usuario.tortaGratisCumpleanosUsada && 
           usuario.añoTortaGratisCumpleanos === añoActual;
}

// Función para obtener información de descuentos del usuario actual
function obtenerInfoDescuentos() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (!usuario) return { 
        tieneDescuento: false, 
        porcentajeDescuento: 0,
        etiquetas: [],
        descuentos: [],
        tortaGratisCumpleanos: false
    };

    let descuentos = [];
    let descuentoTotal = 0;
    let etiquetas = [];
    let tortaGratisCumpleanos = false;

    // TORTA GRATIS PARA DUOCUC EN CUMPLEAÑOS (MÁXIMA PRIORIDAD - solo una vez al año)
    if (usuario.esDuocUC === true && esElCumpleanosDelUsuario(usuario) && !yaUsoTortaGratisCumpleanos(usuario)) {
        tortaGratisCumpleanos = true;
        descuentos.push({ 
            tipo: 'cumpleanos_duocuc', 
            porcentaje: 100, 
            etiqueta: '� TORTA GRATIS Cumpleaños DuocUC' 
        });
    }
    // Descuento por edad (50% - prioritario si no es DuocUC)
    else if (usuario.esMayorDe50 === true) {
        descuentos.push({ tipo: 'edad', porcentaje: 50, etiqueta: '50% OFF Adulto Mayor' });
    }
    // Descuento promocional (10% - si no es DuocUC ni +50)
    else if (usuario.tieneDescuentoPromocional && usuario.porcentajeDescuentoPromocional) {
        descuentos.push({ 
            tipo: 'promocional', 
            porcentaje: usuario.porcentajeDescuentoPromocional, 
            etiqueta: `${usuario.porcentajeDescuentoPromocional}% OFF ${usuario.nombrePromocion}` 
        });
    }

    // Si hay descuentos, aplicar el mayor (no acumulativo para evitar precios negativos)
    if (descuentos.length > 0) {
        const mayorDescuento = descuentos.reduce((max, desc) => 
            desc.porcentaje > max.porcentaje ? desc : max
        );
        descuentoTotal = mayorDescuento.porcentaje;
        etiquetas = [mayorDescuento.etiqueta];
    }

    return {
        tieneDescuento: descuentos.length > 0,
        porcentajeDescuento: descuentoTotal,
        etiquetas: etiquetas,
        descuentos: descuentos,
        tortaGratisCumpleanos: tortaGratisCumpleanos
    };
}

// Función para verificar si el usuario actual tiene descuento de adulto mayor (mantener compatibilidad)
function usuarioTieneDescuentoAdultoMayor() {
    const info = obtenerInfoDescuentos();
    return info.descuentos.some(d => d.tipo === 'edad');
}

// Función para calcular el precio con descuento si aplica
function calcularPrecioConDescuento(precioOriginal) {
    const info = obtenerInfoDescuentos();
    if (info.tieneDescuento) {
        const descuento = precioOriginal * (info.porcentajeDescuento / 100);
        return Math.round(precioOriginal - descuento);
    }
    return precioOriginal;
}

// Función para marcar que el usuario usó su torta gratis de cumpleaños
function marcarTortaGratisCumpleanosUsada() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (usuario) {
        const hoy = new Date();
        usuario.tortaGratisCumpleanosUsada = true;
        usuario.añoTortaGratisCumpleanos = hoy.getFullYear();
        usuario.fechaUsoTortaGratis = hoy.toISOString();
        
        // Actualizar usuario logueado
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
        
        // Actualizar en la lista de usuarios
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const index = usuarios.findIndex(u => u.email === usuario.email);
        if (index !== -1) {
            usuarios[index] = usuario;
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }
    }
}

// Función para verificar si puede aplicar torta gratis de cumpleaños a un producto específico
function puedeAplicarTortaGratisCumpleanos() {
    const info = obtenerInfoDescuentos();
    return info.tortaGratisCumpleanos;
}

// Función para obtener el texto del precio con indicador de descuento
function obtenerTextoPrecionConDescuento(precioOriginal) {
    const info = obtenerInfoDescuentos();
    if (info.tieneDescuento) {
        const precioConDescuento = calcularPrecioConDescuento(precioOriginal);
        let textoDescuento = '';
        
        if (info.tortaGratisCumpleanos) {
            textoDescuento = `
                <div class="precio-con-descuento cumpleanos">
                    <span class="precio-original">$${precioOriginal}</span>
                    <span class="precio-gratis">¡GRATIS!</span>
                    <span class="etiqueta-descuento cumpleanos">${info.etiquetas[0]}</span>
                    <small class="aviso-cumpleanos">⚠️ Solo una torta gratis por cumpleaños</small>
                </div>
            `;
        } else {
            textoDescuento = `
                <div class="precio-con-descuento">
                    <span class="precio-original">$${precioOriginal}</span>
                    <span class="precio-descuento">$${precioConDescuento}</span>
                    <span class="etiqueta-descuento">${info.etiquetas[0]}</span>
                </div>
            `;
        }
        
        return textoDescuento;
    }
    return `$${precioOriginal}`;
}

const productos = [
    {
        id:1,
        titulo: "Torta Chocolate Especial",
        imagen : "../img/circulares/tortacircular1.webp",
        forma : "Circulares",
        tamanio : "Grande",
        precio : 10000,
        descripcion :  "Deliciosa torta de chocolate con cobertura cremosa y decoración elegante",
        stock: 15

    },
     {
        id:2,
        titulo: "Torta Celebración",
        imagen : "../img/circulares/tortacircular2.gif",
        forma : "Circulares",
        tamanio :"Grande",
        precio : 7500,
        descripcion :  "Torta perfecta para celebraciones especiales con decoración colorida",
        stock: 12

    },
     {
        id:3,
        titulo: "Torta Vainilla Premium",
        imagen : "../img/circulares/tortacircular3.jpg",
        forma : "Circulares",
        tamanio :"Grande",
        precio : 7500,
        descripcion :  "Suave torta de vainilla con frosting cremoso y frutas frescas",
        stock: 8

    },
    {
        id:4,
        titulo: "Torta Red Velvet",
        imagen : "../img/circulares/tortacircular4.webp",
        forma : "Circulares",
        tamanio :"Grande",
        precio : 11990,
        descripcion :  "Clásica torta red velvet con queso crema y acabado aterciopelado",
        stock: 6

    },
    {
        id:5,
        titulo: "Torta Frutas Tropicales",
        imagen : "../img/circulares/tortacircular5.jpg",
        forma : "Circulares",
        tamanio :"Grande",
        precio : 10000,
        descripcion :  "Refrescante torta con frutas tropicales y crema chantilly",
        stock: 10

    },
    {
        id:6,
        titulo: "Mini Torta Chocolate",
        imagen : "../img/circulares/tortacircularpeque1.jpeg",
        forma : "Circulares",
        tamanio : "Pequenia",
        precio : 5000,
        descripcion :  "Pequeña torta de chocolate ideal para ocasiones íntimas",
        stock: 20
    },
    {
        id:7,
        titulo: "Mini Torta Vainilla",
        imagen : "../img/circulares/tortacircularpeque3.webp",
        forma : "Circulares",
        tamanio :"Pequenia",
        precio : 3490,
        descripcion :  "Delicada mini torta de vainilla con decoración sencilla",
        stock: 25

    },
    {
        id:8,
        titulo: "Mini Torta Fresa",
        imagen : "../img/circulares/tortacircularpeque5.webp",
        forma : "Circulares",
        tamanio : "Pequenia",
        precio : 4990,
        descripcion :  "Mini torta con sabor a fresa y cobertura rosada",
        stock: 18

    },
    {
        id:9,
        titulo: "Torta Cuadrada Chocolate",
        imagen : "../img/cuadradas/tortacuadrada1.jpg",
        forma : "Cuadrada",
        tamanio : "Grande",
        precio : 9990,
        descripcion :  "Elegante torta cuadrada de chocolate con ganache brillante",
        stock: 7

    },
    {
        id:10,
        titulo: "Torta Cuadrada Caramelo",
        imagen : "../img/cuadradas/tortacuadrada2.jpg",
        forma : "Cuadrada",
        tamanio :"Grande",
        precio : 8990,
        descripcion :  "Torta cuadrada con delicioso sabor a caramelo y nueces",
        stock: 5

    },
    {
        id:11,
        titulo: "Torta Cuadrada Limón",
        imagen : "../img/cuadradas/tortacuadrada3.jpg",
        forma : "Cuadrada",
        tamanio : "Grande",
        precio : 8500,
        descripcion :  "Refrescante torta cuadrada de limón con merengue",
        stock: 12

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
        titulo: "Torta Cuadrada de Chocolate",
        imagen : "../img/cuadradas/tortacuadradapeque6.png",
        forma : "Cuadrada",
        tamanio : "Pequenia",
        precio : 45.000,
        descripcion :  "mish"

    }
    
]

