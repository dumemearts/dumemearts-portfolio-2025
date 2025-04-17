// HERO TEXT STAGGER DESKTOP
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