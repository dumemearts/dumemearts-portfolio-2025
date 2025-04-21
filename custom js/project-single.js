// HERO TEXT STAGGER DESKTOP
document.addEventListener("DOMContentLoaded", function () {
  function initGSAPAnimation() {
    let isTabletOrBelow = window.innerWidth <= 991;

    // ✅ Only apply animation if screen is desktop
    if (!isTabletOrBelow) {
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
          toggleActions: "play none none none",
          once: true
        }
      });
    }
  }

  initGSAPAnimation();

  window.addEventListener("resize", function () {
    // Kill animation on resize and re-init only for desktop
    gsap.killTweensOf(".heading-letter, .heading-letter.is--space");
    initGSAPAnimation();
  });
});
  
    



  // OSMO SCALING ELEMENT
  function initFlipOnScroll() {
    let wrapperElements = document.querySelectorAll("[data-flip-element='wrapper']");
    let targetEl = document.querySelector("[data-flip-element='target']");
  
    let tl;
    function flipTimeline() {
      if (tl) {
        tl.kill();
        gsap.set(targetEl, { clearProps: "all" });
      }
      
      // Use the first and last wrapper elements for the scroll trigger.
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperElements[0],
          start: "center center",
          endTrigger: wrapperElements[wrapperElements.length - 1],
          end: "center center",
          scrub: 0.4
        }
      });
      
      // Loop through each wrapper element.
      wrapperElements.forEach(function(element, index) {
        let nextIndex = index + 1;
        if (nextIndex < wrapperElements.length) {
          let nextWrapperEl = wrapperElements[nextIndex];
          // Calculate vertical center positions relative to the document.
          let nextRect = nextWrapperEl.getBoundingClientRect();
          let thisRect = element.getBoundingClientRect();
          let nextDistance = nextRect.top + window.pageYOffset + nextWrapperEl.offsetHeight / 2;
          let thisDistance = thisRect.top + window.pageYOffset + element.offsetHeight / 2;
          let offset = nextDistance - thisDistance;
          // Add the Flip.fit tween to the timeline.
          tl.add(
            Flip.fit(targetEl, nextWrapperEl, {
              duration: 3,
              ease: "none"
            })
          );
        }
      });
    }
  
    flipTimeline();
  
    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        flipTimeline();
      }, 100);
    });
  }
  
  // Initialize Scaling Elements on Scroll (GSAP Flip)
  document.addEventListener('DOMContentLoaded', function() {
    initFlipOnScroll();
  });




// SCROLL HIGHLIGHT
window.addEventListener("DOMContentLoaded", () => {
  if (typeof SplitText === "undefined") {
    console.error("SplitText plugin not loaded.");
    return;
  }

  const split = new SplitText(".slider-text-large", {
    type: "lines, chars",
    linesClass: "split-line"
  });

  gsap.fromTo(
    split.chars,
    {
      opacity: 0.2
    },
    {
      opacity: 1,
      ease: "power2.out",
      duration: 1,
      stagger: {
        each: 0.1,
        from: "start"
      },
      scrollTrigger: {
        trigger: ".slider-text-large",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1 // Slows scroll sync
      }
    }
  );
});
