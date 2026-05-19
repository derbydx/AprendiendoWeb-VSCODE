//Funcion para actualizar ano en el footer

function updateFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if(yearSpan){
        yearSpan.textContent = new Date().getFullYear();
    }
}

//Simulacio de envio de formulario (se reemplazará en el paso 7)

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

//Inicializamos funciones al cargar la página
document.addEventListener('DOMContentLoaded', function(){
    updateFooterYear();
    setupFormSimulation();

    //Otras inicializaciones pueden ir aquí en los pasos siguientes 
});