class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.successMessage = document.getElementById('form-success');
    }

    init() {
        this.form.setAttribute('novalidate', '');
        this.setupEventListeners();
        // Evaluamos el estado inicial del botón
        this.toggleSubmitButton();
    }

    setupEventListeners() {
        // Input en tiempo real
        this.form.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.validateField(e.target);
            }
            this.toggleSubmitButton();
        });

        // Blur (cuando el usuario sale del campo)
        this.form.addEventListener('blur', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.validateField(e.target);
            }
        }, true);

        // Submit
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    validateField(field) {
        const errorElement = document.getElementById(`${field.id}-error`);

        if (field.validity.valid) {
            this.setFieldValid(field, errorElement);
        } else {
            this.setFieldInvalid(field, errorElement);
        }
    }

    setFieldValid(field, errorElement) {
        field.classList.remove('form_input--error');
        field.classList.add('form_input--valid');

        if (errorElement) {
            errorElement.textContent = '';
            errorElement.setAttribute('aria-hidden', 'true');
        }
    }

    setFieldInvalid(field, errorElement) {
        field.classList.add('form_input--error');
        field.classList.remove('form_input--valid');

        // Utilizamos el API nativo de validación de HTML5
        // Esto generará automáticamente el mensaje en el idioma del navegador del usuario
        const message = field.validationMessage;

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.setAttribute('aria-hidden', 'false');
        }
    }

    toggleSubmitButton() {
        const isValid = this.form.checkValidity();
        this.submitButton.disabled = !isValid;
    }

    async handleSubmit() {
        if (!this.form.checkValidity()) {
            this.showAllErrors();
            return;
        }

        this.setLoadingState(true);

        try {
            await this.submitFormData();
            this.showSuccess();
            this.form.reset();
            this.resetValidation();
            this.moveFocusToSuccess();
        } catch (error) {
            this.showError('Error al enviar el formulario. Por favor, inténtalo de nuevo.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async submitFormData() {
        // Aquí podrías interceptar los datos con un webhook para automatizaciones (ej. n8n)
        const formData = new FormData(this.form);
        
        // Simulación de tiempo de red
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true };
    }

    setLoadingState(loading) {
        this.submitButton.classList.toggle('btn--loading', loading);
        this.submitButton.disabled = loading;
    }

    showSuccess() {
        this.successMessage.textContent = '¡Pedido enviado correctamente! Te contactaremos en breve.';
        this.successMessage.setAttribute('aria-hidden', 'false');
        this.successMessage.style.backgroundColor = '#d4edda';
        this.successMessage.style.color = '#155724';
    }

    showError(message) {
        this.successMessage.textContent = message;
        this.successMessage.style.backgroundColor = '#f8d7da';
        this.successMessage.style.color = '#721c24';
        this.successMessage.setAttribute('aria-hidden', 'false');
    }

    showAllErrors() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => this.validateField(field));

        const firstInvalidField = this.form.querySelector(':invalid');
        if (firstInvalidField) {
            firstInvalidField.focus();
        }
    }

    resetValidation() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.classList.remove('form_input--error', 'form_input--valid');
        });

        const errors = this.form.querySelectorAll('.form_error');
        errors.forEach(error => {
            error.textContent = '';
            error.setAttribute('aria-hidden', 'true');
        });

        this.successMessage.setAttribute('aria-hidden', 'true');
        this.toggleSubmitButton(); // Bloquear botón de nuevo al limpiar
    }

    moveFocusToSuccess() {
        setTimeout(() => {
            this.successMessage.focus();
            this.successMessage.setAttribute('tabindex', '-1');
        }, 100);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const validator = new FormValidator('pedido-form');
    validator.init();
});