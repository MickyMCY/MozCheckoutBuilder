// Form validation and submission handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkoutForm');
    const submitBtn = document.getElementById('submitBtn');
    const modal = document.getElementById('successModal');
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + ' ' + 
                    value.substring(2, 5) + ' ' + 
                    value.substring(5, 9);
        }
        e.target.value = value;
    });

    // Form validation functions
    function validateFullName(name) {
        return name.trim().length >= 2;
    }

    function validatePhone(phone) {
        const phoneRegex = /^\d{2}\s\d{3}\s\d{4}$/;
        return phoneRegex.test(phone);
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePaymentMethod() {
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        return Array.from(paymentMethods).some(method => method.checked);
    }

    function showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    function hideError(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        errorElement.classList.remove('show');
    }

    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.classList.remove('show');
        });
    }

    // Real-time validation
    document.getElementById('fullName').addEventListener('blur', function() {
        const value = this.value;
        if (!validateFullName(value)) {
            showError('fullName', 'Nome deve ter pelo menos 2 caracteres');
        } else {
            hideError('fullName');
        }
    });

    document.getElementById('phone').addEventListener('blur', function() {
        const value = this.value;
        if (!validatePhone(value)) {
            showError('phone', 'Formato inválido. Use: 84 123 4567');
        } else {
            hideError('phone');
        }
    });

    document.getElementById('email').addEventListener('blur', function() {
        const value = this.value;
        if (!validateEmail(value)) {
            showError('email', 'Email inválido');
        } else {
            hideError('email');
        }
    });

    // Payment method selection validation
    document.querySelectorAll('input[name="paymentMethod"]').forEach(method => {
        method.addEventListener('change', function() {
            hideError('payment');
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        clearAllErrors();
        
        // Get form data
        const formData = new FormData(form);
        const fullName = formData.get('fullName');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const paymentMethod = formData.get('paymentMethod');
        
        // Validate all fields
        let isValid = true;
        
        if (!validateFullName(fullName)) {
            showError('fullName', 'Nome deve ter pelo menos 2 caracteres');
            isValid = false;
        }
        
        if (!validatePhone(phone)) {
            showError('phone', 'Formato inválido. Use: 84 123 4567');
            isValid = false;
        }
        
        if (!validateEmail(email)) {
            showError('email', 'Email inválido');
            isValid = false;
        }
        
        if (!validatePaymentMethod()) {
            showError('payment', 'Selecione um método de pagamento');
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        submitBtn.classList.add('processing');
        
        // Simulate API call
        setTimeout(() => {
            // Create checkout data
            const checkoutData = {
                fullName: fullName,
                phone: phone,
                email: email,
                paymentMethod: paymentMethod,
                subtotal: 2500.00,
                processingFee: 50.00,
                total: 2550.00
            };
            
            // Log the data (in real app, this would be sent to server)
            console.log('Checkout Data:', checkoutData);
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-lock"></i> Finalizar Compra';
            submitBtn.classList.remove('processing');
            
            // Show success modal
            showSuccessModal();
            
            // Reset form
            form.reset();
            
        }, 2000); // Simulate 2 second processing time
    });

    // Success modal functions
    function showSuccessModal() {
        modal.classList.add('show');
    }

    window.closeModal = function() {
        modal.classList.remove('show');
    };

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation for payment methods
    document.querySelectorAll('.payment-option label').forEach(label => {
        label.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const radio = this.querySelector('input[type="radio"]') || 
                            document.getElementById(this.getAttribute('for'));
                if (radio) {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change'));
                }
            }
        });
        
        // Make labels focusable for keyboard navigation
        label.setAttribute('tabindex', '0');
    });

    // Enhanced accessibility
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Add smooth scrolling to error fields
    function scrollToError() {
        const firstError = document.querySelector('.error-message.show');
        if (firstError) {
            const field = firstError.closest('.form-group');
            field.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    // Auto-scroll to first error when form is invalid
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'class' &&
                mutation.target.classList.contains('show')) {
                setTimeout(scrollToError, 100);
            }
        });
    });

    document.querySelectorAll('.error-message').forEach(errorElement => {
        observer.observe(errorElement, { attributes: true });
    });

    // Prevent form submission on Enter key in input fields (except submit button)
    document.querySelectorAll('input:not([type="submit"])').forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Move to next input field
                const inputs = Array.from(document.querySelectorAll('input:not([type="radio"]):not([type="submit"])'));
                const currentIndex = inputs.indexOf(this);
                if (currentIndex < inputs.length - 1) {
                    inputs[currentIndex + 1].focus();
                }
            }
        });
    });

    // Payment method selection with keyboard
    document.addEventListener('keydown', function(e) {
        if (e.target.name === 'paymentMethod') {
            const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
            const currentIndex = Array.from(paymentMethods).indexOf(e.target);
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % paymentMethods.length;
                paymentMethods[nextIndex].focus();
                paymentMethods[nextIndex].checked = true;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = currentIndex === 0 ? paymentMethods.length - 1 : currentIndex - 1;
                paymentMethods[prevIndex].focus();
                paymentMethods[prevIndex].checked = true;
            }
        }
    });

    // Animation for successful form submission
    function animateSuccess() {
        const card = document.querySelector('.checkout-card');
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0.8';
        
        setTimeout(() => {
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
        }, 200);
    }

    // Add visual feedback for form interaction
    document.querySelectorAll('.payment-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Initialize form state
    console.log('MOZ Checkout Payment System Initialized');
    console.log('Form validation and submission handlers ready');
});

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: 'MZN',
        minimumFractionDigits: 2
    }).format(amount);
}

function getPaymentMethodName(method) {
    const methods = {
        'visa': 'Visa',
        'mastercard': 'MasterCard',
        'mpesa': 'M-Pesa',
        'emola': 'e-Mola'
    };
    return methods[method] || method;
}

// Export functions for potential use in other scripts
window.MozCheckout = {
    validateFullName,
    validatePhone,
    validateEmail,
    validatePaymentMethod,
    formatCurrency,
    getPaymentMethodName
};