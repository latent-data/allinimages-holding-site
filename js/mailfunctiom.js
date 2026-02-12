// Initialize EmailJS
(function() {
    emailjs.init("MH6v645yxocF6xLAZ");
})();

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get submit button
            const submitBtn = document.getElementById('submit-btn');
            const originalText = submitBtn.textContent;
            
            // Check if grecaptcha exists
            if (typeof grecaptcha === 'undefined') {
                showMessage('reCAPTCHA is not loaded. Please refresh the page.', 'error');
                return;
            }
            
            // Get reCAPTCHA response
            let recaptchaResponse = '';
            try {
                // Get all reCAPTCHA widgets on the page
                const recaptchaElements = document.querySelectorAll('.g-recaptcha');
                
                // Try to get response from each widget
                for (let i = 0; i < recaptchaElements.length; i++) {
                    try {
                        const widgetId = grecaptcha.getResponse(i);
                        if (widgetId) {
                            recaptchaResponse = widgetId;
                            break;
                        }
                    } catch (e) {
                        // Continue to next widget
                    }
                }
                
                // If still no response, try without widget ID
                if (!recaptchaResponse) {
                    recaptchaResponse = grecaptcha.getResponse();
                }
            } catch (error) {
                console.error('Error getting reCAPTCHA response:', error);
            }
            
            // Check if reCAPTCHA was completed
            if (!recaptchaResponse) {
                showMessage('Please complete the reCAPTCHA verification.', 'error');
                return;
            }
            
            // Disable submit button
            submitBtn.textContent = 'SENDING...';
            submitBtn.disabled = true;
            
            // Get form values
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                organization: document.getElementById('organization').value,
                message: document.getElementById('message').value
            };
            
            // Template params for business email
            const businessTemplateParams = {
                ...formData,
                'g-recaptcha-response': recaptchaResponse
            };
            
            // Template params for confirmation email to sender
            const confirmationTemplateParams = {
                name: formData.name,
                email: formData.email,
                from_name: 'All In Images Team',
                from_email: 'iashanrehantha@gmail.com',
                reply_to: 'iashanrehantha@gmail.com',
                sender_name: formData.name,
                organization: formData.organization || 'Not specified',
                message:formData.message
            };
            
            // Send first email to business
            emailjs.send('service_vldn9i5', 'template_ghu9hbi', businessTemplateParams)
                .then(function(response) {
                    console.log('Business email sent successfully:', response);
                    
                    // Send confirmation email to sender
                    return emailjs.send('service_vldn9i5', 'template_3o4lxjm', confirmationTemplateParams);
                })
                .then(function(response) {
                    console.log('Confirmation email sent successfully:', response);
                    
                    // Both emails sent successfully
                    showMessage('Thank you! Your message has been sent successfully. Check your email for confirmation.', 'success');
                    form.reset();
                    
                    // Reset reCAPTCHA
                    try {
                        grecaptcha.reset();
                    } catch (e) {
                        console.log('Could not reset reCAPTCHA');
                    }
                })
                .catch(function(error) {
                    // Error in sending emails
                    console.error('EmailJS error:', error);
                    
                    // Check which email failed
                    if (error.text && error.text.includes('confirmation')) {
                        showMessage('Your message was sent to us, but we couldn\'t send you a confirmation email. We\'ll still get back to you!', 'warning');
                    } else {
                        showMessage('Sorry, there was an error sending your message. Please try again or email us directly at hello@allinimages.io', 'error');
                    }
                })
                .finally(function() {
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
});

function showMessage(message, type) {
    const messageDiv = document.getElementById('form-message');
    if (messageDiv) {
        messageDiv.textContent = message;
        
        // Set classes based on message type
        let className = 'px-4 py-3 rounded text-center mb-4 ';
        switch(type) {
            case 'success':
                className += 'bg-green-100 border border-green-400 text-green-700';
                break;
            case 'warning':
                className += 'bg-yellow-100 border border-yellow-400 text-yellow-700';
                break;
            case 'error':
            default:
                className += 'bg-red-100 border border-red-400 text-red-700';
                break;
        }
        
        messageDiv.className = className;
        messageDiv.classList.remove('hidden');
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    }
}