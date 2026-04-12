// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function () {
            const isActive = hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            hamburger.setAttribute('aria-label', isActive ? 'メニューを閉じる' : 'メニューを開く');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            const isClickInsideNav = nav.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);

            if (!isClickInsideNav && !isClickOnHamburger && nav.classList.contains('active')) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'メニューを開く');
            }
        });

        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'メニューを開く');
            });
        });
    }

    // Header scroll background
    const header = document.querySelector('header');
    if (header) {
        function updateHeader() {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    // aria-current="page" for current nav links
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.setAttribute('aria-current', 'page');
        }
    });
});
