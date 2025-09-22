// Panel de Vendedor - Funcionalidades básicas

// Verificar acceso de vendedor antes de cargar el panel
function verificarAccesoVendedor() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    
    if (!usuarioLogueado) {
        alert('Acceso denegado. Debes iniciar sesión para acceder al panel de vendedor.');
        window.location.href = 'inicioSesion.html';
        return false;
    }
    
    if (!usuarioLogueado.esAdministrador && !usuarioLogueado.esVendedor) {
        alert('Acceso denegado. Solo los vendedores y administradores pueden acceder a este panel.');
        window.location.href = 'home.html';
        return false;
    }
    
    return true;
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    if (!verificarAccesoVendedor()) {
        return;
    }
    mostrarDashboardVendedor();
});

let productos = JSON.parse(localStorage.getItem('productos')) || [];
let editandoIndice = -1;


// Mostrar dashboard del vendedor
function mostrarDashboardVendedor() {
    // Cambiar nav activo
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.getElementById('nav-dashboard').classList.add('active');
    
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    
    const contenido = `
        <h2 class="titulo-administrador">👨‍💼 Panel de Vendedor</h2>
        <div class="dashboard-stats">
            <div class="stat-card">
                <i class='bx bx-user'></i>
                <h3>${usuarioLogueado.nombre} ${usuarioLogueado.apellido}</h3>
                <p>Vendedor</p>
            </div>
            <div class="stat-card">
                <i class='bx bx-envelope'></i>
                <h3>${usuarioLogueado.email}</h3>
                <p>Email de acceso</p>
            </div>
            <div class="stat-card">
                <i class='bx bx-cake'></i>
                <h3>${productos.length}</h3>
                <p>Productos en catálogo</p>
            </div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #8B4513; margin-bottom: 10px;">ℹ️ Información del vendedor</h3>
            <p><strong>Fecha de registro:</strong> ${new Date(usuarioLogueado.fechaRegistroVendedor).toLocaleDateString()}</p>
            <p><strong>Permisos:</strong> Gestión de productos</p>
            <p><strong>Nivel de acceso:</strong> Limitado</p>
        </div>
    `;
    
    document.getElementById('contenido-principal').innerHTML = contenido;
}

// Mostrar gestión de productos
function mostrarGestionProductos() {
    // Cambiar nav activo
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.getElementById('nav-productos').classList.add('active');
    
    const contenido = `
        <h2 class="titulo-administrador">🛍️ Gestión de Productos</h2>
        <div class="productos-header">
            <h3>Lista de productos</h3>
            <button class="btn-agregar" onclick="abrirModalProducto()">
                <i class='bx bx-plus'></i>
                Agregar Producto
            </button>
        </div>
        <div class="productos-grid" id="productos-grid">
            ${mostrarProductos()}
        </div>
    `;
    
    document.getElementById('contenido-principal').innerHTML = contenido;
}

// Mostrar productos en grid
function mostrarProductos() {
    if (productos.length === 0) {
        return `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class='bx bx-cake' style="font-size: 64px; color: #ddd; margin-bottom: 20px;"></i>
                <h3 style="color: #666;">No hay productos registrados</h3>
                <p style="color: #999;">Haz clic en "Agregar Producto" para comenzar</p>
            </div>
        `;
    }
    
    return productos.map((producto, index) => `
        <div class="producto-card">
            <img src="${producto.imagen}" alt="${producto.titulo}" class="producto-imagen" 
                 onerror="this.src='../img/tortaqueso.jpg'">
            <div class="producto-info">
                <div class="producto-nombre">${producto.titulo}</div>
                <div class="producto-precio">$${producto.precio.toLocaleString()}</div>
                <div class="producto-detalles">
                    <strong>Forma:</strong> ${producto.forma}<br>
                    <strong>Tamaño:</strong> ${producto.tamanio}
                </div>
                <div class="producto-stock">
                    <i class='bx bx-package'></i>
                    Stock: ${producto.stock || 0} unidades
                </div>
                <div class="producto-acciones">
                    <button class="btn-accion btn-editar" onclick="editarProducto(${index})">
                        <i class='bx bx-edit'></i>
                        Editar
                    </button>
                    <button class="btn-accion btn-eliminar" onclick="eliminarProducto(${index})">
                        <i class='bx bx-trash'></i>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Abrir modal para agregar/editar producto
function abrirModalProducto(indice = -1) {
    editandoIndice = indice;
    const modal = document.getElementById('modalProducto');
    const titulo = document.getElementById('modalTitulo');
    const form = document.getElementById('formProducto');
    
    if (indice >= 0) {
        // Editando
        titulo.textContent = 'Editar Producto';
        const producto = productos[indice];
        document.getElementById('titulo').value = producto.titulo;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('forma').value = producto.forma;
        document.getElementById('tamanio').value = producto.tamanio;
        document.getElementById('imagen').value = producto.imagen;
        document.getElementById('descripcion').value = producto.descripcion;
        document.getElementById('stock').value = producto.stock || 0;
    } else {
        // Agregando
        titulo.textContent = 'Agregar Producto';
        form.reset();
        document.getElementById('stock').value = 10;
    }
    
    modal.style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('modalProducto').style.display = 'none';
    editandoIndice = -1;
}

// Guardar producto
document.getElementById('formProducto').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nuevoProducto = {
        titulo: document.getElementById('titulo').value,
        precio: parseInt(document.getElementById('precio').value),
        forma: document.getElementById('forma').value,
        tamanio: document.getElementById('tamanio').value,
        imagen: document.getElementById('imagen').value,
        descripcion: document.getElementById('descripcion').value,
        stock: parseInt(document.getElementById('stock').value) || 0,
        fechaCreacion: new Date().toISOString()
    };
    
    if (editandoIndice >= 0) {
        // Editando producto existente
        productos[editandoIndice] = { ...productos[editandoIndice], ...nuevoProducto };
        alert('✅ Producto actualizado exitosamente');
    } else {
        // Agregando nuevo producto
        productos.push(nuevoProducto);
        alert('✅ Producto agregado exitosamente');
    }
    
    localStorage.setItem('productos', JSON.stringify(productos));
    cerrarModal();
    mostrarGestionProductos();
});

// Editar producto
function editarProducto(indice) {
    abrirModalProducto(indice);
}

// Eliminar producto
function eliminarProducto(indice) {
    const producto = productos[indice];
    
    if (confirm(`¿Estás seguro de que quieres eliminar "${producto.titulo}"?`)) {
        productos.splice(indice, 1);
        localStorage.setItem('productos', JSON.stringify(productos));
        alert('🗑️ Producto eliminado exitosamente');
        mostrarGestionProductos();
    }
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('modalProducto');
    if (event.target === modal) {
        cerrarModal();
    }
}

// Cargar dashboard al iniciar
document.addEventListener('DOMContentLoaded', function() {
    mostrarDashboardVendedor();
});
