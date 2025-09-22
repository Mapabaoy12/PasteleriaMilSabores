

    document.getElementById('formulario-registro').addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = this.querySelector('input[placeholder="Nombres"]').value.trim();
        const apellido = this.querySelector('input[placeholder="Apellidos"]').value.trim();
        const email = this.querySelector('input[placeholder="Correo electronico"]').value.trim();
        const password = this.querySelector('input[placeholder="Contraseña"]').value;
        const fechaNacimiento = this.querySelector('input[type="date"]').value;
        const codigoPromocional = this.querySelector('input[placeholder="Codigo promocional"]').value.trim();

        // Validar que los campos obligatorios estén completos
        if (!nombre || !apellido || !email || !password || !fechaNacimiento) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        // Calcular la edad
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mesActual = hoy.getMonth();
        const diaActual = hoy.getDate();
        const mesNacimiento = nacimiento.getMonth();
        const diaNacimiento = nacimiento.getDate();

        // Ajustar la edad si aún no ha cumplido años este año
        if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
            edad--;
        }

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        if (usuarios.some(u => u.email === email)) {
            alert('Este correo ya está registrado.');
            return;
        }

        // Crear objeto usuario base
        const nuevoUsuario = { 
            nombre, 
            apellido, 
            email, 
            password, 
            fechaNacimiento,
            edad
        };

        // Verificar si es administrador (correo @administrador.cl)
        const esAdministrador = email.toLowerCase().endsWith('@administrador.cl');
        if (esAdministrador) {
            nuevoUsuario.esAdministrador = true;
            nuevoUsuario.tipoUsuario = 'administrador';
            nuevoUsuario.permisos = ['gestion_productos', 'gestion_usuarios', 'reportes', 'dashboard'];
            nuevoUsuario.fechaRegistroAdmin = new Date().toISOString();
            nuevoUsuario.nivelAcceso = 'completo';
        }

        // Verificar si es vendedor (correo @vendedor.cl)
        const esVendedor = email.toLowerCase().endsWith('@vendedor.cl');
        if (esVendedor) {
            nuevoUsuario.esVendedor = true;
            nuevoUsuario.tipoUsuario = 'vendedor';
            nuevoUsuario.permisos = ['gestion_productos'];
            nuevoUsuario.fechaRegistroVendedor = new Date().toISOString();
            nuevoUsuario.nivelAcceso = 'limitado';
        }

        // Verificar si es estudiante/personal de DuocUC (correo @duocuc.cl)
        const esDuocUC = email.toLowerCase().endsWith('@duocuc.cl');
        if (esDuocUC) {
            nuevoUsuario.esDuocUC = true;
            nuevoUsuario.tortasGratis = true;
            nuevoUsuario.tipoUsuarioDuoc = 'estudiante_personal';
            nuevoUsuario.fechaRegistroDuoc = new Date().toISOString();
        }

        // Validar y agregar código promocional si se proporcionó
        if (codigoPromocional) {
            nuevoUsuario.codigoPromocional = codigoPromocional;
            
            // Validar códigos promocionales específicos
            if (codigoPromocional.toUpperCase() === 'FELICES50') {
                nuevoUsuario.tieneDescuentoPromocional = true;
                nuevoUsuario.porcentajeDescuentoPromocional = 10;
                nuevoUsuario.nombrePromocion = 'FELICES50';
            }
        }

        // Si el usuario tiene más de 50 años, agregar información adicional
        if (edad > 50) {
            nuevoUsuario.categoriaEspecial = 'adulto_mayor';
            nuevoUsuario.beneficios = ['descuentos_especiales', 'atencion_prioritaria'];
            nuevoUsuario.fechaRegistroEspecial = new Date().toISOString();
            nuevoUsuario.esMayorDe50 = true;
        }

        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        let mensaje = '¡Registro exitoso!';
        let redireccion = 'inicioSesion.html';
        
        // Mensaje para administradores (PRIORITARIO - acceso completo)
        if (esAdministrador) {
            mensaje += ' 🔐 ¡ADMINISTRADOR REGISTRADO! Tendrás acceso completo al panel de administración. 👨‍💼✨';
            redireccion = 'inicioSesion.html';
        }
        // Mensaje para vendedores (acceso limitado a productos)
        else if (esVendedor) {
            mensaje += ' 👨‍💼 ¡VENDEDOR REGISTRADO! Tendrás acceso al panel de gestión de productos. Serás redirigido automáticamente. 🛍️✨';
            
            // Guardar al usuario como logueado automáticamente
            localStorage.setItem('usuarioLogueado', JSON.stringify(nuevoUsuario));
            redireccion = 'vendedor.html';
        }
        // Mensaje para usuarios DuocUC (PRIORITARIO - tortas gratis)
        else if (esDuocUC) {
            mensaje += ' 🎉 ¡ESTUDIANTE/PERSONAL DUOCUC DETECTADO! ¡Todas las tortas son COMPLETAMENTE GRATIS para ti! 🍰✨';
        }
        // Mensaje para usuarios mayores de 50 años (solo si no es DuocUC, admin o vendedor)
        else if (edad > 50) {
            mensaje += ' Como cliente especial, tendrás acceso a un 50% de descuento en todos los productos.';
        }
        // Mensaje para código promocional (solo si no es DuocUC, admin o vendedor)
        else if (codigoPromocional && codigoPromocional.toUpperCase() === 'FELICES50') {
            mensaje += ' ¡Código promocional aplicado! Tendrás un 10% de descuento en todos los productos.';
        }

        // Si no es vendedor, agregar mensaje de inicio de sesión
        if (!esVendedor) {
            mensaje += ' Ahora puedes iniciar sesión.';
        }

        alert(mensaje);
        window.location.href = redireccion;
    });
