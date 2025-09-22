

    document.getElementById('formulario-inicioSesion').addEventListener('submit', function(e) {
        e.preventDefault();

        const email = this.querySelector('input[placeholder="Correo electronico"]').value.trim();
        const password = this.querySelector('input[placeholder="Contraseña"]').value;

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuario = usuarios.find(u => u.email === email && u.password === password);

        if (usuario) {
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
            
            // Migrar carrito temporal si existe (solo para usuarios no administradores)
            if (!usuario.esAdministrador) {
                migrarCarritoTemporal(usuario);
            }
            
            let mensaje = '¡Inicio de sesión exitoso!';
            let paginaDestino = 'home.html';
            
            // Mensaje y redirección para administradores (PRIORITARIO)
            if (usuario.esAdministrador) {
                mensaje += ' 🔐 ¡Bienvenido al Panel de Administración! Accediendo al sistema...';
                paginaDestino = 'administrador.html';
            }
            // Mensaje especial para usuarios DuocUC
            else if (usuario.esDuocUC && usuario.tortasGratis) {
                mensaje += ' 🎓 ¡Como estudiante/personal de DuocUC, todas las tortas son GRATIS para ti!';
            }
            // Mensaje para usuarios mayores de 50 años
            else if (usuario.esMayorDe50) {
                mensaje += ' Como cliente especial, disfrutarás de un 50% de descuento en todos nuestros productos.';
            }
            // Mensaje para usuarios con código promocional
            else if (usuario.tieneDescuentoPromocional) {
                mensaje += ` ¡Tienes activo el código ${usuario.nombrePromocion}! Disfrutarás de un ${usuario.porcentajeDescuentoPromocional}% de descuento en todos los productos.`;
            }
            
            alert(mensaje);
            window.location.href = paginaDestino;
        } else {
            alert('Correo o contraseña incorrectos.');
        }
        
    });

// Función para migrar carrito temporal cuando el usuario se loguea
function migrarCarritoTemporal(usuario) {
    const carritoTemporal = JSON.parse(localStorage.getItem('productos-en-carrito')) || [];
    
    if (carritoTemporal.length > 0) {
        console.log('Migrando carrito temporal para usuario logueado:', usuario.email);
        
        // Recalcular precios con descuentos del usuario
        const carritoActualizado = carritoTemporal.map(producto => {
            // Importar funciones de productos.js si están disponibles
            let precioConDescuento = producto.precioOriginal || producto.precio;
            let tieneDescuento = false;
            let infoDescuento = null;
            
            // Calcular descuentos según el tipo de usuario
            if (typeof calcularPrecioConDescuento === 'function') {
                precioConDescuento = calcularPrecioConDescuento(producto.precioOriginal || producto.precio);
                const infoDescuentos = obtenerInfoDescuentos();
                tieneDescuento = infoDescuentos.tieneDescuento;
                infoDescuento = infoDescuentos.etiquetas[0] || null;
            }
            
            return {
                ...producto,
                precio: precioConDescuento,
                precioOriginal: producto.precioOriginal || producto.precio,
                tieneDescuento: tieneDescuento,
                infoDescuento: infoDescuento
            };
        });
        
        // Guardar carrito con precios actualizados
        localStorage.setItem('productos-en-carrito', JSON.stringify(carritoActualizado));
        
        console.log('Carrito migrado con descuentos aplicados:', carritoActualizado);
    }
}
