// Efecto Parallax para el Hero
document.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
});

// Animaciones de entrada para las características
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar las tarjetas de características
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    observer.observe(card);
});

// Agregar estilos CSS para la animación
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Desplazamiento suave para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efecto hover en las tarjetas de características
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Animación del texto del hero
const heroText = document.querySelector('.hero h1');
if (heroText) {
    heroText.style.opacity = "0";
    heroText.style.transform = "translateY(20px)";
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            heroText.style.transition = "all 0.8s ease";
            heroText.style.opacity = "1";
            heroText.style.transform = "translateY(0)";
        }, 300);
    });
}

// Detectar scroll para animar elementos cuando entran en vista
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Animación de elementos cuando entran en vista
function handleScrollAnimations() {
    document.querySelectorAll('.about-content, .donate').forEach(element => {
        if (isInViewport(element) && !element.classList.contains('animated')) {
            element.classList.add('animated');
            element.style.animation = 'fadeInUp 0.8s ease forwards';
        }
    });
}

window.addEventListener('scroll', handleScrollAnimations);
window.addEventListener('load', handleScrollAnimations);

// Manejo del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitButton = contactForm.querySelector('.submit-button');
            const originalButtonText = submitButton.innerHTML;
            
            // Cambiar el botón a estado de carga
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('send-email.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                // Crear elemento para mostrar el mensaje
                const messageDiv = document.createElement('div');
                messageDiv.className = `alert ${result.status === 'success' ? 'alert-success' : 'alert-error'}`;
                messageDiv.textContent = result.message;

                // Insertar el mensaje antes del formulario
                contactForm.parentNode.insertBefore(messageDiv, contactForm);

                // Si el envío fue exitoso, limpiar el formulario
                if (result.status === 'success') {
                    contactForm.reset();
                }

                // Eliminar el mensaje después de 5 segundos
                setTimeout(() => {
                    messageDiv.remove();
                }, 5000);

            } catch (error) {
                // Manejar errores
                const messageDiv = document.createElement('div');
                messageDiv.className = 'alert alert-error';
                messageDiv.textContent = 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.';
                contactForm.parentNode.insertBefore(messageDiv, contactForm);
            } finally {
                // Restaurar el botón
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
});
