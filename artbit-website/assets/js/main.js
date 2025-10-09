
// Navbar

(() => {
  const navLinks = document.querySelectorAll('[data-bs-toggle="megamenu"]');
  const overlay = document.querySelector('.megamenu-overlay');
  const menus = document.querySelectorAll('.megamenu');

  let activeMenu = null;
  let currentTrigger = null;
  let hoverTimeout = null;

  function openMenu(menu, trigger) {
    if (!menu || !trigger) return;

    // close any other menus and reset active classes
    menus.forEach(m => m.classList.remove('show'));
    navLinks.forEach(l => l.classList.remove('active'));

    // show chosen menu and mark its trigger active
    overlay && overlay.classList.add('show');
    menu.classList.add('show');
    trigger.classList.add('active');

    activeMenu = menu;
    currentTrigger = trigger;
  }

  function closeMenus() {
    menus.forEach(m => m.classList.remove('show'));
    navLinks.forEach(l => l.classList.remove('active'));
    overlay && overlay.classList.remove('show');

    activeMenu = null;
    currentTrigger = null;
    clearTimeout(hoverTimeout);
  }

  function delayedClose() {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      // safe checks in case activeMenu is null
      const linkHover = !!document.querySelector('[data-bs-toggle="megamenu"]:hover');
      const menuHover = activeMenu ? activeMenu.matches(':hover') : false;

      if (!linkHover && !menuHover) {
        closeMenus();
      }
    }, 150);
  }

  navLinks.forEach(link => {
    const target = document.querySelector(link.dataset.target);
    if (!target) return;

    // make sure arrow exists for this link; if not, create it (optional)
    if (!link.querySelector('.megamenu-arrow')) {
      const span = document.createElement('span');
      span.className = 'megamenu-arrow';
      link.appendChild(span);
    }

    link.addEventListener('mouseenter', () => openMenu(target, link));

    link.addEventListener('click', e => {
      e.preventDefault();
      if (activeMenu === target) {
        closeMenus(); // toggle: close if already open
      } else {
        openMenu(target, link);
      }
    });

    link.addEventListener('mouseleave', delayedClose);

    target.addEventListener('mouseenter', () => clearTimeout(hoverTimeout));
    target.addEventListener('mouseleave', delayedClose);
  });

  overlay && overlay.addEventListener('click', closeMenus);

  // re-evaluate arrow visibility if user resizes/scrolls (keeps UI correct)
  window.addEventListener('resize', () => {
    if (!activeMenu || !currentTrigger) return;
    // nothing to recalc for arrow because arrow belongs to the link,
    // but we force reflow for smoother visual in case layout changed
    currentTrigger.offsetWidth;
  }, { passive: true });

  // capture scrolls in case layout changes
  window.addEventListener('scroll', () => {
    if (!activeMenu || !currentTrigger) return;
    currentTrigger.offsetWidth;
  }, true);
})();




// Text Slider

$(document).ready(function () {
  const $slide = $('.text_slide');
  const $items = $slide.find('.item');
  let current = 0;
  let direction = 1; // 1 for down, -1 for up

  // Prepare items for sliding effect
  $items.css({ position: 'absolute', left: 0, right: 0, top: 0 }).hide();
  $items.eq(current).show();

  function slideTo(next) {
    $items.eq(current).animate({ top: direction === 1 ? '-2em' : '2em', opacity: 0 }, 500, function () {
      $(this).hide().css({ top: 0, opacity: 1 });
      $items.eq(next).css({ top: direction === 1 ? '2em' : '-2em', opacity: 0 }).show()
        .animate({ top: 0, opacity: 1 }, 500);
      current = next;
    });
  }

  setInterval(function () {
    let next = current + direction;
    if (next >= $items.length) {
      direction = -1;
      next = current + direction;
    } else if (next < 0) {
      direction = 1;
      next = current + direction;
    }
    slideTo(next);
  }, 2000);
});


// Logo Slider

