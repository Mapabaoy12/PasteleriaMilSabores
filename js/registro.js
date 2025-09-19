

    document.getElementById('formulario-registro').addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = this.querySelector('input[placeholder="Nombres"]').value.trim();
        const apellido = this.querySelector('input[placeholder="Apellidos"]').value.trim();
        const email = this.querySelector('input[placeholder="Correo electronico"]').value.trim();
        const password = this.querySelector('input[placeholder="Contraseña"]').value;

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        if (usuarios.some(u => u.email === email)) {
            alert('Este correo ya está registrado.');
            return;
        }

        usuarios.push({ nombre, apellido, email, password });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        window.location.href = 'inicioSesion.html';
    });
