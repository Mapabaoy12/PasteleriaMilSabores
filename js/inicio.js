

    document.getElementById('formulario-inicioSesion').addEventListener('submit', function(e) {
        e.preventDefault();

        const email = this.querySelector('input[placeholder="Correo electronico"]').value.trim();
        const password = this.querySelector('input[placeholder="Contraseña"]').value;

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuario = usuarios.find(u => u.email === email && u.password === password);

        if (usuario) {
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
            alert('¡Inicio de sesión exitoso!');
            window.location.href = 'home.html';
        } else {
            alert('Correo o contraseña incorrectos.');
        }
    });
