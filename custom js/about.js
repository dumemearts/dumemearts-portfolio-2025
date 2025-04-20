// MWG CERTIFIED CARDS
window.onload = function () {
  // ✅ Only run animation on desktop (greater than 991px)
  if (window.innerWidth <= 991) return;

  const container = document.querySelector('.layout-component .layout-container');
  if (!container) return;

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
};




// HERO TEXT STAGGER DESKTOP
document.addEventListener("DOMContentLoaded", function () {
  function initGSAPAnimation() {
    let isTabletOrBelow = window.innerWidth <= 991;
  
    gsap.from(".heading-letter-h1, .heading-letter-h1.is--space", {
    y: 100,
    opacity: 0,
    duration: 1.5,
    stagger: 0.05,
    ease: "power3.out",
    delay: 1,
    scrollTrigger: {
      trigger: ".layout-inner.IS--ABOUT",
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





  // OSMO MARQUEE FEATURED SCROLL DIRECTION
  function initMarqueeScrollDirection() {
    document.querySelectorAll('[data-marquee-scroll-direction-target]').forEach((marquee) => {
      // Query marquee elements
      const marqueeContent = marquee.querySelector('[data-marquee-collection-target]');
      const marqueeScroll = marquee.querySelector('[data-marquee-scroll-target]');
      if (!marqueeContent || !marqueeScroll) return;
  
      // Get data attributes
      const { marqueeSpeed: speed, marqueeDirection: direction, marqueeDuplicate: duplicate, marqueeScrollSpeed: scrollSpeed } = marquee.dataset;
  
      // Convert data attributes to usable types
      const marqueeSpeedAttr = parseFloat(speed);
      const marqueeDirectionAttr = direction === 'right' ? 1 : -1; // 1 for right, -1 for left
      const duplicateAmount = parseInt(duplicate || 0);
      const scrollSpeedAttr = parseFloat(scrollSpeed);
      const speedMultiplier = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;
  
      let marqueeSpeed = marqueeSpeedAttr * (marqueeContent.offsetWidth / window.innerWidth) * speedMultiplier;
  
      // Precompute styles for the scroll container
      marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`;
      marqueeScroll.style.width = `${(scrollSpeedAttr * 2) + 100}%`;
  
      // Duplicate marquee content
      if (duplicateAmount > 0) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < duplicateAmount; i++) {
          fragment.appendChild(marqueeContent.cloneNode(true));
        }
        marqueeScroll.appendChild(fragment);
      }
  
      // GSAP animation for marquee content
      const marqueeItems = marquee.querySelectorAll('[data-marquee-collection-target]');
      const animation = gsap.to(marqueeItems, {
        xPercent: -100, // Move completely out of view
        repeat: -1,
        duration: marqueeSpeed,
        ease: 'linear'
      }).totalProgress(0.5);
  
      // Initialize marquee in the correct direction
      gsap.set(marqueeItems, { xPercent: marqueeDirectionAttr === 1 ? 100 : -100 });
      animation.timeScale(marqueeDirectionAttr); // Set correct direction
      animation.play(); // Start animation immediately
  
      // Set initial marquee status
      marquee.setAttribute('data-marquee-status', 'normal');
  
      // ScrollTrigger logic for direction inversion
      ScrollTrigger.create({
        trigger: marquee,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const isInverted = self.direction === 1; // Scrolling down
          const currentDirection = isInverted ? -marqueeDirectionAttr : marqueeDirectionAttr;
  
          // Update animation direction and marquee status
          animation.timeScale(currentDirection);
          marquee.setAttribute('data-marquee-status', isInverted ? 'normal' : 'inverted');
        }
      });
  
      // Extra speed effect on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: marquee,
          start: '0% 100%',
          end: '100% 0%',
          scrub: 0
        }
      });
  
      const scrollStart = marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr;
      const scrollEnd = -scrollStart;
  
      tl.fromTo(marqueeScroll, { x: `${scrollStart}vw` }, { x: `${scrollEnd}vw`, ease: 'none' });
    });
  }
  
  // Initialize Marquee with Scroll Direction
  document.addEventListener('DOMContentLoaded', () => {
    initMarqueeScrollDirection();
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
  



  	// TESTIMONIAL SLIDER
	let photoSwiper = new Swiper(".swiper.is-photos", {
	  effect: "cards",
	  grabCursor: true,
	  loop: true,
	  keyboard: true,
	  // Navigation arrows
	  navigation: {
		nextEl: ".arrow.is-right",
		prevEl: ".arrow.is-left"
	  }
	});
	let contentSwiper = new Swiper(".swiper.is-content", {
	  speed: 0,
	  loop: true,
	  followFinger: false,
	  effect: 'fade',
	  fadeEffect: {
		crossFade: true
	  }
	});
	photoSwiper.controller.control = contentSwiper;
	contentSwiper.controller.control = photoSwiper;
	
	


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
  





// MWG SPIRAL CARDS 
window.addEventListener("DOMContentLoaded", () => {
  // OPTIONAL: Lenis Smooth Scroll
  const lenis = new Lenis({ autoRaf: true });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Hide scroll label on scroll start
  gsap.to('.scroll', {
    autoAlpha: 0,
    duration: 0.2,
    scrollTrigger: {
      trigger: '.spiral-cards',
      start: 'top top',
      end: 'top top-=1',
      toggleActions: "play none reverse none"
    }
  });

  // 3D Y rotation on scroll for each media element
  const medias = document.querySelectorAll('.spiral-cards .about-media');
  medias.forEach(media => {
    gsap.to(media, {
      rotationY: 360,
      ease: 'none',
      scrollTrigger: {
        trigger: media,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.4
      }
    });
  });
});





// OSMO LOOPING WORDS
document.addEventListener('DOMContentLoaded', function() {
  const wordList = document.querySelector('[data-looping-words-list]');
  const words = Array.from(wordList.children);
  const totalWords = words.length;
  const wordHeight = 100 / totalWords; // Offset as a percentage
  const edgeElement = document.querySelector('[data-looping-words-selector]');
  let currentIndex = 0;

  function updateEdgeWidth() {
    const centerIndex = (currentIndex + 1) % totalWords;
    const centerWord = words[centerIndex];
    const centerWordWidth = centerWord.getBoundingClientRect().width;
    const listWidth = wordList.getBoundingClientRect().width;
    const percentageWidth = (centerWordWidth / listWidth) * 100;

    gsap.to(edgeElement, {
      width: `${percentageWidth}%`,
      duration: 0.5,
      ease: 'Expo.easeOut',
    });
  }

  function moveWords() {
    currentIndex++;

    gsap.to(wordList, {
      yPercent: -wordHeight * currentIndex,
      duration: 1.2,
      ease: 'elastic.out(1, 0.85)',
      onStart: updateEdgeWidth,
      onComplete: function() {
        if (currentIndex >= totalWords - 3) {
          wordList.appendChild(wordList.children[0]);
          currentIndex--;
          gsap.set(wordList, { yPercent: -wordHeight * currentIndex });
          words.push(words.shift());
        }
      }
    });
  }

  updateEdgeWidth();

  gsap.timeline({ repeat: -1, delay: 1 })
    .call(moveWords)
    .to({}, { duration: 2 })
    .repeat(-1);
});

