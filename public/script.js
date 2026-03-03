document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const loader = document.getElementById('loader');
    
    // Simulate slight loading delay for effect (or wait for window load)
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500); // 500ms delay for visual effect
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- CA Copier Logic ---
    const copyBtn = document.getElementById('copy-btn');
    const caText = document.getElementById('ca-text');
    const toast = document.getElementById('toast');

    if (copyBtn && caText) {
        copyBtn.addEventListener('click', () => {
            const textToCopy = caText.textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast();
            }).catch(err => {
                console.error('Failed to copy CA: ', err);
                // Fallback for older browsers
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showToast();
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                }
                document.body.removeChild(textArea);
            });
        });
    }

    function showToast() {
        if(toast) {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }


    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    if(revealElements.length > 0) {
        revealElements.forEach(el => {
            revealOnScroll.observe(el);
        });
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Fire Ember Particle System (Optimized) ---
    const canvas = document.getElementById('fire-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init(); // Reinitialize particles on resize for better distribution
        });

        let particlesArray = [];
        const numberOfParticles = 70; // Reduced count for better performance

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = height + Math.random() * 200; // Start off-screen
                this.size = Math.random() * 3 + 1;
                // Faster upward movement
                this.speedY = Math.random() * -4 - 1; 
                this.speedX = Math.random() * 3 - 1.5;
                // Fire colors (oranges, yellows, reds)
                const hue = Math.floor(Math.random() * 40) + 10;
                const saturation = Math.floor(Math.random() * 30) + 70;
                const lightness = Math.floor(Math.random() * 40) + 40;
                this.color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${Math.random() * 0.7 + 0.3})`;
                this.angle = Math.random() * 360;
                this.spin = Math.random() * 0.1 - 0.05;
                this.wobble = Math.random() * 2;
                this.wobbleSpeed = Math.random() * 0.05 + 0.02;
            }
            update() {
                // Sinuous upward movement mimicking embers
                this.x += this.speedX + Math.sin(this.wobble) * 1.5;
                this.y += this.speedY;
                this.wobble += this.wobbleSpeed;
                this.angle += this.spin;

                // Shrink slightly as they rise
                if (this.size > 0.1) this.size -= 0.015;

                // Reset
                if (this.y < 0 || this.size <= 0.1) {
                    this.x = Math.random() * width;
                    this.y = height + Math.random() * 100;
                    this.size = Math.random() * 3 + 1;
                    this.speedY = Math.random() * -4 - 1;
                    this.speedX = Math.random() * 3 - 1.5;
                }
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = this.color;
                // Removed shadowBlur and shadowColor for drastic performance boost
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        function init() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animate() {
            // Standard clearRect for drastic FPS improvement
            ctx.clearRect(0, 0, width, height);

            // Optional: keep lighter compositing
            ctx.globalCompositeOperation = 'lighter';
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            ctx.globalCompositeOperation = 'source-over';
            requestAnimationFrame(animate);
        }

        init();
        animate();
    }
});