document.addEventListener("DOMContentLoaded", () => {
  const sliderInner = document.querySelector(".logo_slider_inner");
  const slider = document.querySelector(".logo_slider");

  // Duplicate content for seamless scrolling
  const duplicate = sliderInner.innerHTML;
  sliderInner.innerHTML += duplicate; // Append duplicate content

  let scrollAmount = 0;
  const speed = 1;
  let isPaused = false;

  function scrollSlider() {
    if (!isPaused) {
      scrollAmount -= speed;

      // Reset scroll position to the start when fully scrolled
      if (Math.abs(scrollAmount) >= sliderInner.scrollWidth / 2) {
        scrollAmount = 0;
      }

      sliderInner.style.transform = `translateX(${scrollAmount}px)`;
    }

    requestAnimationFrame(scrollSlider);
  }

  // Pause scrolling on hover
  slider.addEventListener("mouseenter", () => {
    isPaused = true;
  });

  // Resume scrolling when hover ends
  slider.addEventListener("mouseleave", () => {
    isPaused = false;
  });

  scrollSlider();
});


// Mouse Cursor

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".home_hero");
  const canvas = document.getElementById("cursorCanvas");
  const ctx = canvas.getContext("2d");

  // === CONFIGURATION ===
  const CONFIG = {
    maxParticles: 5,
    color: "#4564FF",
    minSize: 50,
    maxSize: 150,
    opacity: 0.15,
    fadeOut: true,
    lifespan: 200,
    spawnRate: 5,
    fadeSpeed: 0.05, // speed for fade in/out
    icons: [
      // Left side
      { src: "assets/img/service-components/seo-component.png", x: 80, y: 150, w: 200, h: 200 },
      { src: "assets/img/service-components/web-design-component.png", x: 150, y: 500, w: 200, h: 200 },

      // Right side (dynamic X based on canvas width)
      { src: "assets/img/service-components/graphic-design-component.png", x: (canvas) => canvas.width - 100 - 200, y: 100, w: 200, h: 200 },
      { src: "assets/img/service-components/social-media-component.png", x: (canvas) => canvas.width - 200 - 150, y: 350, w: 200, h: 200 },
      { src: "assets/img/service-components/mobile-application-component.png", x: (canvas) => canvas.width - 400 - 100, y: 610, w: 200, h: 200 }
    ]
  };

  // Preload images
  CONFIG.icons.forEach(icon => {
    const img = new Image();
    img.src = icon.src;
    icon.img = img;
    icon.alpha = 0; // opacity (0 = hidden, 1 = visible)
    icon.hovered = false;
  });

  function resizeCanvas() {
    canvas.width = hero.clientWidth;
    canvas.height = hero.clientHeight;

    // Update right-side icons (recalculate x if function)
    CONFIG.icons.forEach(icon => {
      if (typeof icon.x === "function") {
        icon._x = icon.x(canvas); // store evaluated X
      } else {
        icon._x = icon.x; // fixed value
      }
    });
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const particles = [];
  let mouseX = null;
  let mouseY = null;
  let isMouseMoving = false;
  let spawnCounter = 0;

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = random(CONFIG.minSize, CONFIG.maxSize);
      this.alpha = CONFIG.opacity;
      this.age = 0;
    }
    update() {
      this.age++;
      if (CONFIG.fadeOut) {
        this.alpha = CONFIG.opacity * (1 - this.age / CONFIG.lifespan);
      }
    }
    draw() {
      const gradient = ctx.createRadialGradient(
        this.x, this.y, this.size * 0.1,
        this.x, this.y, this.size
      );
      gradient.addColorStop(0, hexToRgba(CONFIG.color, this.alpha));
      gradient.addColorStop(1, hexToRgba(CONFIG.color, 0));

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }
  function hexToRgba(hex, alpha = 1) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split("");
      if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      c = "0x" + c.join("");
      return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",")},${alpha})`;
    }
    return hex;
  }

  // Detect if mouse is inside image area
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    isMouseMoving = true;

    CONFIG.icons.forEach(icon => {
      const x = icon._x ?? icon.x; // use evaluated X
      const y = icon.y;
      if (
        mouseX >= x &&
        mouseX <= x + icon.w &&
        mouseY >= y &&
        mouseY <= y + icon.h
      ) {
        icon.hovered = true;
      } else {
        icon.hovered = false;
      }
    });
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Glow particles
    if (mouseX !== null && mouseY !== null) {
      spawnCounter++;
      if (isMouseMoving && spawnCounter % CONFIG.spawnRate === 0) {
        particles.push(new Particle(mouseX, mouseY));
        if (particles.length > CONFIG.maxParticles) particles.shift();
      }
    }

    particles.forEach((particle, i) => {
      particle.update();
      if (CONFIG.fadeOut && particle.alpha <= 0) {
        particles.splice(i, 1);
      } else {
        particle.draw();
      }
    });

    // Draw icons with fade in/out
    CONFIG.icons.forEach(icon => {
      if (!icon.img.complete) return;

      if (icon.hovered && icon.alpha < 1) {
        icon.alpha += CONFIG.fadeSpeed; // fade in
      } else if (!icon.hovered && icon.alpha > 0) {
        icon.alpha -= CONFIG.fadeSpeed; // fade out
      }

      if (icon.alpha > 0) {
        const x = icon._x ?? icon.x; // resolved X
        ctx.save();
        ctx.globalAlpha = icon.alpha;
        ctx.drawImage(icon.img, x, icon.y, icon.w, icon.h);
        ctx.restore();
      }
    });

    isMouseMoving = false;
    requestAnimationFrame(animate);
  }

  animate();
});


// Services Slider

document.querySelectorAll('.service_swiper').forEach(function (el) {
  new Swiper(el, {
    slidesPerView: 2.5,
    spaceBetween: 10, // reduce gap to compensate scale 0.5
    loop: true,
    centeredSlides: false,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    slideToClickedSlide: true,
  });
});


//  Replace all SVG images with inline SVG

$(document).ready(function () {
  jQuery('img.svg').each(function () {
    var $img = jQuery(this);
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function (data) {
      // Get the SVG tag, ignore the rest
      var $svg = jQuery(data).find('svg');

      // Set the replaced image's classes to the new SVG
      $svg.attr('class', $img.attr('class'));

      // Remove any invalid XML tags as per http://validator.w3.org
      $svg.removeAttr('xmlns:a');

      // Replace image with new SVG
      $img.replaceWith($svg);

    }, 'xml');
  });

});


// Initialize counter animation

$(document).ready(function () {
  function animateCounter(counter) {
    if ($(counter).hasClass('animated')) return;

    $(counter).addClass('animated');
    $(counter).prop('Counter', 0).animate({
      Counter: $(counter).text()
    }, {
      duration: 3000,
      easing: 'swing',
      step: function (now) {
        $(this).text(Math.ceil(now));
      }
    });
  }

  let observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target); // Stop observing after animation starts
      }
    });
  }, { root: null, threshold: 0.3 });

  $('.counter').each(function () {
    observer.observe(this);
  });

  // Check if any counter is already in view on page load
  $(window).on("load", function () {
    $(".counter").each(function () {
      if ($(this).is(":visible") && $(this).offset().top < $(window).scrollTop() + $(window).height()) {
        animateCounter(this);
      }
    });
  });
});


// Client Carousel

$(document).ready(function () {
  $(".clientSlider").owlCarousel({
    loop: true,
    margin: 20,
    dots: false,
    nav: true,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,

    navText: [
      '<i class="fa-solid fa-arrow-left"></i>',
      '<i class="fa-solid fa-arrow-right"></i>'
    ],
    responsive: {
      0: { items: 1 },
      575: { items: 2 },
      992: { items: 3 },
      1400: { items: 4 }
    }
  });
});


// Testimonial Carousel

$(document).ready(function () {
  $(".testimonialSlider").owlCarousel({
    loop: true,
    margin: 20,
    dots: false,
    nav: true,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,

    navText: [
      '<i class="fa-solid fa-arrow-left"></i>',
      '<i class="fa-solid fa-arrow-right"></i>'
    ],
    responsive: {
      0: { items: 1 },
      575: { items: 2 },
      992: { items: 3 },
      1400: { items: 4 }
    }
  });
});


// Contact form

const inputs = document.querySelectorAll(".input");

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});
