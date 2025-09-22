document.addEventListener('DOMContentLoaded', () => {
    const usuarioNav = document.getElementById('usuario-nav');
    const iniciar = document.getElementById('iniciar');
    const registrar = document.getElementById('registrar');
    const cerrarSesion = document.getElementById('cerrar-sesion');
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (usuario) {
        // Crear enlace clickeable al perfil
        usuarioNav.innerHTML = `<a href="perfilUsuario.html" style="color: inherit; text-decoration: none;">Hola, ${usuario.nombre}</a>`;
        usuarioNav.style.cursor = 'pointer';
        usuarioNav.title = 'Ver mi perfil';
        
        if (iniciar) iniciar.style.display = 'none';
        if (registrar) registrar.style.display = 'none';
        if (cerrarSesion) cerrarSesion.style.display = 'inline';
    } else {
        usuarioNav.textContent = '';
        if (iniciar) iniciar.style.display = '';
        if (registrar) registrar.style.display = '';
        if (cerrarSesion) cerrarSesion.style.display = 'none';
    }

    if (cerrarSesion) {
        cerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('usuarioLogueado');
            window.location.reload();
        });
    }
});

