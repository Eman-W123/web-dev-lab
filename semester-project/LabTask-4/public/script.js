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

function showCartToast(message, isError) {
  var toast = document.getElementById('cart-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.toggle('cart-toast--error', !!isError);
  window.setTimeout(function() {
    toast.hidden = true;
  }, 3000);
}

function updateCartBadge(count) {
  var links = document.querySelectorAll('[data-cart-count]');
  links.forEach(function(link) {
    link.setAttribute('data-cart-count', String(count));
    var existing = link.querySelector('.cart-badge');
    if (count > 0) {
      if (!existing) {
        existing = document.createElement('span');
        existing.className = 'cart-badge';
        link.appendChild(existing);
      }
      existing.textContent = String(count);
    } else if (existing) {
      existing.remove();
    }
  });
}

function refreshCartBadge() {
  fetch('/cart/count')
    .then(function(res) { return res.json(); })
    .then(function(data) { updateCartBadge(data.count || 0); })
    .catch(function() {});
}

function addToCart(productId) {
  if (!window.RIVAJ_USER) {
    showCartToast('Please login to add items to cart', true);
    window.setTimeout(function() {
      window.location.href = '/auth/login';
    }, 1200);
    return;
  }

  fetch('/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: productId, quantity: 1 })
  })
    .then(function(res) { return res.json().then(function(data) { return { ok: res.ok, data: data }; }); })
    .then(function(result) {
      if (!result.ok) {
        showCartToast(result.data.message || 'Could not add to cart', true);
        if (result.data.message && result.data.message.toLowerCase().indexOf('login') !== -1) {
          window.setTimeout(function() { window.location.href = '/auth/login'; }, 1200);
        }
        return;
      }
      showCartToast(result.data.message || 'Added to cart');
      updateCartBadge(result.data.cartCount || 0);
    })
    .catch(function() {
      showCartToast('Could not add to cart', true);
    });
}

function findProductIdByName(name) {
  var products = window.RIVAJ_PRODUCTS || [];
  var normalized = name.trim().toLowerCase();
  var match = products.find(function(p) {
    return p.name && p.name.trim().toLowerCase() === normalized;
  });
  if (match) return match._id;
  match = products.find(function(p) {
    return p.name && normalized.indexOf(p.name.trim().toLowerCase()) !== -1;
  });
  return match ? match._id : null;
}

function initAddToCartButtons() {
  document.addEventListener('click', function(event) {
    var btn = event.target.closest('.add-to-cart-btn');
    if (btn) {
      event.preventDefault();
      var productId = btn.getAttribute('data-product-id');
      if (productId) addToCart(productId);
      return;
    }

    var actionBtn = event.target.closest('.summer-product-action, .pc-product-action');
    if (!actionBtn) return;
    var label = (actionBtn.textContent || '').trim();
    if (label.toLowerCase().indexOf('add to cart') === -1) return;

    event.preventDefault();
    var card = actionBtn.closest('.product-item, .pc-product-item');
    if (!card) return;
    var titleEl = card.querySelector('.summer-product-title, .pc-product-title');
    if (!titleEl) return;
    var productId = findProductIdByName(titleEl.textContent || '');
    if (!productId) {
      showCartToast('Product not found. Browse /products to add items.', true);
      return;
    }
    addToCart(productId);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initAddToCartButtons();
  refreshCartBadge();
});