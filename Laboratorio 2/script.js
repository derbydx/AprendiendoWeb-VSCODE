class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.successMessage = document.getElementById('form-success');
    }

    init() {
        this.form.setAttribute('novalidate', '');
        this.setupEventListeners();
        this.toggleSubmitButton();
    }

    setupEventListeners() {
        // input en tiempo real
        this.form.addEventListener('input', (e) => {
            this.validateField(e.target);
            this.toggleSubmitButton();
        });

        // blur
        this.form.addEventListener('blur', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.validateField(e.target);
            }
        }, true);

        // submit
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

        let message = '';

        if (field.validity.valueMissing) {
            message = 'Este campo es obligatorio.';
        } else if (field.validity.typeMismatch) {
            message = 'Por favor, ingresa un valor válido.';
        } else if (field.validity.tooShort) {
            message = `Por favor, ingresa al menos ${field.getAttribute('minlength')} caracteres.`;
        } else if (field.validity.patternMismatch) {
            message = 'El formato no es correcto.';
        }

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
        const formData = new FormData(this.form);
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
    }

    moveFocusToSuccess() {
        setTimeout(() => {
            this.successMessage.focus();
            this.successMessage.setAttribute('tabindex', '-1');
        }, 100);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    const validator = new FormValidator('pedido-form');
    validator.init();
});