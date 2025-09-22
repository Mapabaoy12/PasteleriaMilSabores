// JavaScript básico para perfil de usuario
document.addEventListener('DOMContentLoaded', function() {
    cargarPerfilUsuario();
    
    // Evento del botón cerrar sesión
    document.getElementById('cerrar-sesion').addEventListener('click', function(e) {
        e.preventDefault();
        cerrarSesion();
    });
});

function cargarPerfilUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
    
    if (!usuario) {
        alert('No hay usuario logueado');
        window.location.href = 'inicioSesion.html';
        return;
    }
    
    mostrarPerfilUsuario(usuario);
}

function mostrarPerfilUsuario(usuario) {
    const contenedor = document.getElementById('perfil-contenido');
    
    contenedor.innerHTML = `
        <div class="perfil-header">
            <div class="perfil-avatar">
                ${(usuario.nombre.charAt(0) + (usuario.apellido ? usuario.apellido.charAt(0) : '')).toUpperCase()}
            </div>
            <h2>${usuario.nombre} ${usuario.apellido || ''}</h2>
            <p>${usuario.email}</p>
            ${mostrarBeneficios(usuario)}
        </div>
        
        <div class="perfil-info">
            <div class="info-card">
                <h3>Información Personal</h3>
                <p><strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellido || ''}</p>
                <p><strong>Email:</strong> ${usuario.email}</p>
                <p><strong>Edad:</strong> ${usuario.edad} años</p>
                <p><strong>Tipo:</strong> ${obtenerTipoUsuario(usuario)}</p>
            </div>
            
            <div class="info-card">
                <h3>Historial de Compras</h3>
                ${mostrarHistorialCompras(usuario)}
            </div>
        </div>
    `;
}

function mostrarBeneficios(usuario) {
    let beneficios = [];
    
    if (usuario.esDuocUC && usuario.tortasGratis) {
        beneficios.push('<span style="background: #17a2b8; color: white; padding: 5px 10px; border-radius: 5px;">🎓 DuocUC - Tortas Gratis</span>');
    } else if (usuario.esMayorDe50) {
        beneficios.push('<span style="background: #856404; color: white; padding: 5px 10px; border-radius: 5px;">👴 50% Descuento</span>');
    } else if (usuario.tieneDescuentoPromocional) {
        beneficios.push(`<span style="background: #721c24; color: white; padding: 5px 10px; border-radius: 5px;">🎟️ ${usuario.porcentajeDescuentoPromocional}% OFF</span>`);
    }
    
    return beneficios.length > 0 ? `<div style="margin-top: 10px;">${beneficios.join(' ')}</div>` : '';
}

function obtenerTipoUsuario(usuario) {
    if (usuario.esDuocUC) return 'DuocUC';
    if (usuario.esMayorDe50) return 'Adulto Mayor';
    if (usuario.tieneDescuentoPromocional) return 'Promocional';
    return 'Normal';
}

function mostrarHistorialCompras(usuario) {
    const historial = JSON.parse(localStorage.getItem('historial-compras')) || [];
    const comprasUsuario = historial.filter(compra => compra.emailUsuario === usuario.email);
    
    if (comprasUsuario.length === 0) {
        return '<p>No tienes compras realizadas</p><button onclick="window.location.href=\'catalogo.html\'">Ver Productos</button>';
    }
    
    let html = '<ul>';
    comprasUsuario.slice(0, 5).forEach(compra => {
        html += `<li>Orden #${compra.numeroOrden} - ${compra.fechaLegible} - Total: $${compra.total}</li>`;
    });
    html += '</ul>';
    
    if (comprasUsuario.length > 5) {
        html += `<p>Y ${comprasUsuario.length - 5} compras más...</p>`;
    }
    
    return html;
}



// Cerrar sesión
function cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('usuarioLogueado');
        window.location.href = 'inicioSesion.html';
    }
}