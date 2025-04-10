// NAV MENU ITEMS HOVER STAGGER
function initButtonCharacterStagger() {
  const offsetIncrement = 0.05; // Transition offset increment in seconds
  const buttons = document.querySelectorAll('[data-button-animate-chars]');

  buttons.forEach(button => {
    const text = button.textContent; // Get the button's text content
    button.innerHTML = ''; // Clear the original content

    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;

      // Handle spaces explicitly
      if (char === ' ') {
        span.style.whiteSpace = 'pre'; // Preserve space width
      }

      button.appendChild(span);
    });
  });
}

// Initialize Button Character Stagger Animation
document.addEventListener('DOMContentLoaded', () => {
  initButtonCharacterStagger();
});



// CERTIFIED CARDS
window.addEventListener("DOMContentLoaded", () => {
  // ✅ Only run animation on desktop (greater than 991px)
  if (window.innerWidth <= 991) return;

  const container = document.querySelector('.layout-component .layout-container');
  const containerW = container.clientWidth;
  const cards = document.querySelectorAll('.layout-card');
  const cardsLength = cards.length;
  const cardContent = document.querySelectorAll('.layout-card');
  let currentPortion = 0;

  cards.forEach(card => {
    gsap.set(card, {
      xPercent: (Math.random() - 0.5) * 10,
      yPercent: (Math.random() - 0.5) * 10,
      rotation: (Math.random() - 0.5) * 20,
    });
  });

  container.addEventListener("mousemove", e => {
    const mouseX = e.clientX - container.getBoundingClientRect().left;
    const percentage = mouseX / containerW;
    const activePortion = Math.ceil(percentage * cardsLength);

    if (currentPortion !== activePortion && activePortion > 0 && activePortion <= cardsLength) {
      if (currentPortion !== 0) resetPortion(currentPortion - 1);
      currentPortion = activePortion;
      newPortion(currentPortion - 1);
    }
  });

  container.addEventListener("mouseleave", () => {
    resetPortion(currentPortion - 1);
    currentPortion = 0;

    gsap.to(cardContent, {
      xPercent: 0,
      ease: 'elastic.out(1, 0.75)',
      duration: 0.8
    });
  });

  function resetPortion(index) {
    gsap.to(cards[index], {
      xPercent: (Math.random() - 0.5) * 10,
      yPercent: (Math.random() - 0.5) * 10,
      rotation: (Math.random() - 0.5) * 20,
      scale: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.75)',
    });
  }

  function newPortion(i) {
    gsap.to(cards[i], {
      xPercent: 0,
      yPercent: 0,
      rotation: 0,
      duration: 0.8,
      scale: 1.1,
      ease: 'elastic.out(1, 0.75)'
    });

    cardContent.forEach((content, index) => {
      if (index !== i) {
        gsap.to(content, {
          xPercent: 80 / (index - i),
          ease: 'elastic.out(1, 0.75)',
          duration: 0.8
        });
      } else {
        gsap.to(content, {
          xPercent: 0,
          ease: 'elastic.out(1, 0.75)',
          duration: 0.8
        });
      }
    });
  }
});







// IMAGE SLIDESHOW
function initImageCycle() {
  document.querySelectorAll("[data-image-cycle]").forEach(cycleElement => {
    const items = cycleElement.querySelectorAll("[data-image-cycle-item]");
    if (items.length < 2) return;

    let currentIndex = 0, intervalId;
    const duration = 2000;
    const isTwoItems = items.length === 2;

    // Initialize: First active, others not-active
    items.forEach((item, i) => item.setAttribute("data-image-cycle-item", i ? "not-active" : "active"));

    function cycleImages() {
      const prevIndex = currentIndex;
      currentIndex = (currentIndex + 1) % items.length;

      if (isTwoItems) {
        // Special case: Only two images → Toggle between "previous" and "active"
        items[prevIndex].setAttribute("data-image-cycle-item", "previous");
      } else {
        // Normal case: Three or more images
        items[prevIndex].setAttribute("data-image-cycle-item", "previous");
        setTimeout(() => items[prevIndex].setAttribute("data-image-cycle-item", "not-active"), duration);
      }

      items[currentIndex].setAttribute("data-image-cycle-item", "active");
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !intervalId) intervalId = setInterval(cycleImages, duration);
      else clearInterval(intervalId), intervalId = null;
    }, { threshold: 0 });

    observer.observe(cycleElement);
  });
}
// Initialize Image Cycle
document.addEventListener('DOMContentLoaded', function() {
  initImageCycle();
});





// PARAGRAPH SPLIT TEXT 
const splitTypes = document.querySelectorAll('.scroll-highlight');
splitTypes.forEach((char,i) => {
  const text = new SplitType(char, {types: ['chars','words']});
  gsap.from(text.chars, {
    scrollTrigger: {
      trigger: char,
      start: 'top 80%',
      end: 'top 20%',
      scrub: true,
    },
    opacity: 0.2,
    stagger: 0.1,
  })
});





window.addEventListener("DOMContentLoaded", (event) => {
    $(".hover-component").each(function () {
      let componentEl = $(this),
        triggerEl = componentEl.find(".hover-item"),
        targetEl = componentEl.find(".cursor-list");
      triggerEl.on("mouseenter", function () {
        let triggerIndex = $(this).index();
        targetEl.css("transform", `translateY(${triggerIndex * -100}%)`);
      });
    });
});





