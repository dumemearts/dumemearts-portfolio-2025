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
  



 	// MAIN SPLIT TEXT
   Webflow.push(function () {
	  setTimeout(() => {
		if (typeof SplitText === "undefined" || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
		  console.error("Missing GSAP or SplitText plugins");
		  return;
		}
  
		// ========== LINE SPLIT ==========
		document.querySelectorAll('[data-split="lines"]').forEach((el) => {
		  const split = new SplitText(el, {
			type: "lines",
			linesClass: "split-line"
		  });
  
		  // Wrap each line in a block for better animation control
		  split.lines.forEach((line) => {
			const wrap = document.createElement("div");
			wrap.classList.add("split-line-wrap");
			line.parentNode.insertBefore(wrap, line);
			wrap.appendChild(line);
		  });
  
		  // Animate lines
		  gsap.from(split.lines, {
			scrollTrigger: {
			  trigger: el,
			  start: "top 85%",
			  toggleActions: "play none none none"
			},
			yPercent: 100,
			opacity: 0,
			ease: "power3.out",
			stagger: 0.1,
			duration: 0.6
		  });
		});
  
		// ========== LETTER SPLIT ==========
		document.querySelectorAll('[data-split="letters"]').forEach((el) => {
		  if (el.hasAttribute("split-ran")) return;
		  const split = new SplitText(el, {
			type: "words,chars",
			charsClass: "split-letter"
		  });
		  el.setAttribute("split-ran", "true");
  
		  // Animate letters
		  gsap.from(split.chars, {
			scrollTrigger: {
			  trigger: el,
			  start: "top 85%",
			  toggleActions: "play none none none"
			},
			y: 60,
			opacity: 0,
			ease: "power3.out",
			stagger: 0.05,
			duration: 1
		  });
		});
  
	  }, 100); // Delay to make sure DOM and Webflow render is done
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
