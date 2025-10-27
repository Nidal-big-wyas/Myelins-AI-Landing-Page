document.addEventListener('DOMContentLoaded', function() {
    // تمرير سلس للروابط الداخلية
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // لتجنب تغطية الشريط العلوي
                    behavior: 'smooth'
                });
            }
        });
    });

    // تغيير لون الشريط عند التمرير
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.backgroundColor = 'white';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });

    // تبديل اللغة
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
});