// FOOTER CONTACT ME TEXT STAGGER
gsap.from(".heading-style-display,.heading-style-display.is-subtract,.heading-style-display.is--next", {
  y: 100,
  opacity: 0,
  duration: 0.4,
  stagger: 0.05,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".footer-wrapper",
    start: "top 75%",
    toggleActions: "restart pause resume pause",
    once: false,
  },
});




// FOOTER TICKER ANIMATION
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin();

  let ticker = document.querySelector(".email-ticker-wrapper");
  if (!ticker) return;

  let tickerAnimation = gsap.to(ticker, {
    x: "-50%", // Moves by half since content is duplicated
    duration: 20, // Adjust speed as needed
    ease: "linear", // Keeps constant speed
    repeat: -1, // Infinite loop
  });

  // Pause on hover
  ticker.addEventListener("mouseenter", function () {
    tickerAnimation.pause();
  });

  // Resume on hover out
  ticker.addEventListener("mouseleave", function () {
    tickerAnimation.resume();
  });
});








// HERO IMAGE TRAIL
function initImageTrail(config = {}) {

  // config + defaults
  const options = {
    minWidth: config.minWidth ?? 992,
    moveDistance: config.moveDistance ?? 15,
    stopDuration: config.stopDuration ?? 300,
    trailLength: config.trailLength ?? 5
  };

  const wrapper = document.querySelector('[data-trail="wrapper"]');
  
  if (!wrapper || window.innerWidth < options.minWidth) {
    return;
  }
  
  // State management
  const state = {
    trailInterval: null,
    globalIndex: 0,
    last: { x: 0, y: 0 },
    trailImageTimestamps: new Map(),
    trailImages: Array.from(document.querySelectorAll('[data-trail="item"]')),
    isActive: false
  };

  // Utility functions
  const MathUtils = {
    lerp: (a, b, n) => (1 - n) * a + n * b,
    distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1)
  };

  function getRelativeCoordinates(e, rect) {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function activate(trailImage, x, y) {
    if (!trailImage) return;

    const rect = trailImage.getBoundingClientRect();
    const styles = {
      left: `${x - rect.width / 2}px`,
      top: `${y - rect.height / 2}px`,
      zIndex: state.globalIndex,
      display: 'block'
    };

    Object.assign(trailImage.style, styles);
    state.trailImageTimestamps.set(trailImage, Date.now());

	// Here, animate how the images will appear!
    gsap.fromTo(
      trailImage,
      { autoAlpha: 0, scale: 0.8 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 0.2,
        overwrite: true
      }
    );

    state.last = { x, y };
  }

  function fadeOutTrailImage(trailImage) {
    if (!trailImage) return;
		
    // Here, animate how the images will disappear!
    gsap.to(trailImage, {
      opacity: 0,
      scale: 0.2,
      duration: 0.8,
      ease: "expo.out",
      onComplete: () => {
        gsap.set(trailImage, { autoAlpha: 0 });
      }
    });
  }

  function handleOnMove(e) {
    if (!state.isActive) return;

    const rectWrapper = wrapper.getBoundingClientRect();
    const { x: relativeX, y: relativeY } = getRelativeCoordinates(e, rectWrapper);
    
    const distanceFromLast = MathUtils.distance(
      relativeX, 
      relativeY, 
      state.last.x, 
      state.last.y
    );

    if (distanceFromLast > window.innerWidth / options.moveDistance) {
      const lead = state.trailImages[state.globalIndex % state.trailImages.length];
      const tail = state.trailImages[(state.globalIndex - options.trailLength) % state.trailImages.length];

      activate(lead, relativeX, relativeY);
      fadeOutTrailImage(tail);
      state.globalIndex++;
    }
  }

  function cleanupTrailImages() {
    const currentTime = Date.now();
    for (const [trailImage, timestamp] of state.trailImageTimestamps.entries()) {
      if (currentTime - timestamp > options.stopDuration) {
        fadeOutTrailImage(trailImage);
        state.trailImageTimestamps.delete(trailImage);
      }
    }
  }

  function startTrail() {
    if (state.isActive) return;
    
    state.isActive = true;
    wrapper.addEventListener("mousemove", handleOnMove);
    state.trailInterval = setInterval(cleanupTrailImages, 100);
  }

  function stopTrail() {
    if (!state.isActive) return;
    
    state.isActive = false;
    wrapper.removeEventListener("mousemove", handleOnMove);
    clearInterval(state.trailInterval);
    state.trailInterval = null;
    
    // Clean up remaining trail images
    state.trailImages.forEach(fadeOutTrailImage);
    state.trailImageTimestamps.clear();
  }

  // Initialize ScrollTrigger
  ScrollTrigger.create({
    trigger: wrapper,
    start: "top bottom",
    end: "bottom top",
    onEnter: startTrail,
    onEnterBack: startTrail,
    onLeave: stopTrail,
    onLeaveBack: stopTrail
  });

  // Clean up on window resize
  const handleResize = () => {
    if (window.innerWidth < options.minWidth && state.isActive) {
      stopTrail();
    } else if (window.innerWidth >= options.minWidth && !state.isActive) {
      startTrail();
    }
  };

  window.addEventListener('resize', handleResize);

  return () => {
    stopTrail();
    window.removeEventListener('resize', handleResize);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const imageTrail = initImageTrail({
    minWidth: 992,
    moveDistance: 15,
    stopDuration: 350,
    trailLength: 8
  });
});

initFooterTrail({
  minWidth: 992,    // Breakpoint in pixels - below this width, the effect is disabled
  moveDistance: 15,  // Controls how fast images appear (lower = more frequent)
  stopDuration: 300, // Time in ms before images start fading when mouse stops
  trailLength: 5     // Number of images visible before they start fading out
});
