// Función para actualizar año en el footer
function updateFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if(yearSpan){
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Simulación de envío de formulario (se reemplazará en el paso 7)
function setupFormSimulation(){
    const form = document.querySelector('form');
    if (form){
        form.addEventListener('submit', function(e){
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            // Simulamos un proceso de envío
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;

            setTimeout(() => {
                alert ('Formulario enviado con éxito!');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                form.reset();
            }, 1500);
        });
    }
}

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
document.addEventListener('DOMContentLoaded', function(){
    updateFooterYear();
    setupFormSimulation();
    setupNavigation();
});