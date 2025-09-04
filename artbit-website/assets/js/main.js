
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