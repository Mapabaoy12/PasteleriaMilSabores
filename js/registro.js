

    document.getElementById('formulario-registro').addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = this.querySelector('input[placeholder="Nombres"]').value.trim();
        const apellido = this.querySelector('input[placeholder="Apellidos"]').value.trim();
        const email = this.querySelector('input[placeholder="Correo electronico"]').value.trim();
        const password = this.querySelector('input[placeholder="Contraseña"]').value;
        const fechaNacimiento = this.querySelector('input[type="date"]').value;
        const codigoPromocional = this.querySelector('input[placeholder="Codigo promocional"]').value.trim();

        // Validaciones específicas de campos obligatorios
        if (!nombre || !apellido || !email || !password) {
            alert('Por favor, completa todos los campos obligatorios (Nombre, Apellidos, Correo y Contraseña).');
            return;
        }

        // Validar longitud del nombre (máximo 50 caracteres)
        if (nombre.length > 50) {
            alert('El nombre no puede exceder 50 caracteres.');
            return;
        }

        // Validar longitud del apellido (máximo 100 caracteres)
        if (apellido.length > 100) {
            alert('Los apellidos no pueden exceder 100 caracteres.');
            return;
        }

        // Validar longitud del correo (máximo 100 caracteres)
        if (email.length > 100) {
            alert('El correo electrónico no puede exceder 100 caracteres.');
            return;
        }

        // Validar dominios de correo permitidos
        const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
        const correoValido = dominiosPermitidos.some(dominio => email.toLowerCase().endsWith(dominio));
        
        if (!correoValido) {
            alert('Solo se permiten correos con los dominios: @duoc.cl, @profesor.duoc.cl o @gmail.com');
            return;
        }

        // Calcular la edad solo si se proporcionó fecha de nacimiento
        let edad = null;
        if (fechaNacimiento) {
            const hoy = new Date();
            const nacimiento = new Date(fechaNacimiento);
            edad = hoy.getFullYear() - nacimiento.getFullYear();
            const mesActual = hoy.getMonth();
            const diaActual = hoy.getDate();
            const mesNacimiento = nacimiento.getMonth();
            const diaNacimiento = nacimiento.getDate();

            // Ajustar la edad si aún no ha cumplido años este año
            if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
                edad--;
            }
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
            password
        };

        // Agregar fecha de nacimiento y edad solo si se proporcionaron
        if (fechaNacimiento) {
            nuevoUsuario.fechaNacimiento = fechaNacimiento;
            nuevoUsuario.edad = edad;
        }

        // Verificar tipo de usuario basado en dominio de correo
        
        // Estudiantes/personal de DuocUC (correo @duoc.cl)
        const esDuocUC = email.toLowerCase().endsWith('@duoc.cl');
        if (esDuocUC) {
            nuevoUsuario.esDuocUC = true;
            nuevoUsuario.tipoUsuario = 'estudiante_duoc';
            nuevoUsuario.fechaRegistroDuoc = new Date().toISOString();
            nuevoUsuario.beneficios = ['torta_gratis_cumpleanos', 'descuentos_especiales'];
            // Inicializar el control de torta gratis de cumpleaños
            nuevoUsuario.tortaGratisCumpleanosUsada = false;
            nuevoUsuario.añoTortaGratisCumpleanos = null;
        }

        // Profesores de DuocUC (correo @profesor.duoc.cl)
        const esProfesorDuoc = email.toLowerCase().endsWith('@profesor.duoc.cl');
        if (esProfesorDuoc) {
            nuevoUsuario.esProfesorDuoc = true;
            nuevoUsuario.esAdministrador = true; // Profesores tienen acceso administrativo
            nuevoUsuario.tipoUsuario = 'profesor_duoc';
            nuevoUsuario.permisos = ['gestion_productos', 'gestion_usuarios', 'reportes', 'dashboard'];
            nuevoUsuario.fechaRegistroProfesor = new Date().toISOString();
            nuevoUsuario.nivelAcceso = 'completo';
            nuevoUsuario.beneficios = ['acceso_admin', 'descuentos_profesor'];
        }

        // Usuarios generales (correo @gmail.com)
        const esUsuarioGeneral = email.toLowerCase().endsWith('@gmail.com');
        if (esUsuarioGeneral) {
            nuevoUsuario.tipoUsuario = 'cliente_general';
            nuevoUsuario.fechaRegistroGeneral = new Date().toISOString();
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

        // Si el usuario tiene más de 50 años y proporcionó fecha de nacimiento
        if (edad && edad > 50) {
            nuevoUsuario.categoriaEspecial = 'adulto_mayor';
            if (!nuevoUsuario.beneficios) nuevoUsuario.beneficios = [];
            nuevoUsuario.beneficios.push('descuentos_especiales', 'atencion_prioritaria');
            nuevoUsuario.fechaRegistroEspecial = new Date().toISOString();
            nuevoUsuario.esMayorDe50 = true;
        }

        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        let mensaje = '¡Registro exitoso!';
        let redireccion = 'inicioSesion.html';
        
        // Mensaje para profesores DuocUC (PRIORITARIO - acceso administrativo)
        if (esProfesorDuoc) {
            mensaje += ' 🎓 ¡PROFESOR DUOCUC REGISTRADO! Tendrás acceso completo al panel de administración como profesor. ';
            redireccion = 'inicioSesion.html';
        }
        // Mensaje para estudiantes DuocUC (beneficio especial de cumpleaños)
        else if (esDuocUC) {
            mensaje += ' � ¡ESTUDIANTE DUOCUC DETECTADO!  En tu cumpleaños podrás elegir UNA torta completamente GRATIS del catálogo. ¡Felicidades! ';
        }
        // Mensaje para usuarios generales de Gmail
        else if (esUsuarioGeneral) {
            mensaje += '  ¡Bienvenido cliente! Tu cuenta ha sido creada exitosamente.';
        }
        
        // Mensaje adicional para usuarios mayores de 50 años
        if (edad && edad > 50) {
            mensaje += '  Como cliente especial mayor de 50 años, tendrás acceso a descuentos especiales.';
        }
        
        // Mensaje para código promocional
        if (codigoPromocional && codigoPromocional.toUpperCase() === 'FELICES50') {
            mensaje += '  ¡Código promocional aplicado! Tendrás un 10% de descuento en todos los productos.';
        }

        mensaje += ' Ahora puedes iniciar sesión.';

        alert(mensaje);
        window.location.href = redireccion;
    });
