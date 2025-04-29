// HERO TEXT STAGGER DESKTOP
document.addEventListener("DOMContentLoaded", function () {
  function initGSAPAnimation() {
    let isTabletOrBelow = window.innerWidth <= 991;

    // ✅ Only apply animation if screen is desktop
    if (!isTabletOrBelow) {
      gsap.from(".heading-letter-h1, .heading-letter-h1.is--space", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.05,
        ease: "power3.out",
        delay: 0.7,
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
  
