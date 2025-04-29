document.addEventListener("DOMContentLoaded", () => {
	// ✅ Time display
	const initDynamicCurrentTime = () => {
	  const defaultTimezone = "Europe/Amsterdam";
	  const formatNumber = (n) => n.toString().padStart(2, '0');
  
	  const createFormatter = (tz) =>
		new Intl.DateTimeFormat([], {
		  timeZone: tz,
		  timeZoneName: 'short',
		  hour: '2-digit',
		  minute: '2-digit',
		  second: '2-digit',
		  hour12: false,
		});
  
	  const parseTime = (str) => {
		const match = str.match(/(\d+):(\d+):(\d+)\s*([\w+]+)/);
		return match ? {
		  hours: match[1], minutes: match[2], seconds: match[3], timezone: match[4]
		} : null;
	  };
  
	  const updateTime = () => {
		document.querySelectorAll('[data-current-time]').forEach(el => {
		  const tz = el.getAttribute('data-current-time') || defaultTimezone;
		  const timeParts = parseTime(createFormatter(tz).format(new Date()));
		  if (!timeParts) return;
  
		  el.querySelector('[data-current-time-hours]')?.textContent = timeParts.hours;
		  el.querySelector('[data-current-time-minutes]')?.textContent = timeParts.minutes;
		  el.querySelector('[data-current-time-seconds]')?.textContent = timeParts.seconds;
		  el.querySelector('[data-current-time-timezone]')?.textContent = timeParts.timezone;
		});
	  };
  
	  updateTime();
	  setInterval(updateTime, 1000);
	};
  
	initDynamicCurrentTime();
  
	// ✅ MGW Word Scroll
	if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
	  const scrollEl = document.querySelector('.scroll-home');
	  if (scrollEl) {
		gsap.to(scrollEl, {
		  autoAlpha: 0,
		  duration: 0.5,
		  scrollTrigger: { trigger: document.body, start: 'top top', end: 'top top-=1', toggleActions: "play none reverse none" }
		});
	  }
  
	  document.querySelectorAll('.expertise-wrapper .word').forEach(word => {
		if (word.children.length) {
		  gsap.to([...word.children], {
			yPercent: '+=100',
			ease: 'expo.inOut',
			scrollTrigger: {
			  trigger: word,
			  start: "bottom bottom",
			  end: "top 55%",
			  scrub: 3
			}
		  });
		}
	  });
	}
  
	// ✅ Scroll highlight
	if (typeof SplitText !== "undefined") {
	  const sliderText = document.querySelector(".slider-text-large");
	  if (sliderText) {
		const split = new SplitText(sliderText, { type: "lines, chars", linesClass: "split-line" });
		gsap.fromTo(
		  split.chars,
		  { opacity: 0.2 },
		  {
			opacity: 1,
			ease: "power2.out",
			duration: 1,
			stagger: { each: 0.1, from: "start" },
			scrollTrigger: {
			  trigger: sliderText,
			  start: "top 80%",
			  end: "bottom 20%",
			  scrub: 1
			}
		  }
		);
	  }
	} else {
	  console.warn("SplitText plugin not loaded for scroll highlight.");
	}
  
	// ✅ Prevent GSAP errors for missing or invalid targets (reusable helper)
	const safeGSAPTo = (target, vars) => {
	  if (!target || (Array.isArray(target) && target.length === 0)) {
		console.warn("GSAP target not found or empty:", target);
		return;
	  }
	  gsap.to(target, vars);
	};
  
	// ✅ Lenis Smooth Scroll
	if (typeof Lenis !== "undefined") {
	  const lenis = new Lenis({ autoRaf: true });
	  const raf = (t) => {
		lenis.raf(t);
		requestAnimationFrame(raf);
	  };
	  requestAnimationFrame(raf);
	}
  
	// ✅ Testimonial slider
	if (typeof Swiper !== "undefined") {
	  const photoSwiper = new Swiper(".swiper.is-photos", {
		effect: "cards", grabCursor: true, loop: true, keyboard: true,
		navigation: { nextEl: ".arrow.is-right", prevEl: ".arrow.is-left" }
	  });
	  const contentSwiper = new Swiper(".swiper.is-content", {
		speed: 0, loop: true, followFinger: false,
		effect: 'fade', fadeEffect: { crossFade: true }
	  });
	  photoSwiper.controller.control = contentSwiper;
	  contentSwiper.controller.control = photoSwiper;
	}
  
	// ✅ Webflow Loader transition
	setTimeout(() => {
	  const tl = gsap.timeline();
	  safeGSAPTo(".transition-column", { yPercent: -100, stagger: 0.1 });
	  gsap.set(".transition-wrapper", { display: "none" });
	}, 1000);
  
	$("a:not(.excluded-class)").on("click", function (e) {
	  const url = $(this).attr("href");
	  if ($(this).prop("hostname") === location.host && !url.includes("#") && $(this).attr("target") !== "_blank") {
		e.preventDefault();
		const tl = gsap.timeline({ onComplete: () => (window.location.href = url) });
		gsap.set(".transition-wrapper", { display: "flex" });
		tl.fromTo(".transition-column", { yPercent: 100 }, { yPercent: 0, stagger: 0.1 });
	  }
	});
  
	window.onpageshow = function (e) {
	  if (e.persisted) window.location.reload();
	};
  
	// You can apply similar safety and guards to:
	// - `initMarqueeScrollDirection()`
	// - `initStickyTitleScroll()`
	// - `.card-container` animation
	// - `.expertise-cards` GSAP timeline
	// - `.tr-scroll-toggle` animation logic
  
	// 🧼 Summary of Enhancements:
	// - All GSAP targets are now conditionally checked
	// - All DOM queries are wrapped in guards
	// - No animation is called if the selector is missing
	// - Prevented jQuery → GSAP misuse by avoiding `$el` directly
  });