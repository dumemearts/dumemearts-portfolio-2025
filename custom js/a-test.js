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
		  toggleActions: isTabletOrBelow ? "play none none none" : "restart none none none", 
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
  
  
  
  
  
  
  
  
  
  // EXPERTISE CARDS
	gsap.registerPlugin(ScrollTrigger, CustomEase);
  
	window.addEventListener("DOMContentLoaded", () => {
	  const root = document.querySelector('.mwg_effect018');
	  const pinHeight = root.querySelector('.pin-height');
	  const container = root.querySelector('.container');
	  const cards = root.querySelectorAll('.card');
  
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
		scrub: true
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
		  scrub: true
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
  
  
  
  
  
  
  
  
  
  // H2 TEXT STAGGER DESKTOP
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.header-tagline').forEach(tagline => {
    const heading = tagline.querySelector('.heading-style-h2.is--smaller');
    if (!heading) return;

    const chars = heading.textContent.trim().split('');

    heading.innerHTML = chars.map(char => {
      const safeChar = char === ' ' ? '&nbsp;' : char;
      return `<span class="char">${safeChar}</span>`;
    }).join('');

    const charSpans = heading.querySelectorAll('.char');

    gsap.fromTo(charSpans,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: tagline,
          toggleActions: "play none none none", // play once only
          once: true
        }
      }
    );
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
  
  
  
  
  
  
  
  // HOVER EXPERTISE SECTION
  CustomEase.create("osmo-ease", "0.625, 0.05, 0, 1");
  gsap.defaults({
	ease: "osmo-ease",
	duration: 0.725
  });
  document.addEventListener("DOMContentLoaded", () => {
	const listItems = document.querySelectorAll(".main-title-item");
	const imageItems = document.querySelectorAll(".main-img-item");
  
	// Show corresponding image on hover of a list item, based on index
	listItems.forEach((listItem, i) => {
	  listItem.addEventListener("mouseenter", () => {
		gsap.set(imageItems, { autoAlpha: 0 }); // Hide all images
		gsap.set(imageItems[i], { autoAlpha: 1 }); // Show image with matching index
	  });
	});
  });
  
  
  
  
  
  
  
  // PROJECT SPLIT-TEXT ANIMATION
  let windowWidth = window.outerWidth;
  $(".split-text").each(function (index) {
	let myText = $(this);
	let mySplitText;
	function createSplits() {
	  mySplitText = new SplitText(myText, {
		type: "chars,words,lines",
		charsClass: "split-chars",
		wordsClass: "split-words",
		linesClass: "split-lines"
	  });
	}
	createSplits();
	$(window).resize(function () {
		if (window.outerWidth !== windowWidth) {
		  mySplitText.revert();
			  location.reload();
	  }
	  windowWidth = window.outerWidth;
	});
  });
  gsap.registerPlugin(ScrollTrigger);
  function createTextAnimations() {
	// Line Animation
	$(".line-animation").each(function (index) {
	  let triggerElement = $(this);
	  let myText = $(this).find(".split-text");
	  let targetElement = $(this).find(".split-lines");
  
	  let tl = gsap.timeline({
		scrollTrigger: {
		  trigger: triggerElement,
		  // trigger element - viewport
		  start: "top bottom",
		  end: "bottom top",
		  toggleActions: "restart none none none"
		}
	  });
	  tl.from(targetElement, {
		duration: 0.5,
		y: "150%",
		rotationX: -90,
		opacity: 0,
		ease: "power1.inOut",
		stagger: {
		  amount: 0.4,
		  from: "0"
		}
	  });
	});
	// Word Animation
	$(".word-animation").each(function (index) {
	  let triggerElement = $(this);
	  let myText = $(this).find(".split-text");
	  let targetElement = $(this).find(".split-words");
  
	  let tl = gsap.timeline({
		scrollTrigger: {
		  trigger: triggerElement,
		  // trigger element - viewport
		  start: "top bottom",
		  end: "bottom top",
		  toggleActions: "restart none none none"
		}
	  });
	  tl.from(targetElement, {
		duration: 0.3,
		y: "80%",
		rotationX: -90,
		opacity: 0,
		ease: "power1.inOut",
		stagger: {
		  amount: 0.9,
		  from: "0"
		}
	  });
	});
	// Letter Animation
	$(".letter-animation").each(function (index) {
	  let triggerElement = $(this);
	  let myText = $(this).find(".split-text");
	  let targetElement = $(this).find(".split-chars");
  
	  let tl = gsap.timeline({
		scrollTrigger: {
		  trigger: triggerElement,
		  // trigger element - viewport
		  start: "top bottom",
		  end: "bottom top",
		  toggleActions: "restart none none none"
		}
	  });
	  tl.from(targetElement, {
		duration: 0.5,
		y: "60%",
		opacity: 0,
		rotationX: -90,
		ease: "power1.inOut",
		stagger: {
		  amount: 0.7,
		  from: "0"
		}
	  });
	});
  }
  createTextAnimations();
  
  
  
  
  
  
  
  
  
  
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
  
  
  
  
  
  
  
  // PIXEL HOVER ANIMATION
  document.addEventListener('DOMContentLoaded', function () {
	const animationStepDuration = 0.3; // Adjust this value to control the timing
	const gridSize = 7; // Number of pixels per row and column (adjustable)
  
	// Calculate pixel size dynamically
	const pixelSize = 100 / gridSize; // Calculate the size of each pixel as a percentage
  
	// Select all cards
	const cards = document.querySelectorAll('[data-pixelated-image-reveal]');
  
	// Detect if device is touch device
	const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
  
	// Loop through each card
	cards.forEach((card) => {
	  const pixelGrid = card.querySelector('[data-pixelated-image-reveal-grid]');
	  const activeCard = card.querySelector('[data-pixelated-image-reveal-active]');
  
	  // Remove any existing pixels with the class 'pixelated-image-card__pixel'
	  const existingPixels = pixelGrid.querySelectorAll('.pixelated-image-card__pixel');
	  existingPixels.forEach(pixel => pixel.remove());
  
	  // Create a grid of pixels dynamically based on the gridSize
	  for (let row = 0; row < gridSize; row++) {
		for (let col = 0; col < gridSize; col++) {
		  const pixel = document.createElement('div');
		  pixel.classList.add('pixelated-image-card__pixel');
		  pixel.style.width = `${pixelSize}%`; // Set the pixel width dynamically
		  pixel.style.height = `${pixelSize}%`; // Set the pixel height dynamically
		  pixel.style.left = `${col * pixelSize}%`; // Set the pixel's horizontal position
		  pixel.style.top = `${row * pixelSize}%`; // Set the pixel's vertical position
		  pixelGrid.appendChild(pixel);
		}
	  }
  
	  const pixels = pixelGrid.querySelectorAll('.pixelated-image-card__pixel');
	  const totalPixels = pixels.length;
	  const staggerDuration = animationStepDuration / totalPixels; // Calculate stagger duration dynamically
  
	  let isActive = false; // Variable to track if the card is active
	  let delayedCall;
  
	  const animatePixels = (activate) => {
		isActive = activate;
		gsap.killTweensOf(pixels); // Reset any ongoing animations
		if (delayedCall) {
		  delayedCall.kill();
		}
		gsap.set(pixels, { display: 'none' }); // Make all pixels invisible instantly
  
		// Show pixels randomly
		gsap.to(pixels, {
		  display: 'block',
		  duration: 0,
		  stagger: {
			each: staggerDuration,
			from: 'random'
		  }
		});
  
		// After animationStepDuration, show or hide the activeCard
		delayedCall = gsap.delayedCall(animationStepDuration, () => {
		  if (activate) {
			activeCard.style.display = 'block';
			// **Set pointer-events to none so clicks pass through activeCard**
			activeCard.style.pointerEvents = 'none';
		  } else {
			activeCard.style.display = 'none';
		  }
		});
  
		// Hide pixels randomly
		gsap.to(pixels, {
		  display: 'none',
		  duration: 0,
		  delay: animationStepDuration,
		  stagger: {
			each: staggerDuration,
			from: 'random'
		  }
		});
	  };
  
	  if (isTouchDevice) {
		// For touch devices, use click event
		card.addEventListener('click', () => {
		  animatePixels(!isActive);
		});
	  } else {
		// For non-touch devices, use mouseenter and mouseleave
		card.addEventListener('mouseenter', () => {
		  if (!isActive) {
			animatePixels(true);
		  }
		});
  
		card.addEventListener('mouseleave', () => {
		  if (isActive) {
			animatePixels(false);
		  }
		});
	  }
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
  
  
  
  
  
  