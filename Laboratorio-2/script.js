/**
 * FormValidator
 * Maneja validación en tiempo real y envío para formularios HTML.
 * 
 * @param {string} formId        - ID del formulario a validar
 * @param {string} successId     - ID del div donde mostrar el mensaje de éxito/error
 * @param {string} [submitLabel] - Texto de éxito a mostrar tras envío exitoso
 */
class FormValidator {
    constructor(formId, successId, submitLabel = '¡Enviado correctamente! Te contactaremos en breve.') {
        this.form = document.getElementById(formId);
        if (!this.form) return; // Seguridad: el form no existe en esta página

        this.successMessage = document.getElementById(successId);
        this.submitButton   = this.form.querySelector('button[type="submit"]');
        this.submitLabel    = submitLabel;
    }

    init() {
        if (!this.form) return;

        this.form.setAttribute('novalidate', '');
        this.setupEventListeners();
        this.toggleSubmitButton();
    }

    setupEventListeners() {
        // Validación en tiempo real al escribir
        this.form.addEventListener('input', (e) => {
            const el = e.target;
            if (el.matches('input, textarea, select')) {
                this.validateField(el);
            }
            this.toggleSubmitButton();
        });

        // Validación al salir del campo (blur)
        this.form.addEventListener('blur', (e) => {
            const el = e.target;
            if (el.matches('input, textarea, select')) {
                this.validateField(el);
            }
        }, true);

        // Envío del formulario
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    validateField(field) {
        const errorEl = document.getElementById(`${field.id}-error`);

        if (field.validity.valid) {
            this.setFieldValid(field, errorEl);
        } else {
            this.setFieldInvalid(field, errorEl);
        }
    }

    setFieldValid(field, errorEl) {
        field.classList.remove('form_input--error');
        field.classList.add('form_input--valid');

        if (errorEl) {
            errorEl.textContent = '';
            errorEl.setAttribute('aria-hidden', 'true');
        }
    }

    setFieldInvalid(field, errorEl) {
        field.classList.add('form_input--error');
        field.classList.remove('form_input--valid');

        // Mensaje en el idioma del navegador del usuario (API nativa de validación HTML5)
        const message = field.validationMessage;

        if (errorEl) {
            errorEl.textContent = message;
            errorEl.setAttribute('aria-hidden', 'false');
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
            this.showSuccess(this.submitLabel);
            this.form.reset();
            this.resetValidation();
            this.moveFocusToSuccess();
        } catch (error) {
            console.error('Error en el envío:', error);
            this.showError('Error al enviar. Por favor, inténtalo de nuevo.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async submitFormData() {
        /**
         * Aquí puedes conectar con tu backend, API o webhook (ej. n8n).
         * Ejemplo real:
         * 
         * const formData = new FormData(this.form);
         * const response = await fetch('https://tu-webhook.com/endpoint', {
         *     method: 'POST',
         *     body: formData
         * });
         * if (!response.ok) throw new Error('Error del servidor');
         * return response.json();
         */

        // Simulación de tiempo de red (eliminar cuando conectes el backend real)
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true };
    }

    setLoadingState(isLoading) {
        this.submitButton.classList.toggle('btn--loading', isLoading);
        this.submitButton.disabled = isLoading;
    }

    showSuccess(message) {
        if (!this.successMessage) return;
        this.successMessage.textContent = message;
        this.successMessage.style.backgroundColor = 'var(--color-success-bg)';
        this.successMessage.style.color            = 'var(--color-success-text)';
        this.successMessage.setAttribute('aria-hidden', 'false');
    }

    showError(message) {
        if (!this.successMessage) return;
        this.successMessage.textContent = message;
        this.successMessage.style.backgroundColor = 'var(--color-error-bg)';
        this.successMessage.style.color            = 'var(--color-error-text)';
        this.successMessage.setAttribute('aria-hidden', 'false');
    }

    showAllErrors() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => this.validateField(field));

        const firstInvalid = this.form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
    }

    resetValidation() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.classList.remove('form_input--error', 'form_input--valid');
        });

        this.form.querySelectorAll('.form_error').forEach(el => {
            el.textContent = '';
            el.setAttribute('aria-hidden', 'true');
        });

        if (this.successMessage) {
            this.successMessage.setAttribute('aria-hidden', 'true');
        }

        this.toggleSubmitButton();
    }

    moveFocusToSuccess() {
        if (!this.successMessage) return;
        setTimeout(() => {
            this.successMessage.setAttribute('tabindex', '-1');
            this.successMessage.focus();
        }, 100);
    }
}

// =========================================
// Inicializar cuando el DOM esté listo
// =========================================
document.addEventListener('DOMContentLoaded', () => {

    // Formulario de pedido (con validación completa)
    const pedidoValidator = new FormValidator(
        'pedido-form',
        'form-success',
        '¡Pedido enviado correctamente! Te contactaremos en breve.'
    );
    pedidoValidator.init();

    // Formulario de contacto (misma clase, distinto ID)
    const contactoValidator = new FormValidator(
        'contacto-form',
        'contacto-success',
        '¡Mensaje enviado! Te responderemos lo antes posible.'
    );
    contactoValidator.init();

});