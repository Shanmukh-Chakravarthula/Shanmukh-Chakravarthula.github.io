document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (systemPrefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Dynamic feedback for accessibility/screen readers if needed
        console.log(`Theme switched to: ${newTheme}`);
    };

    // Initialize Theme
    initTheme();

    // Hook up Theme Toggle buttons (handles toggle on index & subpages)
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });

    // Header Scroll Effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.glass-card, .tech-card, .section-title, .hero-content, .hero-avatar');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Set initial state style block
        const style = document.createElement('style');
        style.textContent = `
            .glass-card, .tech-card, .section-title, .hero-content, .hero-avatar {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                            transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .glass-card.revealed, .tech-card.revealed, .section-title.revealed, .hero-content.revealed, .hero-avatar.revealed {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // Interactive 3D Tilt Effect on Project/Glass Cards
    const cards = document.querySelectorAll('.glass-card, .tech-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate inside the element
            const y = e.clientY - rect.top;  // y coordinate inside the element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * 4; // limit to max 4 degrees
            const rotateY = ((centerX - x) / centerX) * 4;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});
