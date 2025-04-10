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




// H2 TEXT STAGGER DESKTOP
document.addEventListener("DOMContentLoaded", function () {
  gsap.utils.toArray(".heading-style-h2").forEach((triggerElement) => {
    gsap.from(triggerElement.querySelectorAll(".heading-letter-h2"), {
      opacity: 0,
      y: 50,
      duration: 0.6,
      stagger: 0.05,
      ease: "power2.out",
      scrollTrigger: {
        trigger: triggerElement, // Triggers when any .heading-style-h2 is in view
        start: "top 80%", // Start animation when the element is 80% into the viewport
        once: true, // Only animate once
      },
    });
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
  document.querySelectorAll(".section-ticker, .footer-link-inner, .footer-bottom-middle-mobile, .nav-bottom").forEach((el) => {
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





// FORM CODE
document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector(".form-wrapper");
  var successMessage = document.querySelector(".success-message");

  if (!form || !successMessage) {
    console.error("Missing form or success message element.");
    return;
  }

  // Create a MutationObserver to detect new elements added to the DOM
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Check if the new node is a div with the correct styles
          const computedStyle = window.getComputedStyle(node);
          if (
            node.tagName === "DIV" &&
            computedStyle.marginTop === "16px" && // 1rem in pixels
            computedStyle.marginBottom === "16px"
          ) {
            console.log("Target div detected:", node); // Debugging log

            // Hide the donation form
            form.style.display = "none";

            // Show the success message
            successMessage.style.display = "block";

            // Stop observing after detecting the div
            observer.disconnect();
          }
        }
      });
    });
  });

  // Observe the entire document for changes
  observer.observe(document.body, { childList: true, subtree: true });
});