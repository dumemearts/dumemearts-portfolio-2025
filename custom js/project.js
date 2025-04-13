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




  // HERO DIGITAL DESIGNER TEXT STAGGER DESKTOP
  document.addEventListener("DOMContentLoaded", function () {
    function initGSAPAnimation() {
      let isTabletOrBelow = window.innerWidth <= 991;
    
      gsap.from(".heading-letter-h1, .heading-letter-h1.is--space", {
      y: 100,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: "power3.out",
      delay: 1.3,
      scrollTrigger: {
        trigger: ".hero-inner",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: isTabletOrBelow ? "play none none none" : "none none none none", 
        onEnter: isTabletOrBelow
        ? null
        : (self) => setTimeout(() => self.animation.restart(), 500),
        onEnterBack: isTabletOrBelow
        ? null
        : (self) => setTimeout(() => self.animation.restart(), 500),
        once: isTabletOrBelow, // Ensures it only plays once on tablet and below
      },
      });
    }
    
    initGSAPAnimation(); // Run animation check on page load
    
    // Listen for window resize to dynamically reinitialize animation
    window.addEventListener("resize", function () {
      gsap.killTweensOf(".heading-letter, .heading-letter.is--space"); // Kill animation on resize
      initGSAPAnimation(); // Reinitialize animation
    });
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
gsap.from(".heading-style-display-alt", {
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




// FOOTER ELEMENTS VISIBLE
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".section-ticker, .footer-link-inner").forEach((el) => {
    el.style.display = "flex";
    el.style.opacity = "1";
    el.style.visibility = "visible";
  });
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

