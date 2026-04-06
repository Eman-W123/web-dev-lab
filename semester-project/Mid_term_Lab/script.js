const hamburger = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('open');
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navMenu.classList.remove('open');
        });
    });
}

function initCustomCarouselFallback() {
    var carousel = document.getElementById('productCarousel');
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    var currentSlideEl = document.getElementById('currentSlide');
    var totalSlidesEl = document.getElementById('totalSlides');

    if (!carousel || !prevBtn || !nextBtn || !currentSlideEl || !totalSlidesEl) {
        return;
    }

    var cards = Array.prototype.slice.call(carousel.querySelectorAll('.product-item'));
    var total = cards.length;
    var current = 0;
    var autoplayId = null;

    carousel.classList.add('carousel-fallback-active');

    if (!total) {
        return;
    }

    function cardsPerView() {
        if (window.innerWidth <= 768) {
            return 1;
        }
        if (window.innerWidth <= 1024) {
            return 2;
        }
        return 3;
    }

    function render() {
        var perView = cardsPerView();
        var widthPercent = 100 / perView;
        var maxStart = Math.max(total - perView, 0);

        if (current > maxStart) {
            current = 0;
        }

        carousel.style.display = 'flex';
        carousel.style.willChange = 'transform';
        carousel.style.transition = 'transform 0.45s ease';

        cards.forEach(function(card) {
            card.style.flex = '0 0 ' + widthPercent + '%';
            card.style.maxWidth = widthPercent + '%';
        });

        carousel.style.transform = 'translateX(-' + (current * widthPercent) + '%)';
        currentSlideEl.textContent = String(current + 1);
        totalSlidesEl.textContent = String(total);
    }

    function next() {
        var perView = cardsPerView();
        var maxStart = Math.max(total - perView, 0);
        current = current >= maxStart ? 0 : current + 1;
        render();
    }

    function prev() {
        var perView = cardsPerView();
        var maxStart = Math.max(total - perView, 0);
        current = current <= 0 ? maxStart : current - 1;
        render();
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayId = window.setInterval(next, 5000);
    }

    function stopAutoplay() {
        if (autoplayId) {
            window.clearInterval(autoplayId);
            autoplayId = null;
        }
    }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    window.addEventListener('resize', render);

    render();
    startAutoplay();
}

if (window.jQuery) {
    window.jQuery(function($) {
        var $carousel = $('#productCarousel');
        if (!$carousel.length) {
            return;
        }

        var totalCards = $carousel.find('.product-item').length;
        $('#totalSlides').text(totalCards);

        if (typeof $.fn.slick === 'function') {
            $carousel.slick({
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 5000,
                pauseOnHover: true,
                arrows: false,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: { slidesToShow: 2 }
                    },
                    {
                        breakpoint: 768,
                        settings: { slidesToShow: 1 }
                    }
                ]
            });

            $carousel.on('afterChange', function(event, slick, currentSlide) {
                $('#currentSlide').text(currentSlide + 1);
            });

            $('#prevBtn').on('click', function() {
                $carousel.slick('slickPrev');
            });

            $('#nextBtn').on('click', function() {
                $carousel.slick('slickNext');
            });

            $carousel.on('mouseenter', '.product-item', function() {
                $carousel.slick('slickPause');
            });

            $carousel.on('mouseleave', '.product-item', function() {
                $carousel.slick('slickPlay');
            });
            return;
        }

        initCustomCarouselFallback();
    });
} else {
    document.addEventListener('DOMContentLoaded', initCustomCarouselFallback);
}