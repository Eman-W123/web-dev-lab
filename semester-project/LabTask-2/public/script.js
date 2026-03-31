const hamburger = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

// Toggle menu open/close on hamburger click
hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('open');
});

// Optional bonus: close menu when a nav link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
        navMenu.classList.remove('open');
    });
});