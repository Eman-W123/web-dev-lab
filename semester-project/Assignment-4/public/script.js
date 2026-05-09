const hamburger = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('open');
  });
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function(link){ link.addEventListener('click', ()=> navMenu.classList.remove('open')); });
}