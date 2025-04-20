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




// FOOTER ELEMENTS VISIBLE
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".section-ticker, .footer-link-inner, .footer-bottom-middle-mobile, .nav-bottom").forEach((el) => {
    el.style.display = "flex";
    el.style.opacity = "1";
    el.style.visibility = "visible";
  });
});




// HERO TEXT STAGGER DESKTOP
document.addEventListener("DOMContentLoaded", function () {
  function initGSAPAnimation() {
    let isTabletOrBelow = window.innerWidth <= 991;
  
    gsap.from(".heading-letter-h1, .heading-letter-h1.is--negative", {
    y: 100,
    opacity: 0,
    duration: 1.5,
    stagger: 0.05,
    ease: "power3.out",
    delay: 1,
    scrollTrigger: {
      trigger: ".layout-inner.is--contact",
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