// MGW WORD ANIMATION
window.addEventListener("DOMContentLoaded", () => {
	// Hide scroll prompt on scroll
	gsap.to('.scroll-home', {
	  autoAlpha: 0,
	  duration: 0.5,
	  scrollTrigger: {
		trigger: document.body,
		start: 'top top',
		end: 'top top-=1',
		toggleActions: "play none reverse none"
	  }
	});
  
	// Animate each word
	document.querySelectorAll('.expertise-wrapper .word').forEach(word => {
	  gsap.to(word.children, {
		yPercent: '+=100',
		ease: 'expo.inOut',
		scrollTrigger: {
		  trigger: word,
		  start: "bottom bottom",
		  end: "top 55%",
		  scrub: 3
		}
	  });
	});
  });
	
  
  
  
	// TR PROJECT SCROLL ANIMATION
	$("[tr-scroll-toggle='component']").each(function (index) {
	  // get elements
	  let component = $(this);
	  let lists = component.find("[tr-scroll-toggle='list']");
	  // set item total
	  let itemTotal = lists.first().children().length;
	  component.find("[tr-scroll-toggle='number-total']").text(itemTotal);
	  // create trigger divs & spacer
	  let firstTrigger = component.find("[tr-scroll-toggle='trigger']").first();
	  for (let i = 1; i < itemTotal; i++) {
		firstTrigger.clone().appendTo(component);
	  }
	  let triggers = component.find("[tr-scroll-toggle='trigger']");
	  firstTrigger.css("margin-top", "-100vh");
	  let trSpacer = $("<div class='tr-scroll-toggle-spacer' style='width: 100%; height: 100vh;'></div>").hide().appendTo(component);
	  // check for min width
	  let minWidth = 0;
	  let trMinWidth = component.attr("tr-min-width");
	  if (trMinWidth !== undefined && trMinWidth !== false) {
		minWidth = +trMinWidth;
	  }
	  // main breakpoint
	  gsap.matchMedia().add(`(min-width: ${minWidth}px)`, () => {
		// show spacer
		trSpacer.show();
		// switch which item is active
		function makeItemActive(activeIndex) {
		  component.find("[tr-scroll-toggle='transform-y']").css("transform", `translateY(${activeIndex * -100}%)`);
		  component.find("[tr-scroll-toggle='transform-x']").css("transform", `translateX(${activeIndex * -100}%)`);
		  component.find("[tr-scroll-toggle='number-current']").text(activeIndex + 1);
		  lists.each(function (index) {
			$(this).children().removeClass("is-active");
			$(this).children().eq(activeIndex).addClass("is-active");
		  });
		}
		makeItemActive(0);
		// scroll to trigger div on click of anchor
		let anchorLinks = component.find("[tr-anchors]").children();
		anchorLinks.on("click", function () {
		  let myIndex = $(this).index();
		  let scrollDistance = triggers.eq(myIndex).offset().top + triggers.eq(myIndex).height() - 1;
		  $("html, body").animate({ scrollTop: scrollDistance });
		});
		// triggers timeline
		triggers.each(function (index) {
		  let triggerIndex = index;
		  let tl = gsap.timeline({
			scrollTrigger: {
			  trigger: $(this),
			  start: "top top",
			  end: "bottom top",
			  scrub: true,
			  onToggle: ({ self, isActive }) => {
				if (isActive) {
				  makeItemActive(triggerIndex);
				}
			  }
			},
			defaults: {
			  ease: "none"
			}
		  });
		  lists.each(function () {
			let childItem = $(this).children().eq(triggerIndex);
			tl.to(childItem.find("[tr-item-animation='scale-to-1']"), { scale: 1 }, 0);
			tl.from(childItem.find("[tr-item-animation='scale-from-1']"), { scale: 1 }, 0);
			tl.to(childItem.find("[tr-item-animation='progress-horizontal']"), { width: "100%" }, 0);
			tl.to(childItem.find("[tr-item-animation='progress-vertical']"), { height: "100%" }, 0);
			tl.to(childItem.find("[tr-item-animation='rotate-to-0']"), { rotation: 0 }, 0);
			tl.from(childItem.find("[tr-item-animation='rotate-from-0']"), { rotation: 0 }, 0);
		  });
		});
		// component timeline
		let tl = gsap.timeline({
		  scrollTrigger: {
			trigger: component,
			start: "top top",
			end: "bottom bottom",
			scrub: true
		  },
		  defaults: {
			ease: "none"
		  }
		});
		tl.to(component.find("[tr-section-animation='scale-to-1']"), { scale: 1 }, 0);
		tl.from(component.find("[tr-section-animation='scale-from-1']"), { scale: 1 }, 0);
		tl.to(component.find("[tr-section-animation='progress-horizontal']"), { width: "100%" }, 0);
		tl.to(component.find("[tr-section-animation='progress-vertical']"), { height: "100%" }, 0);
		tl.to(component.find("[tr-section-animation='rotate-to-0']"), { rotation: 0 }, 0);
		tl.from(component.find("[tr-section-animation='rotate-from-0']"), { rotation: 0 }, 0);
		// optional scroll snapping
		if (component.attr("tr-scroll-snap") === "true") {
		  let tl2 = gsap.timeline({
			scrollTrigger: {
			  trigger: component,
			  start: "top top",
			  end: "bottom bottom",
			  snap: {
				snapTo: "labelsDirectional",
				duration: { min: 0.01, max: 0.2 },
				delay: 0.0001,
				ease: "power1.out"
			  }
			}
		  });
		  triggers.each(function (index) {
			tl2.to($(this), { scale: 1, duration: 1 });
			tl2.addLabel("trigger" + index);
		  });
		}
		// smaller screen sizes
		return () => {
		  trSpacer.hide();
		  component.find("[tr-scroll-toggle='transform-y']").css("transform", "translateY(0%)");
		  component.find("[tr-scroll-toggle='transform-x']").css("transform", "translateX(0%)");
		  lists.each(function (index) {
			$(this).children().removeClass("is-active");
		  });
		};
	  });
	});
	
	
  
  
	
	
	 // OSMO STICKY WRAP 100VH 
  function initStickyTitleScroll() {
	const wraps = document.querySelectorAll('[data-sticky-title="wrap"]');
	
	wraps.forEach(wrap => {
	  const headings = Array.from(wrap.querySelectorAll('[data-sticky-title="heading"]'));
	  
	  const masterTl = gsap.timeline({
		scrollTrigger: {
		  trigger: wrap,
		  start: "top 40%",
		  end: "bottom bottom",
		  scrub: true,
		}
	  });
	  
	  const revealDuration = 0.7,
			fadeOutDuration = 0.7,
			overlapOffset = 0.15;
	  
	  headings.forEach((heading, index) => {
		// Save original heading content for screen readers
		heading.setAttribute("aria-label", heading.textContent);
		
		const split = new SplitText(heading, { type: "words,chars" });
		
		// Hide all the separate words from screenreader
		split.words.forEach(word => word.setAttribute("aria-hidden", "true"));
		
		// Reset visibility on the 'stacked' headings
		gsap.set(heading, { visibility: "visible" });
		
		const headingTl = gsap.timeline();
		headingTl.from(split.chars, {
		  autoAlpha: 0,
		  stagger: { amount: revealDuration, from: "start" },
		  duration: revealDuration
		});
		
		// Animate fade-out for every heading except the last one.
		if (index < headings.length - 1) {
		  headingTl.to(split.chars, {
			autoAlpha: 0,
			stagger: { amount: fadeOutDuration, from: "end" },
			duration: fadeOutDuration
		  });
		}
		
		// Overlap the start of fade-in of the new heading a little bit
		if (index === 0) {
		  masterTl.add(headingTl);
		} else {
		  masterTl.add(headingTl, `-=${overlapOffset}`);
		}
	  });
	});
  }
  
  document.addEventListener("DOMContentLoaded", () => {
	initStickyTitleScroll();
  })
  
  
  
  
  
  
	
	// MGW EXPERTISE CARDS
	  window.addEventListener("DOMContentLoaded", () => {
		const root = document.querySelector('.expertise-cards');
		const pinHeight = root.querySelector('.pin-height');
		const container = root.querySelector('.expertise-container');
		const cards = root.querySelectorAll('.expertise-card');
	
		// Fade out scroll label
		gsap.to('.scroll', {
		  autoAlpha: 0,
		  duration: 0.2,
		  scrollTrigger: {
			trigger: root,
			start: 'top top',
			end: 'top top-=1',
			toggleActions: "play none reverse none"
		  }
		});
	
		// Pin container during scroll
		ScrollTrigger.create({
		  trigger: pinHeight,
		  start: 'top top',
		  end: 'bottom bottom',
		  pin: container,
		  pinSpacing: false,
		  scrub: 0.4
		});
	
		// Set initial card position
		gsap.set(cards, {
		  yPercent: 50,
		  y: 0.5 * window.innerHeight
		});
	
		// Animate cards
		const tl = gsap.timeline({
		  scrollTrigger: {
			trigger: root,
			start: 'top top',
			end: 'bottom bottom',
			scrub: 0.4
		  }
		});
	
		CustomEase.create("custom", "M0,0 C0,0 0.098,0.613 0.5,0.5 0.899,0.386 1,1 1,1 ");
	
		tl.to(cards, {
		  yPercent: -50,
		  y: -0.5 * window.innerHeight,
		  duration: 1,
		  stagger: 0.12,
		  ease: "custom"
		}, 'step');
	
		tl.to(cards, {
		  rotation: () => (Math.random() - 0.5) * 20,
		  duration: 0.5,
		  stagger: 0.12,
		  ease: 'power3.out'
		}, 'step');
	
		tl.to(cards, {
		  rotation: 0,
		  duration: 0.5,
		  stagger: 0.12,
		  ease: 'power3.in'
		}, 'step+=0.5');
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
  
  
  
  
  
  
  
  
	// LOADER TRANSITION HOME
  document.addEventListener("DOMContentLoaded", function () {
	// Delay page load transition by 1.12s
	setTimeout(() => {
	  let tl = gsap.timeline();
	  tl.to(".transition-column", { yPercent: -100, stagger: 0.1 });
	  tl.set(".transition-wrapper", { display: "none" });
	}, 1000); // 1.12 seconds = 1120 milliseconds
  
	// link click
	$("a:not(.excluded-class)").on("click", function (e) {
	  let currentUrl = $(this).attr("href");
	  if (
		$(this).prop("hostname") === window.location.host &&
		!currentUrl.includes("#") &&
		$(this).attr("target") !== "_blank"
	  ) {
		e.preventDefault();
		let tl = gsap.timeline({
		  onComplete: () => (window.location.href = currentUrl)
		});
		tl.set(".transition-wrapper", { display: "flex" });
		tl.fromTo(".transition-column", { yPercent: 100 }, { yPercent: 0, stagger: 0.1 });
	  }
	});
  
	// On Back Button Tap
	window.onpageshow = function (event) {
	  if (event.persisted) window.location.reload();
	};
  });
  
  
  
  
  
  
  
  
  
	// MWG CARD SCROLL
  window.addEventListener("DOMContentLoaded", () => {
	// Disable on tablet and below
	if (window.innerWidth <= 767) return;
  
	// Optional: Lenis smooth scroll setup
	if (typeof Lenis !== "undefined") {
	  const lenis = new Lenis({ autoRaf: true });
	}
  
	const container = document.querySelector('.card-container');
	const cardsContainer = container.querySelector('.cards');
	const cards = document.querySelectorAll('.scroll-card');
	const distance = cardsContainer.clientWidth - window.innerWidth;
  
	// Animate horizontal scroll
	const scrollTween = gsap.to(cardsContainer, {
	  x: -distance,
	  ease: 'none',
	  scrollTrigger: {
		trigger: container,
		scrub: 0.4,
		start: 'top top',
		end: '+=' + distance
	  }
	});
  
	// Animate each card independently
	cards.forEach(card => {
	  const values = {
		x: (Math.random() * 20 + 30) * (Math.random() < 0.5 ? 1 : -1),
		y: (Math.random() * 6 + 10) * (Math.random() < 0.5 ? 1 : -1),
		rotation: (Math.random() * 10 + 10) * (Math.random() < 0.5 ? 1 : -1)
	  };
  
	  gsap.fromTo(card,
		{
		  rotation: values.rotation,
		  xPercent: values.x,
		  yPercent: values.y
		},
		{
		  rotation: -values.rotation,
		  xPercent: -values.x,
		  yPercent: -values.y,
		  ease: 'none',
		  scrollTrigger: {
			trigger: card,
			containerAnimation: scrollTween,
			start: 'left 120%',
			end: 'right -20%',
			scrub: 0.4
		  }
		}
	  );
	});
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
	
	
  
	
	
  
	