document.addEventListener('DOMContentLoaded', function() {
    // تمرير سلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar Scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // اللغة
    document.getElementById('lang-en').addEventListener('click', function() {
        document.body.classList.add('en');
        document.querySelectorAll('.text-ar').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.text-en').forEach(el => el.style.display = 'block');
        document.getElementById('lang-ar').classList.remove('active');
        this.classList.add('active');
    });

    document.getElementById('lang-ar').addEventListener('click', function() {
        document.body.classList.remove('en');
        document.querySelectorAll('.text-ar').forEach(el => el.style.display = 'block');
        document.querySelectorAll('.text-en').forEach(el => el.style.display = 'none');
        document.getElementById('lang-en').classList.remove('active');
        this.classList.add('active');
    });

    // Dark Mode
    const darkModeToggle = document.querySelector('#dark-mode-toggle');
    const enableDarkMode = () => document.body.classList.add('dark-mode');
    const disableDarkMode = () => document.body.classList.remove('dark-mode');
    const toggleTheme = () => {
        if (darkModeToggle.checked) { enableDarkMode(); } else { disableDarkMode(); }
    }
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleTheme);
    }

    // الأسئلة الشائعة (FAQ)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // الشبكة العصبية (Particles)
    const canvas = document.getElementById('neuro-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x; this.y = y;
                this.directionX = directionX; this.directionY = directionY;
                this.size = size; this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = '#ffffff';
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                        + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvas.width/7) * (canvas.height/7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(255, 255, 255,' + opacityValue + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        window.addEventListener('resize', function(){
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            init();
        });
        init();
        animate();
    }
});