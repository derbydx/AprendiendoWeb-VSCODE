// Función para actualizar año en el footer
function updateFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if(yearSpan){
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Simulación de envío de formulario (se reemplazará en el paso 7)
function setupFormValidation() {
    const form = document.getElementById('form-contacto');
    const statusMsg = document.querySelector('.form-status');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 1. Limpiar estados previos
            form.querySelectorAll('input, textarea').forEach(field => {
                field.classList.remove('is-invalid', 'is-valid');
            });

            // 2. Validaciones simples
            let isValid = true;
            const email = form.querySelector('#email');
            const mensaje = form.querySelector('#mensaje');

            // Validar email
            if (!email.value.includes('@')) {
                email.classList.add('is-invalid');
                isValid = false;
            } else {
                email.classList.add('is-valid');
            }

            // Validar longitud mensaje
            if (mensaje.value.length < 10) {
                mensaje.classList.add('is-invalid');
                isValid = false;
            } else {
                mensaje.classList.add('is-valid');
            }

            // 3. Resultado
            if (isValid) {
                statusMsg.textContent = "¡Gracias por contactarnos! Tu mensaje ha sido enviado correctamente.";
                form.reset();
                // Limpiar clases después de un segundo
                setTimeout(() => {
                    form.querySelectorAll('input, textarea').forEach(f => f.classList.remove('is-valid'));
                }, 2000);
            } else {
                statusMsg.textContent = "Por favor, corrige los errores en el formulario.";
            }
        });
    }
}


});

// Controla el menú en móviles
function setupNavigation() {
    const toggleBtn = document.querySelector('.nav__toggle');
    const menu = document.querySelector('.nav__menu');

    if (toggleBtn && menu) {
        toggleBtn.addEventListener('click', function() {
            // Verifica si el menú está abierto
            const isMenuOpen = menu.getAttribute('data-open') === 'true';
            
            // Lo cambia al estado contrario
            menu.setAttribute('data-open', !isMenuOpen);
            toggleBtn.setAttribute('aria-expanded', !isMenuOpen);
        });
    }
}



// Inicializamos funciones al cargar la página
// No olvides actualizar tu inicialización:
document.addEventListener('DOMContentLoaded', function(){
    updateFooterYear();
    setupFormValidation(); // <-- Reemplaza la antigua función
    setupNavigation();

});