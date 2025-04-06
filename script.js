// Menú móvil mejorado
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    body.classList.toggle('no-scroll');
});

// Cerrar menú al hacer clic en enlace
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });
});

// Scroll suave mejorado
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Cerrar menú móvil si está abierto
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                body.classList.remove('no-scroll');
            }
        }
    });
});

// Header al hacer scroll (versión mejorada)
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('header-scrolled', 'header-hidden');
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scroll hacia abajo
        header.classList.add('header-hidden');
    } else {
        // Scroll hacia arriba
        header.classList.remove('header-hidden');
    }
    
    if (currentScroll > 100) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
    
    lastScroll = currentScroll;
});

// Acordeón para departamentos (versión optimizada)
document.querySelectorAll('.department-header').forEach(header => {
    header.addEventListener('click', () => {
        const card = header.parentElement;
        const wasActive = card.classList.contains('active');
        
        // Cerrar todos los acordeones primero
        document.querySelectorAll('.department-card').forEach(c => {
            c.classList.remove('active');
        });
        
        // Abrir el actual si no estaba activo
        if (!wasActive) {
            card.classList.add('active');
            
            // En dispositivos móviles, desplazar para mostrar el inicio del contenido
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const cardPosition = card.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: cardPosition,
                        behavior: 'smooth'
                    });
                }, 50); // Pequeño retardo para permitir que el contenido se despliegue
            }
        }
    });
});

// Sistema de galerías unificado
function initAllGalleries() {
    // Selector universal para todas las galerías
    document.querySelectorAll('.activity-gallery').forEach(gallery => {
        initGallery(gallery);
    });
}

function initGallery(gallery) {
    const slider = gallery.querySelector('.gallery-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.gallery-slide');
    const prevBtn = gallery.querySelector('.gallery-prev');
    const nextBtn = gallery.querySelector('.gallery-next');
    
    let currentSlide = 0;
    let slideInterval;
    let touchStartX = 0;
    let touchEndX = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }
    
    function nextSlide() {
        let newIndex = (currentSlide + 1) % slides.length;
        showSlide(newIndex);
    }
    
    function prevSlide() {
        let newIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(newIndex);
    }
    
    function startSlideShow() {
        stopSlideShow();
        if (slides.length > 1) {
            slideInterval = setInterval(nextSlide, 5000);
        }
    }
    
    function stopSlideShow() {
        clearInterval(slideInterval);
    }
    
    // Navegación por botones
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        startSlideShow(); // Reinicia el intervalo
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        startSlideShow(); // Reinicia el intervalo
    });
    
    // Navegación por touch para móviles
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopSlideShow();
    }, {passive: true});
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startSlideShow();
    }, {passive: true});
    
    function handleSwipe() {
        const difference = touchStartX - touchEndX;
        if (difference > 50) nextSlide(); // Swipe izquierda
        if (difference < -50) prevSlide(); // Swipe derecha
    }
    
    // Pausar al interactuar
    gallery.addEventListener('mouseenter', stopSlideShow);
    gallery.addEventListener('mouseleave', startSlideShow);
    
    // Inicialización
    showSlide(0);
    startSlideShow();
}

// Tabs para actividades (optimizado)
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Actualizar botones
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Actualizar contenidos
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    });
});

// Lightbox mejorado
(function initLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="" alt="">
            <div class="lightbox-nav">
                <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>
    `;
    document.body.appendChild(lightbox);

    let currentGallery = null;
    let currentIndex = 0;
    let galleryImages = [];

    function updateNavigation() {
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        
        prevBtn.style.visibility = galleryImages.length > 1 ? 'visible' : 'hidden';
        nextBtn.style.visibility = galleryImages.length > 1 ? 'visible' : 'hidden';
    }

    function openLightbox(imgElement) {
        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.src = imgElement.src;
        lightboxImg.alt = imgElement.alt;
        lightbox.classList.add('active');
        
        currentGallery = imgElement.closest('.gallery-slider');
        galleryImages = currentGallery ? 
            Array.from(currentGallery.querySelectorAll('.gallery-slide img')) : 
            [imgElement];
        
        currentIndex = galleryImages.findIndex(img => img.src === imgElement.src);
        updateNavigation();
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigate(direction) {
        if (galleryImages.length <= 1) return;
        
        currentIndex = (currentIndex + direction + galleryImages.length) % galleryImages.length;
        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.src = galleryImages[currentIndex].src;
        lightboxImg.alt = galleryImages[currentIndex].alt;
    }

    // Delegación de eventos para mejor rendimiento
    document.addEventListener('click', (e) => {
        if (e.target.matches('.gallery-slide img')) {
            openLightbox(e.target);
        }
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigate(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigate(1));
    lightbox.addEventListener('click', (e) => e.target === lightbox && closeLightbox());

    // Navegación por teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'ArrowLeft': navigate(-1); break;
            case 'ArrowRight': navigate(1); break;
            case 'Escape': closeLightbox(); break;
        }
    });
})();

// Preloader optimizado
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    preloader.classList.add('preloader-hidden');
    
    preloader.addEventListener('transitionend', function() {
        preloader.style.display = 'none';
        // Iniciar animaciones después del preloader
        initAnimations();
    });
});

// Animaciones al hacer scroll
function initAnimations() {
    const animateOnScroll = () => {
        document.querySelectorAll('.fade-in').forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const isVisible = elementTop < window.innerHeight * 0.75;
            
            if (isVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Ejecutar una vez al cargar
    animateOnScroll();
    
    // Y luego en cada scroll
    window.addEventListener('scroll', animateOnScroll);
}

// Inicialización completa al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar todas las galerías
    initAllGalleries();
    
    // Activar el primer tab por defecto
    const defaultTab = document.querySelector('.tab-btn.active') || document.querySelector('.tab-btn');
    if (defaultTab) defaultTab.click();
});
