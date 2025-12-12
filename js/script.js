document.addEventListener('DOMContentLoaded', function () {

    /* =====================================================
       1. شبكة الخلفية (Particles) في الهيدر
    ====================================================== */

    let updateParticleColor = () => {}; // دالة فارغة نحدّدها لاحقاً

    const canvas = document.getElementById('neuro-canvas');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        let particleColor = '#ffffff';

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        updateParticleColor = function () {
            const isDark = document.body.classList.contains('dark-mode');
            particleColor = isDark ? '#6C4BFF' : '#ffffff';
        };

        class Particle {
            constructor() {
                this.size = Math.random() * 2 + 1;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.speedX = (Math.random() - 0.5) * 0.6;
                this.speedY = (Math.random() - 0.5) * 0.6;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 13000);
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function connectParticles() {
            const maxDistance = 140;
            for (let i = 0; i < particlesArray.length; i++) {
                for (let j = i + 1; j < particlesArray.length; j++) {
                    const dx = particlesArray[i].x - particlesArray[j].x;
                    const dy = particlesArray[i].y - particlesArray[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = 1 - distance / maxDistance;
                        ctx.strokeStyle = `rgba(124, 92, 255, ${opacity * 0.7})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animate);
        }

        updateParticleColor();
        initParticles();
        animate();
    }

    /* =====================================================
       2. سويتش الوضع الليلي / النهاري
    ====================================================== */

    const themeToggle = document.getElementById('dark-mode-toggle');
    const themeFlash = document.querySelector('.theme-flash');

    function applyTheme(mode) {
        const isDark = mode === 'dark';
        document.body.classList.toggle('dark-mode', isDark);
        if (themeToggle) themeToggle.checked = isDark;
        localStorage.setItem('myelins-theme', isDark ? 'dark' : 'light');
        updateParticleColor();
        if (themeFlash) {
            themeFlash.classList.add('active');
            setTimeout(() => themeFlash.classList.remove('active'), 600);
        }
    }

    if (themeToggle) {
        const savedTheme = localStorage.getItem('myelins-theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        } else if (window.matchMedia &&
                   window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }

        themeToggle.addEventListener('change', () => {
            applyTheme(themeToggle.checked ? 'dark' : 'light');
        });
    }

    /* =====================================================
       3. مبدّل اللغة (عربي / English)
    ====================================================== */

    const htmlEl = document.documentElement;
    const btnAr = document.getElementById('lang-ar');
    const btnEn = document.getElementById('lang-en');

    function applyLanguage(lang) {
        const isArabic = (lang === 'ar');

        htmlEl.setAttribute('lang', isArabic ? 'ar' : 'en');
        htmlEl.setAttribute('dir', isArabic ? 'rtl' : 'ltr');

        document.querySelectorAll('.text-ar').forEach(el => {
            el.style.display = isArabic ? '' : 'none';
        });
        document.querySelectorAll('.text-en').forEach(el => {
            el.style.display = isArabic ? 'none' : '';
        });

        document.body.classList.toggle('lang-ar-active', isArabic);
        document.body.classList.toggle('lang-en-active', !isArabic);

        [btnAr, btnEn].forEach(btn => btn && btn.classList.remove('active'));
        if (isArabic && btnAr) btnAr.classList.add('active');
        if (!isArabic && btnEn) btnEn.classList.add('active');

        localStorage.setItem('myelins-lang', lang);
    }

    if (btnAr && btnEn) {
        const savedLang = localStorage.getItem('myelins-lang') || 'ar';
        applyLanguage(savedLang);

        btnAr.addEventListener('click', () => applyLanguage('ar'));
        btnEn.addEventListener('click', () => applyLanguage('en'));
    }

    /* =====================================================
       4. سكرول ناعم لكل الروابط الداخلية
    ====================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const section = document.querySelector(targetId);
            if (section) {
                e.preventDefault();
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* =====================================================
       5. قائمة الموبايل
    ====================================================== */

    const mobileToggle = document.querySelector('.mobile-toggle');
    const navContent = document.querySelector('.nav-content');

    if (mobileToggle && navContent) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navContent.classList.toggle('active');
        });

        navContent.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navContent.classList.remove('active');
            });
        });
    }

        /* =====================================================
       6. الأكورديون في الأسئلة الشائعة (FAQ)
    ====================================================== */

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.toggle-icon');

        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // أولاً نغلق كل العناصر
            faqItems.forEach(i => {
                i.classList.remove('active');
                const a = i.querySelector('.faq-answer');
                const ic = i.querySelector('.toggle-icon');
                if (a) a.style.maxHeight = '0px';
                if (ic) ic.textContent = '+';
            });

            // بعدين نفتح العنصر الحالي إذا ما كان مفتوح
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                if (icon) icon.textContent = '−';
            }
        });
    });

    /* =====================================================
       7. تفاعل الضغط على الكروت (Click Feedback)
    ====================================================== */

    const interactiveCards = document.querySelectorAll(
        '.problem-cards .card, .value-cards .card, .industry-grid .ind-card, .steps-grid .modern-step-card'
    );

    interactiveCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.add('clicked');
            setTimeout(() => card.classList.remove('clicked'), 150);
        });
    });

    /* =====================================================
       8. تأثير الظهور عند التمرير (Scroll Reveal)
    ====================================================== */

    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.88;

        revealElements.forEach((el, index) => {
            const boxTop = el.getBoundingClientRect().top;
            if (boxTop < triggerBottom) {
                // إضافة الكلاس
                el.classList.add('show');
                // تأخير بسيط بين العناصر
                el.style.transitionDelay = (index * 80) + 'ms';
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
});
const fadeEls = document.querySelectorAll('.scroll-fade');

window.addEventListener('scroll', () => {
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('visible');
    }
  });
  const fadeEls = document.querySelectorAll('.scroll-fade');

window.addEventListener('scroll', () => {
    fadeEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.classList.add('visible');
        }
    });
});

});

/* ==================================================
   📱 Default English on Mobile (SAFE)
   ================================================== */
if (window.innerWidth <= 576) {
  const savedLang = localStorage.getItem('myelins-lang');
  if (!savedLang) {
    localStorage.setItem('myelins-lang', 'en');
    location.reload();
  }
}
