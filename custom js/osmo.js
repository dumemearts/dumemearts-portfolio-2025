gsap.registerPlugin(SplitText, CustomEase, ScrambleTextPlugin, Flip, Draggable, InertiaPlugin)

CustomEase.create("osmo-ease", "0.625, 0.05, 0, 1")

let lenis;
let staggerDefault = 0.075;
let durationDefault = 0.8;
let transitionOffset = 225;

gsap.defaults({
  ease: "osmo-ease",
  duration: durationDefault,
});

gsap.config({nullTargetWarn:false});

const vimeoPlayers = {};
let videoModalOpen = false;
let infoModalOpen = false;
let menuOpen = false;
let menuButton = document.querySelector(".menu-button")

let originalTextEl = document.querySelector("#reel-text")
let originalText;
if(originalTextEl){originalText = originalTextEl.innerText}

let isMobile = window.innerWidth < 480;
let isMobileLandscape = window.innerWidth < 768;
let isTablet = window.innerWidth < 992;

let targetProgress = 0;
let smoothingDuration = 0.3 
let awardStackEffect;
let awardsStackDuration = 1.75











function initLenis() {

  lenis = new Lenis({
    lerp: 0.12,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

function initLenisCheckScrollUpDown() {

  var lastScrollTop = 0;
  var threshold = 50;
  var thresholdTop = 50;

  var scrollHandler = function (e) {
    var nowScrollTop = e.targetScroll;

    if (Math.abs(lastScrollTop - nowScrollTop) >= threshold) {

      // Check Scroll Direction
      if (nowScrollTop > lastScrollTop) {
        document.body.setAttribute('data-scrolling-direction', 'down');
      } else {
        document.body.setAttribute('data-scrolling-direction', 'up');
      }
      lastScrollTop = nowScrollTop;

      // Check if Scroll Started
      if (nowScrollTop > thresholdTop) {
        document.body.setAttribute('data-scrolling-started', 'true');
      } else {
        document.body.setAttribute('data-scrolling-started', 'false');
      }
    }
  };

  function startCheckScroll() {
    lenis.on('scroll', scrollHandler);
  }

  function stopCheckScroll() {
    lenis.off('scroll', scrollHandler);
  }

  startCheckScroll();

  barba.hooks.beforeLeave(() => {
    stopCheckScroll(); 
    lastScrollTop = 0; 
  });

  barba.hooks.after(() => {
    startCheckScroll();
  });
}








function isTouchScreendevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
};








function initCurrentYear(next){
  const currentYear = new Date().getFullYear();
  const currentYearElements = next.querySelectorAll('[data-current-year]');
  if(currentYearElements.length > 0){
    currentYearElements.forEach(currentYearElement => {
      currentYearElement.textContent = currentYear;
    });   
  }
}










function initBarbaNavUpdate(data) {
  const updateItems = $(data.next.html).find('[data-barba-update]');
  
  $('[data-barba-update]').each(function (index) {
    const nextItem = $(updateItems[index]);

    if (nextItem.length) {
      // Update 'aria-current' attribute
      const newStatus = nextItem.attr('aria-current');

      if (newStatus !== undefined) {
        $(this).attr('aria-current', newStatus);
      } else {
        $(this).removeAttr('aria-current');
      }

      // Update class list
      const newClassList = nextItem.attr('class');
      $(this).attr('class', newClassList);
    }
  });
  
}












// SPLIT LINES
function initSplit(next) {
  next = next || document;
  let lineTargets = next.querySelectorAll('[data-split="lines"]');
  let letterTargets = next.querySelectorAll('[data-split="letters"]');
  let splitTextLines = null;
  let splitTextLetters = [];
  
  function splitText(next) {
    if (splitTextLines) {
      splitTextLines.revert();
    }
    splitTextLetters.forEach((instance) => {
      if (instance) instance.revert();
    });
    splitTextLetters = [];

    // Lines
    splitTextLines = new SplitText(lineTargets, {
      type: "lines",
      linesClass: "single-line"
    });

    splitTextLines.lines.forEach((line) => {
      let wrapper = document.createElement('div');
      wrapper.classList.add('single-line-wrap');
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    // Letters
    splitTextLetters = Array.from(letterTargets).map((target) => {
      if (target.hasAttribute("split-ran")) return;
      return new SplitText(target, {
        type: "words, chars",
        charsClass: "single-letter"
      });
    });

    splitTextLetters.forEach((instance) => {
      if (instance) {
        instance.elements[0].setAttribute("split-ran", "true");
        if (instance.elements[0].hasAttribute("data-letters-delay")) {
          instance.chars.forEach((letter, index) => {
            let delay = index / 150 + "s";
            letter.style.setProperty("transition-delay", delay);
          });
        }
      }
    });
  }

  // Workaround for splitting lines off screen – seems to work :)
  gsap.set(".modal-wrap", { display: 'block', autoAlpha: 0 });

  // Perform the initial split
  splitText(next);

  // After split, immediately reset position
  gsap.set(".modal-wrap", { display: 'none', autoAlpha: 1, clearProps: true });

  // Add a debounced resize event listener
  let resizeTimeout;
  let lastWidth = window.innerWidth;
  
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastWidth) return; // Ignore height-only resizes
  
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      lastWidth = window.innerWidth;
      splitText(next);
      initTextScroll(next);
      initLoad(next);
    }, 300);
  });
}












function initLoad(next) {
  let nav = document.querySelector(".nav-row")
  if(!nav)return
  let hero = next.querySelector(".section")
  let lines = hero.querySelectorAll(".single-line")
  let pWrap = hero.querySelector('[data-load-items="wrap-p"]')
  let buttonWrap = hero.querySelector('[data-load-items="wrap-buttons"]')
  let revealItems = next.querySelectorAll('[data-load-items="reveal"]')
  let pItems, buttons;
  
  if(pWrap){ pItems = pWrap.querySelectorAll("p") } 
  if(buttonWrap){ buttons = buttonWrap.querySelectorAll(".button") } 
  
  let tl = gsap.timeline({
    defaults: {
      ease: "osmo-ease",
      duration: 1.2
    },
    onComplete:()=>{
      ScrollTrigger.refresh()
    }
  })

  tl.set(hero, { autoAlpha: 1 }, 0.5)
    .to(lines, { y: 0, stagger: staggerDefault })
    .to(nav, { y: 0 }, "<")

  if(revealItems.length > 1){tl.from(revealItems, { yPercent: 20, autoAlpha:0, stagger: staggerDefault }, 0.3)  }
  if(pWrap){ tl.to(pItems, { y: 0, stagger: staggerDefault }, 0.3) }  
  if(buttonWrap){ tl.from(buttons, { autoAlpha: 0, duration: 0.6, stagger:staggerDefault }, 0.8) }    

}













function initTextScroll(next){
  let targets = next.querySelectorAll('[data-reveal="scroll"]')
  
  targets.forEach((target) => {
    lines = target.querySelectorAll(".single-line")
    gsap.to(lines,{
      y: 0,
      duration: durationDefault + 0.2,
      stagger: staggerDefault,
      scrollTrigger:{
        trigger: target,
        start:"top 90%",
        once: true
      }
    })
  })
}











function initModal() {
  let buttons = document.querySelectorAll("[data-modal-cta]")
  let modalWrap = document.querySelector(".modal-wrap")
  let bg = modalWrap.querySelector(".modal-bg")
  let sidebar = modalWrap.querySelector(".sidebar")
  let contents = sidebar.querySelectorAll('[data-modal]')
  let titleLines = sidebar.querySelectorAll(".sidebar-title .single-line")
  let closeTriggers = document.querySelectorAll("[data-modal-close]")
  let items = document.querySelectorAll(".faq-item")
  let revealItems = sidebar.querySelectorAll("[data-modal-reveal]")
  
  let animating = false;
  
  let openTimeline = gsap.timeline({ paused: true })
    .set(modalWrap, { display: "block" })
    .set(sidebar, { display: "flex" })
    .fromTo(bg, { opacity: 0 }, { opacity: 0.5 })
    .fromTo(sidebar, {
      yPercent: isMobileLandscape ? 110 : 0,
      xPercent: isMobileLandscape ? 0 : 110
    }, { xPercent: 0, yPercent: 0, duration: 1 }, "<")
    .fromTo(titleLines, { y: "120%" }, { y: "0%", stagger: 0.02 }, ">-=0.8")
    .fromTo([items, revealItems], { yPercent: 70, autoAlpha: 0 }, {
      yPercent: 0,
      autoAlpha: 1,
      stagger: 0.05
    }, "<+=0.3")

  let closeTimeline = gsap.timeline({
    paused: true,
    onStart: () =>{ animating = true; },
    onComplete: () =>{ animating = false},
  })
    .to(bg, { opacity: 0 })
    .to(titleLines, { y: "120%", stagger:{each: 0.03, from:"end"}, duration: 0.65 }, "<")
    .to([items, revealItems], { yPercent: 70, autoAlpha: 0, stagger: 0.03, duration: 0.65 }, "<")
    .to(sidebar, { xPercent: isMobileLandscape ? 0 : 110, yPercent: isMobileLandscape ? 110 : 0 },
      "<+=0.25")
    .set(modalWrap, { display: "none" });

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      let targetModal = button.getAttribute("data-modal-cta");

      contents.forEach(content => {
        content.style.display = "none";
      });

      let activeContent = sidebar.querySelector(`[data-modal="${targetModal}"]`);
      activeContent.style.display = "flex";

      infoModalOpen = true;
      openTimeline.play(0);
      
      if(targetModal === "founders"){
        awardStackEffect.play(0)
      }
      
    });
  });

  function closeModal() {
    items.forEach((item) => {
      let state = item.getAttribute('data-state')
      let link = item.querySelector(".faq-link")
      if (state === "open") {
        link.click()
      }
    })
    closeTimeline.play(0);
    infoModalOpen = false;
    //removeMouseControl();
    awardStackEffect.reverse()
  }

  closeTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      if(animating){return}
      closeModal()
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && infoModalOpen) {
      closeModal();
    }
  });

}












function initFaq(next) {
  let faqs = next.querySelectorAll(".faq-item");
    
    
  // Webflow workaround for CMS list  
  let buttons = next.querySelectorAll('[data-flip-button="button"]');
  buttons[0].classList.add("active");
  
  let background = document.createElement("div");
  background.classList.add("tab-button__bg");
  background.setAttribute("data-flip-button", "bg");
  buttons[0].appendChild(background);


  faqs.forEach(faq => {
    let link = faq.querySelector(".faq-link");
    let content = faq.querySelector(".faq-content");
    let lines = faq.querySelectorAll(".single-line")

    link.addEventListener("click", () => {
      faqs.forEach(otherFaq => {
        if (otherFaq !== faq && otherFaq.getAttribute("data-state") === "open") {
          let innerLink = otherFaq.querySelector(".faq-link");
          innerLink.click()
        }
      });

      if (faq.getAttribute("data-state") === "closed") {
        faq.setAttribute("data-state", "open");
        gsap.to(content, {
          height: "auto",
          onComplete:()=>{
            ScrollTrigger.refresh()
          }
        });
        gsap.fromTo(lines, { y: "120%" }, { y: "0%", stagger: 0.05, delay: 0.05 })
      } else {
        faq.setAttribute("data-state", "closed");
        gsap.to(content, {
          height: 0,
          duration: 0.65,
          onComplete:()=>{
            ScrollTrigger.refresh()
          }
        });
      }
    });
  });
  
  
  const rows = next.querySelectorAll("[data-faq-nav='row']");
  const links = next.querySelectorAll("[data-faq-nav='link']");
  const bg = next.querySelector('[data-flip-button="bg"]')    

  rows.forEach((row, index) => {
    ScrollTrigger.create({
      trigger: row,
      start: "top 30%", 
      onEnter: () => setActiveLink(index),
      onLeaveBack: () => setActiveLink(index - 1)
    });
  });
  
  function setActiveLink(activeIndex) {
    links.forEach((link, index) => {
      const parentButton = link.parentElement;
      if (index === activeIndex) {
        parentButton.classList.add("active");
        
        const state = Flip.getState(bg);
        parentButton.appendChild(bg);
        Flip.from(state, { duration: 0.4 });

      } else {
        parentButton.classList.remove("active");
      }
    });
  }

}












function setContainerHeight() {
  let vidContainer = document.querySelector(".cs-col-vid");
  if (vidContainer) {
    vidContainer.style.height = "auto";
    let height = vidContainer.offsetHeight;
    vidContainer.style.height = height + "px";
  }
}










function debounce(func, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };
}











function initVideoModal() {
  let trigger = document.querySelector("[data-video-open]")
  let closeTriggers = document.querySelectorAll("[data-video-close]")
  let modal = document.querySelector(".video-wrap")
  let video = modal.querySelector('[data-vimeo-player-target]')
  let bg = modal.querySelector(".bg")
  let vidBg = document.querySelector(".hero-vid-bg")
  let vidWrap = document.querySelector(".hero-vid-wrap")
  let vidModalWrap = document.querySelector(".video-player__wrap")
  let vidModalInner = vidModalWrap.querySelector(".video-player")
  let vimeoPlayer = vidModalWrap.querySelector(".single-vimeo-player")
  let videoColumn = document.querySelector(".home-hero-vid")
  let videoInfo = document.querySelector(".hero-vid-info")
  let eyebrow = videoInfo.querySelector(".eyebrow")
  let starWrap = videoColumn.querySelector(".home-vid-star")
  let starLines = starWrap.querySelectorAll("rect")

  setContainerHeight()
  window.addEventListener("resize", debounce(setContainerHeight, 150));

  let openTimeline = gsap.timeline({ paused: true })
    .set(modal, { display: "flex" })
    .set(vimeoPlayer, { opacity: 0 })
    .to(videoInfo, { autoAlpha: 0 })
    .to(starLines, { height: 0 }, "<")
    .fromTo(bg, { opacity: 0 }, { opacity: 0.75 }, "<")
    .to(vidWrap, { autoAlpha: 0, duration: 0.5 })
    .set(vimeoPlayer, { opacity: 1 }, "<")

  let closeTimeline = gsap.timeline({ paused: true })
    .to(bg, { opacity: 0 })
    .to(vimeoPlayer, { opacity: 0, duration: 0.25 }, "<")
    .to(vidWrap, { autoAlpha: 1 }, "<")
    .set(modal, { display: "none" })
    .to(videoInfo, { autoAlpha: 1, duration: 0.5 })
    .to(starLines, { height: "100%" }, "<+=0.25")
    .to(vidWrap, { autoAlpha: 1, duration: 0.001, overwrite: "auto", clearProps: true })

  trigger.addEventListener("click", () => {

    let bgState = Flip.getState(vidBg)
    let vidState = Flip.getState(vidWrap)

    openTimeline.play(0);
    videoModalOpen = true;

    vidModalWrap.appendChild(vidBg)
    vidModalInner.appendChild(vidWrap)

    gsap.delayedCall(0.001, () => {
      Flip.from(bgState, { duration: 1.2 })
      Flip.from(vidState, {
        duration: 1.2,
        onComplete: () => {
          if (!isTouchScreendevice()) {
            vimeoPlayerPlay(video, Object.values(vimeoPlayers)[0])
          }
        }
      })
    })
  });

  function closeVideoModal() {
    closeTimeline.play(0);
    let vimeoTarget = Object.values(vimeoPlayers)[0]
    vimeoPlayerPause(video, vimeoTarget);
    vimeoTarget.unload()

    let bgState = Flip.getState(vidBg);
    let vidState = Flip.getState(vidWrap);

    videoColumn.appendChild(vidBg);
    videoColumn.appendChild(vidWrap);

    gsap.delayedCall(0.001, () => {
      Flip.from(bgState, { duration: 0.9 });
      Flip.from(vidState, { duration: 0.9 });
    });

    videoModalOpen = false;
  }

  closeTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      closeVideoModal();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModalOpen) {
      closeVideoModal();
    }
  });

  videoColumn.addEventListener("mouseenter", () => {
    gsap.to(eyebrow, {
      scrambleText: {
        text: "play reel",
        chars: "lowercase",
        speed: 0.8
      }
    })
  })
  videoColumn.addEventListener("mouseleave", () => {
    gsap.to(eyebrow, {
      scrambleText: {
        text: originalText,
        chars: "lowercase"
      }
    })
  })
}













function initVideos() {
  let vids = document.querySelectorAll("[data-vimeo-player-target]");
  vids.forEach((vid, index) => {
    let videoIndexID = "vimeo-player-index-" + index;
    vid.id = videoIndexID;

    const player = new Vimeo.Player(vid);

    vimeoPlayers[videoIndexID] = player;

    player.on("play", () => {
      vid.setAttribute("data-vimeo-status-loaded", "true");
    });

    if (vid.getAttribute("data-vimeo-player-autoplay") === "false") {
      player.setVolume(1);
      player.pause();
    } else {
      player.setVolume(0);
      vid.setAttribute("data-vimeo-status-muted", "true");
      if (vid.getAttribute("data-vimeo-status-paused-by-user") === "false") {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: vid,
            start: "0% 100%",
            end: "100% 0%",
            toggleActions: "play none none none",
            markers: false,
            onEnter: () => vimeoPlayerPlay(vid, player),
            onLeave: () => vimeoPlayerPause(vid, player),
            onEnterBack: () => vimeoPlayerPlay(vid, player),
            onLeaveBack: () => vimeoPlayerPause(vid, player),
          },
        });
      }
    }

    // Control event bindings
    vid.querySelectorAll('[data-vimeo-control="play"]').forEach((button) => {
      button.addEventListener("click", () => {
        if (vid.getAttribute("data-vimeo-status-muted") === "true") {
          player.setVolume(0);
        } else {
          player.setVolume(1);
        }
        vimeoPlayerPlay(vid, player);
      });
    });

    vid.querySelectorAll('[data-vimeo-control="pause"]').forEach((button) => {
      button.addEventListener("click", () => {
        vimeoPlayerPause(vid, player);
        if (vid.getAttribute("data-vimeo-player-autoplay") === "true") {
          vid.setAttribute("data-vimeo-status-paused-by-user", "true");
          if (tl) tl.kill();
        }
      });
    });

    // Duration and timeline updates
    player.getDuration().then((duration) => {
      const formatDuration = secondsTimeSpanToHMS(duration);
      const vimeoDuration = vid.querySelector(".vimeo-duration .duration");
      if (vimeoDuration) {
        vimeoDuration.textContent = formatDuration;
      }
      vid
        .querySelectorAll('[data-vimeo-control="timeline"], progress')
        .forEach((element) => {
          element.max = duration;
        });
    });

    // Timeline
    vid
      .querySelectorAll('[data-vimeo-control="timeline"]')
      .forEach((timeline) => {
        timeline.addEventListener("input", function () {
          player.setCurrentTime(parseFloat(timeline.value));
          const progress = vid.querySelector("progress");
          if (progress) {
            progress.value = timeline.value;
          }
        });
      });

    // Progress Time & Timeline
    player.on("timeupdate", function (data) {
      const timeUpdate = secondsTimeSpanToHMS(Math.trunc(data.seconds));
      const vimeoTime = vid.querySelector(".vimeo-duration .time");
      if (vimeoTime) {
        vimeoTime.textContent = timeUpdate;
      }
      vid
        .querySelectorAll('[data-vimeo-control="timeline"], progress')
        .forEach((element) => {
          element.value = data.seconds;
        });
    });

    // Remove Controls after hover
    let vimeoHoverTimer;
    document.addEventListener("mousemove", function () {
      clearTimeout(vimeoHoverTimer);
      vid.setAttribute("data-vimeo-status-hover", "true");
      vimeoHoverTimer = setTimeout(() => {
        vid.setAttribute("data-vimeo-status-hover", "false");
      }, 3000);
    });

    // Time update handling
    player.on("timeupdate", (data) => {
      const formattedTime = secondsTimeSpanToHMS(Math.trunc(data.seconds));
      const vimeoTime = vid.querySelector(".vimeo-duration .time");
      if (vimeoTime) {
        vimeoTime.textContent = formattedTime;
      }
      vid
        .querySelectorAll('[data-vimeo-control="timeline"], progress')
        .forEach((element) => {
          element.value = data.seconds;
        });
    });

    // Listen for ended event
    player.on("ended", () => {
      let endTrigger = document.querySelector("[data-video-close]")
      vid.setAttribute("data-vimeo-status-activated", "false");
      vid.setAttribute("data-vimeo-status-play", "false");
      player.unload();
      endTrigger.click()
    });
  });
}

function vimeoPlayerPlay(vid, player) {
  vid.setAttribute("data-vimeo-status-activated", "true");
  vid.setAttribute("data-vimeo-status-play", "true");
  player.play();
}

function vimeoPlayerPause(vid, player) {
  vid.setAttribute("data-vimeo-status-play", "false");
  player.pause();
}

function secondsTimeSpanToHMS(s) {
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  return m + ":" + (s < 10 ? "0" + s : s);
}










function initParallax(next) {
  const triggers = next.querySelectorAll('[data-parallax="trigger"]');

  triggers.forEach((trigger) => {
    const direction = trigger.getAttribute('data-parallax-direction') || 'vertical';
    const scrubValue = parseFloat(trigger.getAttribute('data-parallax-scrub')) || true;
    const startValue = parseFloat(trigger.getAttribute('data-parallax-start')) || -5;
    const endValue = parseFloat(trigger.getAttribute('data-parallax-end')) || 20;
    const scrollStart = trigger.getAttribute('data-parallax-scroll-start') || 'top bottom';
    const scrollEnd = trigger.getAttribute('data-parallax-scroll-end') || 'bottom top';
    const target = trigger.querySelector('[data-parallax="target"]') || trigger;
    const property = direction === 'horizontal' ? 'xPercent' : 'yPercent';

    gsap.fromTo(
      target,
      { [property]: startValue },
      {
        [property]: endValue,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          start: scrollStart,
          end: scrollEnd,
          scrub: scrubValue,
        },
      }
    );
  });
}

function initPricingCards(next){
  let toggleCard = next.querySelector('[data-price="card-main"]')
  let sub = toggleCard.querySelector('[data-price="sub"]')
  let note = toggleCard.querySelector('[data-price="note"]')
  let price = toggleCard.querySelectorAll('[data-price="h"]')
  let buttons = toggleCard.querySelectorAll('[data-price="button"]')
  let subscriptionButton = toggleCard.querySelector("[data-subscription-button]")
  let state = "quarter";
  
  let originalSub = sub.textContent;
  let originalNote = note.textContent;
  
  let annualSub = sub.getAttribute("data-alt-text")
  let annualNote = note.getAttribute("data-alt-text")
  
  let tl = gsap.timeline();
  
  const toAnnual = () =>{
    tl.clear()
    state = "annual"
    
    buttons[0].classList.remove("active")
    buttons[1].classList.add("active")
    toggleCard.classList.add("active")
    
    let currentHref = subscriptionButton.getAttribute("href");
    let newHref = currentHref.includes("?") ? currentHref.split("?")[0] : currentHref;
    subscriptionButton.setAttribute("href", `${newHref}?type=annual`);
    
    tl.fromTo(price,{yPercent:0},{yPercent:-100})
    .to(sub,{ scrambleText:{ text: annualSub, speed: 0.75 }, duration: 1},"<")
    .to(note,{ scrambleText:{ text: annualNote, speed: 0.75 }, duration: 1},"<")
      
  }
  
  const toQuarter = () =>{
    tl.clear()
    state = "quarter"
    
    buttons[1].classList.remove("active")
    buttons[0].classList.add("active")
    toggleCard.classList.remove("active")
    
    let currentHref = subscriptionButton.getAttribute("href");
    let newHref = currentHref.includes("?") ? currentHref.split("?")[0] : currentHref;
    subscriptionButton.setAttribute("href", newHref);

    tl.to(price,{yPercent:0})
    .to(sub,{ scrambleText:{ text: originalSub, speed: 0.75 }, duration: 1},"<")
    .to(note,{ scrambleText:{ text: originalNote, speed: 0.75 }, duration: 1},"<")
      
  }  
  
  buttons.forEach((button) => {
    button.addEventListener("click", () =>{
      let type = button.getAttribute("data-price-state")
      if(type === "annual" && type != state){
        toAnnual();
      } else{
        toQuarter();
      }
    })
  })
  
  //
  //
  // Lifetime overlay:
  let lifetimeCard = next.querySelector('[data-price="card-life"]')
  let overlayTriggers = lifetimeCard.querySelectorAll('[data-price-overlay="trigger"]')
  let cardDefault = lifetimeCard.querySelector('[data-price-overlay="main"]')
  let cardOverlay = lifetimeCard.querySelector('[data-price-overlay="overlay"]')
  let overlayLines = cardOverlay.querySelectorAll(".single-line")
  let isOpen = false;
  
  let overlayTl = gsap.timeline();
  
  const toOverlay = () => {
    isOpen = true;
    lifetimeCard.setAttribute("data-card-state", "overlay")
    
    overlayTl.clear();
    
    overlayTl.to(cardDefault,{autoAlpha:0,duration:0.5})
    .set(cardOverlay,{autoAlpha: 1},0.1)
    .fromTo(overlayLines,{y:"120%"},{y:"0%",stagger:0.03,overwrite:"auto"},"<+=0.1")
    
  }
  
  const toDefault = () => {
    isOpen = false;
    lifetimeCard.setAttribute("data-card-state", "default")
    
    overlayTl.clear();
    
    overlayTl
    .to(overlayLines,{y:"120%", overwrite:"auto", stagger:{each:0.01, from:"end"} })
    .to(cardDefault,{autoAlpha:1,duration:0.5},'<+=0.5')
    .set(cardOverlay,{autoAlpha: 0})
    
  }  
  
  overlayTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () =>{
      if(isOpen){
        toDefault();
      } else{
        toOverlay();
      }
    })
  })
  
}

function initFooterLogo(next){
  let logo = next.querySelector(".footer-logo")
  if(!logo)return
  let letters = logo.querySelectorAll(".footer-logo-letter")
  let icon = logo.querySelector("#footer-icon")  
  
  gsap.set([icon, letters],{transformOrigin:"center center"})
  
  let tl = gsap.timeline({
    defaults:{
      //ease:"power3.out",
      duration: 1
    },
    scrollTrigger:{
      trigger:logo,
      start: "40% bottom",
      once:true,
    }
  })
  
  tl.from(icon,{
    autoAlpha:0,
    rotate: -90,
    duration:1.3
  }).from(letters,{
    x:"5em",
    autoAlpha:0,
    stagger:0.1
  },"<")
  
}

function initMobileMenu(){
  let menu = document.querySelector(".nav-menu")
  if(!menu) return
  let navFadeTargets = document.querySelectorAll("[data-nav-button]")
  let menuFadeTargets = menu.querySelectorAll("[data-menu-reveal]")
  let menuBg = document.querySelector(".menu-bg")
  
  let tl = gsap.timeline()
  
  const openMenu = () =>{
    menuOpen = true;
    menuButton.classList.add("close")
    document.body.setAttribute("data-nav-status", "open")
    
    tl.clear()
    .set([menu, menuBg],{display:"block"})
    .fromTo(menuBg,{autoAlpha:0},{autoAlpha:1})
    .fromTo(navFadeTargets,{autoAlpha:1,y:"0em"},{autoAlpha:0, y:"-3em", stagger: 0.01},"<")
    .fromTo(menu,{yPercent:-120},{yPercent:0},"<+=0.2")
    .fromTo(menuFadeTargets,{autoAlpha:0, yPercent:50},{autoAlpha:1, yPercent:0,stagger:0.05},"<+=0.25")
  }
  
  const closeMenu = () =>{
    menuOpen = false;
    menuButton.classList.remove("close")
    document.body.setAttribute("data-nav-status", "closed")
    
    tl.clear()
    .to(menu,{yPercent:-120})
    .to(menuBg,{autoAlpha:0},"<")
    .to(navFadeTargets,{autoAlpha:1,y:"0em",stagger: {each: 0.05, from:"end"}},"<+=0.2")
    .set(menu,{display:"none"})
  }
  
  menuButton.addEventListener("click", () => {
    menuOpen ? closeMenu() : openMenu();
  })
  
  menuBg.addEventListener("click", () => {
    closeMenu()
  })
  
}
initMobileMenu()

function initBasicFormValidation(next) {
  let forms = next.querySelectorAll('[data-form-validate]');
  forms.forEach((form) => {
    const fields = form.querySelectorAll('[data-validate] input, [data-validate] textarea');
    const submitButtonDiv = form.querySelector('[data-submit]'); // The div wrapping the submit button
    const submitInput = submitButtonDiv.querySelector('input[type="submit"]'); // The actual submit button

    // Capture the form load time
    const formLoadTime = new Date().getTime(); // Timestamp when the form was loaded

    // Function to validate individual fields (input or textarea)
    const validateField = (field) => {
      const parent = field.closest('[data-validate]'); // Get the parent div
      const minLength = field.getAttribute('min');
      const maxLength = field.getAttribute('max');
      const type = field.getAttribute('type');
      let isValid = true;

      // Check if the field has content
      if (field.value.trim() !== '') {
        parent.classList.add('is--filled');
      } else {
        parent.classList.remove('is--filled');
      }

      // Validation logic for min and max length
      if (minLength && field.value.length < minLength) {
        isValid = false;
      }

      if (maxLength && field.value.length > maxLength) {
        isValid = false;
      }

      // Validation logic for email input type
      if (type === 'email' && !/\S+@\S+\.\S+/.test(field.value)) {
        isValid = false;
      }

      // Add or remove success/error classes on the parent div
      if (isValid) {
        parent.classList.remove('is--error');
        parent.classList.add('is--success');
      } else {
        parent.classList.remove('is--success');
        parent.classList.add('is--error');
      }

      return isValid;
    };

    // Function to start live validation for a field
    const startLiveValidation = (field) => {
      field.addEventListener('input', function () {
        validateField(field);
      });
    };

    // Function to validate and start live validation for all fields, focusing on the first field with an error
    const validateAndStartLiveValidationForAll = () => {
      let allValid = true;
      let firstInvalidField = null;

      fields.forEach((field) => {
        const valid = validateField(field);
        if (!valid && !firstInvalidField) {
          firstInvalidField = field; // Track the first invalid field
        }
        if (!valid) {
          allValid = false;
        }
        startLiveValidation(field); // Start live validation for all fields
      });

      // If there is an invalid field, focus on the first one
      if (firstInvalidField) {
        firstInvalidField.focus();
      }

      return allValid;
    };

    // Anti-spam: Check if form was filled too quickly
    const isSpam = () => {
      const currentTime = new Date().getTime();
      const timeDifference = (currentTime - formLoadTime) / 1000; // Convert milliseconds to seconds
      return timeDifference < 5; // Return true if form is filled within 5 seconds
    };

    // Handle clicking the custom submit button
    submitButtonDiv.addEventListener('click', function () {
      // Validate the form first
      if (validateAndStartLiveValidationForAll()) {
        // Only check for spam after all fields are valid
        if (isSpam()) {
          alert('Form submitted too quickly. Please try again.');
          return; // Stop form submission
        }
        submitInput.click(); // Simulate a click on the <input type="submit">
      }
    });

    // Handle pressing the "Enter" key
    form.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default form submission

        // Validate the form first
        if (validateAndStartLiveValidationForAll()) {
          // Only check for spam after all fields are valid
          if (isSpam()) {
            alert('Form submitted too quickly. Please try again.');
            return; // Stop form submission
          }
          submitInput.click(); // Trigger our custom form submission
        }
      }
    });
  });
}

//
//
// Home specific functions:
//
//

function initHomeDashboard(next){
  let container = next.querySelector(".db-container")
  let wrap = container.querySelector(".db-wrapper")
  let search = wrap.querySelector(".db-search")
  let side = wrap.querySelector(".db-side")
  let cards = wrap.querySelectorAll(".db-content__card")
  let contents = wrap.querySelectorAll("[data-db-el]")
  
  let triggers = wrap.querySelectorAll("[data-db-note-trigger]");
  let notification = wrap.querySelector('[data-notification="home-db"]');
  let notificationTimer = null;
  
  gsap.set(contents,{autoAlpha:0})
  gsap.set(container,{pointerEvents:"none"})
  
  let scrollIntroTl = gsap.timeline({
    scrollTrigger:{
      trigger:container,
      start:"top bottom",
      end:"bottom bottom+=15%",
      scrub: true,
      //markers:true
    },
    defaults:{
      ease:"none"
    },
    onComplete: () =>{
      endTl.play(0)
    }
  })
  
  scrollIntroTl.from(wrap,{ rotateX:"20deg", z:"-20em" })
  .from(search,{z:"40em", autoAlpha: 0},"<")
  .from(side,{z:"35em", autoAlpha: 0},"<")
  .from(cards, {
    z: (i) => `${35 - i * 5}em`, 
    stagger: 0.01
  }, "<")
  .to(contents,{autoAlpha:0,duration:0.01},0)
  .set(container,{pointerEvents:"none"})
  

  let endTl = gsap.timeline({
    paused: true,
    defaults:{
      duration: 0.8,
    },
    onComplete:()=>{
      gsap.set(container,{pointerEvents:"auto"})
    }
  })
  
  endTl.to([side,search,cards],{
    z:"4em",
    borderColor:"rgba(239, 238, 236, 0.65)",
    boxShadow:"0 2px 40px 0 hsla(10.95890410958904, 100.00%, 57.06%, 0.25)",
    stagger: 0.1,
    ease:"power1.inOut",
    duration:0.35
  })
  .to([side,search,cards],{
    z: "0em",
    borderColor:"rgba(239, 238, 236, 0.08)",
    boxShadow:"0 0px 00px 0 hsla(10.95890410958904, 100.00%, 57.06%, 0)", 
    stagger:staggerDefault,
    ease:"power3.out"
  }, 0.35)
  .to(contents,{
    autoAlpha:1,
    stagger:0.03,
    duration: 0.5
  },"<")
  
  // Interactive Stuff:
  function activateNotification() {
    notification.setAttribute("data-notification-status", "active");
  
    if (notificationTimer) {
      clearTimeout(notificationTimer);
    }
  
    notificationTimer = setTimeout(() => {
      notification.setAttribute("data-notification-status", "not-active");
      notificationTimer = null; // Reset timer reference
    }, 2000);
  }
  
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", activateNotification);
  });
  
  document.addEventListener("keydown", (e) => {
    const tagName = e.target.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea' || e.target.isContentEditable) {
      return; 
    }
  
    // Check for Command + K (macOS) or Ctrl + K (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && (e.key === 'e' || e.key === 'k')) {
      e.preventDefault();
      activateNotification();
    }
  });
  
}

function initPlayVideoHover(next) {
  let videoWrappers = next.querySelectorAll('[data-video-on-hover]')
  videoWrappers.forEach((video) => {
    let videoSRC = video.getAttribute('data-video-src');
    let videoElement = video.querySelector('video');

    if (videoSRC !== '') {
      video.addEventListener('mouseenter', () => {
        if (videoElement.getAttribute('src') === '') {
          videoElement.setAttribute('src', videoSRC);
        }
        video.setAttribute('data-video-on-hover', 'active');
        videoElement.play();
      });

      video.addEventListener('mouseleave', () => {
        video.setAttribute('data-video-on-hover', 'not-active');
        setTimeout(() => {
          videoElement.pause();
          videoElement.currentTime = 0;
        }, 200);
      });
    }
  });
}

function initSliders(next) {
  const sliderLists = gsap.utils.toArray(next.querySelectorAll('[data-slider="list"]'));

  sliderLists.forEach((wrapper) => {
    const slides = gsap.utils.toArray(wrapper.querySelectorAll('[data-slider="slide"]'));
    const section = wrapper.closest(".section");
    const thumbs = section ? gsap.utils.toArray(section.querySelectorAll('[data-slider="button"]')) : [];
    
    let activeElement;
    let activeThumb;
    let autoplay;

    const loop = horizontalLoop(slides, {
      paused: true,
      draggable: true,
      center: true,
      onChange: (element, index) => {
        activeElement && activeElement.classList.remove("active");
        element.classList.add("active");
        activeElement = element;

        if (thumbs.length > 0) {
          activeThumb && activeThumb.classList.remove("active");
          thumbs[index].classList.add("active");
          activeThumb = thumbs[index];
        }
      }
    });

    // Preload index 3 for both sliders
    loop.toIndex(3, { ease: "linear", duration: 0.1 });

    ScrollTrigger.create({
      trigger: wrapper,
      start: "top 75%",
      once: true,
      onEnter: () => {
        loop.toIndex(4, { ease: "osmo-ease", duration: 0.725 });
      }
    });

    function startAutoplay() {
      if (!autoplay) {
        autoplay = gsap.delayedCall(4, autoplayNext);
      }
    }

    function stopAutoplay() {
      autoplay && autoplay.kill();
      autoplay = null;
    }

    function autoplayNext() {
      loop.next({ ease: "osmo-ease", duration: 0.725 });
      autoplay = gsap.delayedCall(4, autoplayNext);
    }

    ScrollTrigger.create({
      trigger: wrapper,
      start: "top bottom",
      end: "bottom top",
      onEnter: startAutoplay,
      onLeave: stopAutoplay,
      onEnterBack: startAutoplay,
      onLeaveBack: stopAutoplay
    });

    [wrapper].forEach((element) => {
      if (element) {
        element.addEventListener("mouseenter", stopAutoplay);
        element.addEventListener("mouseleave", () => {
          if (ScrollTrigger.isInViewport(wrapper)) startAutoplay();
        });
      }
    });

    slides.forEach((slide, i) =>
      slide.addEventListener("click", () =>
        loop.toIndex(i, { ease: "osmo-ease", duration: 0.725 })
      )
    );

    if (thumbs.length > 0) {
      thumbs.forEach((thumb, i) => {
        thumb.addEventListener("click", () => {
          loop.toIndex(i, { ease: "osmo-ease", duration: 0.725 });

          activeThumb && activeThumb.classList.remove("active");
          thumb.classList.add("active");
          activeThumb = thumb;
        });
      });
    }
  });
}

function horizontalLoop(items, config) {
  let timeline;
  items = gsap.utils.toArray(items);
  config = config || {};
  gsap.context(() => { 
    let onChange = config.onChange,
      lastIndex = 0,
      tl = gsap.timeline({repeat: config.repeat, onUpdate: onChange && function() {
          let i = tl.closestIndex();
          if (lastIndex !== i) {
            lastIndex = i;
            onChange(items[i], i);
          }
        }, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
      length = items.length,
      startX = items[0].offsetLeft,
      times = [],
      widths = [],
      spaceBefore = [],
      xPercents = [],
      curIndex = 0,
      indexIsDirty = false,
      center = config.center,
      pixelsPerSecond = (config.speed || 1) * 100,
      snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1),
      timeOffset = 0,
      container = center === true ? items[0].parentNode : gsap.utils.toArray(center)[0] || items[0].parentNode,
      totalWidth,
      getTotalWidth = () => items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + spaceBefore[0] + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0),
      populateWidths = () => {
        let b1 = container.getBoundingClientRect(), b2;
        items.forEach((el, i) => {
          widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
          xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / widths[i] * 100 + gsap.getProperty(el, "xPercent"));
          b2 = el.getBoundingClientRect();
          spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
          b1 = b2;
        });
        gsap.set(items, {
          xPercent: i => xPercents[i]
        });
        totalWidth = getTotalWidth();
      },
      timeWrap,
      populateOffsets = () => {
        timeOffset = center ? tl.duration() * (container.offsetWidth / 2) / totalWidth : 0;
        center && times.forEach((t, i) => {
          times[i] = timeWrap(tl.labels["label" + i] + tl.duration() * widths[i] / 2 / totalWidth - timeOffset);
        });
      },
      getClosest = (values, value, wrap) => {
        let i = values.length,
          closest = 1e10,
          index = 0, d;
        while (i--) {
          d = Math.abs(values[i] - value);
          if (d > wrap / 2) {
            d = wrap - d;
          }
          if (d < closest) {
            closest = d;
            index = i;
          }
        }
        return index;
      },
      populateTimeline = () => {
        let i, item, curX, distanceToStart, distanceToLoop;
        tl.clear();
        for (i = 0; i < length; i++) {
          item = items[i];
          curX = xPercents[i] / 100 * widths[i];
          distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
          distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
          tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
            .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
            .add("label" + i, distanceToStart / pixelsPerSecond);
          times[i] = distanceToStart / pixelsPerSecond;
        }
        timeWrap = gsap.utils.wrap(0, tl.duration());
      },
      refresh = (deep) => {
        let progress = tl.progress();
        tl.progress(0, true);
        populateWidths();
        deep && populateTimeline();
        populateOffsets();
        deep && tl.draggable ? tl.time(times[curIndex], true) : tl.progress(progress, true);
      },
      onResize = () => refresh(true),
      proxy;
    gsap.set(items, {x: 0});
    populateWidths();
    populateTimeline();
    populateOffsets();
    window.addEventListener("resize", onResize);
    function toIndex(index, vars) {
      vars = vars || {};
      (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
      let newIndex = gsap.utils.wrap(0, length, index),
        time = times[newIndex];
      if (time > tl.time() !== index > curIndex && index !== curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
        time += tl.duration() * (index > curIndex ? 1 : -1);
      }
      if (time < 0 || time > tl.duration()) {
        vars.modifiers = {time: timeWrap};
      }
      curIndex = newIndex;
      vars.overwrite = true;
      gsap.killTweensOf(proxy);    
      return vars.duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars);
    }
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.closestIndex = setCurrent => {
      let index = getClosest(times, tl.time(), tl.duration());
      if (setCurrent) {
        curIndex = index;
        indexIsDirty = false;
      }
      return index;
    };
    tl.current = () => indexIsDirty ? tl.closestIndex(true) : curIndex;
    tl.next = vars => toIndex(tl.current()+1, vars);
    tl.previous = vars => toIndex(tl.current()-1, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true); // pre-render for performance
    if (config.reversed) {
      tl.vars.onReverseComplete();
      tl.reverse();
    }
    if (config.draggable && typeof(Draggable) === "function") {
      proxy = document.createElement("div")
      let wrap = gsap.utils.wrap(0, 1),
        ratio, startProgress, draggable, dragSnap, lastSnap, initChangeX, wasPlaying,
        align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio)),
        syncIndex = () => tl.closestIndex(true);
      typeof(InertiaPlugin) === "undefined" && console.warn("InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club");
      draggable = Draggable.create(proxy, {
        trigger: items[0].parentNode,
        type: "x",
        onPressInit() {
          let x = this.x;
          gsap.killTweensOf(tl);
          wasPlaying = !tl.paused();
          tl.pause();
          startProgress = tl.progress();
          refresh();
          ratio = 1 / totalWidth;
          initChangeX = (startProgress / -ratio) - x;
          gsap.set(proxy, {x: startProgress / -ratio});
        },
        onDrag: align,
        onThrowUpdate: align,
        overshootTolerance: 0,
        inertia: true,
        snap(value) {
          if (Math.abs(startProgress / -ratio - this.x) < 10) {
            return lastSnap + initChangeX
          }
          let time = -(value * ratio) * tl.duration(),
            wrappedTime = timeWrap(time),
            snapTime = times[getClosest(times, wrappedTime, tl.duration())],
            dif = snapTime - wrappedTime;
          Math.abs(dif) > tl.duration() / 2 && (dif += dif < 0 ? tl.duration() : -tl.duration());
          lastSnap = (time + dif) / tl.duration() / -ratio;
          return lastSnap;
        },
        onRelease() {
          syncIndex();
          draggable.isThrowing && (indexIsDirty = true);
        },
        onThrowComplete: () => {
          syncIndex();
          wasPlaying && tl.play();
        }
      })[0];
      tl.draggable = draggable;
    }
    tl.closestIndex(true);
    lastIndex = curIndex;
    onChange && onChange(items[curIndex], curIndex);
    timeline = tl;
    return () => window.removeEventListener("resize", onResize); 
  });
  return timeline;
  
}

function initFlipButtons(next) {
  let wrappers = next.querySelectorAll('[data-flip-button="wrap"]');
  
  wrappers.forEach((wrapper) => {
    let buttons = wrapper.querySelectorAll('[data-flip-button="button"]');
    let bg = wrapper.querySelector('[data-flip-button="bg"]');
    
    buttons.forEach(function (button) {
      // Handle mouse enter
      button.addEventListener("mouseenter", function () {
        const state = Flip.getState(bg);
        this.appendChild(bg);
        Flip.from(state, {
          duration: 0.4,
        });
      });

      // Handle focus for keyboard navigation
      button.addEventListener("focus", function () {
        const state = Flip.getState(bg);
        this.appendChild(bg);
        Flip.from(state, {
          duration: 0.4,
        });
      });

      // Handle mouse leave
      button.addEventListener("mouseleave", function () {
        const state = Flip.getState(bg);
        const activeLink = wrapper.querySelector(".active");
        activeLink.appendChild(bg);
        Flip.from(state, {
          duration: 0.4,
        });
      });

      // Handle blur to reset background for keyboard navigation
      button.addEventListener("blur", function () {
        const state = Flip.getState(bg);
        const activeLink = wrapper.querySelector(".active");
        activeLink.appendChild(bg);
        Flip.from(state, {
          duration: 0.4,
        });
      });
    });
  });
}

function initTabSystem(next){
  let wrappers = next.querySelectorAll('[data-tabs="wrapper"]')
  
  wrappers.forEach((wrapper) => {
    let nav = wrapper.querySelector('[data-tabs="nav"]')
    let buttons = nav.querySelectorAll('[data-tabs="button"]')
    let contentWrap = wrapper.querySelector('[data-tabs="content-wrap"]')
    let contentItems = contentWrap.querySelectorAll('[data-tabs="content-item"]')
    let visualWrap = wrapper.querySelector('[data-tabs="visual-wrap"]')
    let visualItems = visualWrap.querySelectorAll('[data-tabs="visual-item"]')

    let activeButton = buttons[0];
    let activeContent = contentItems[0];
    let activeVisual = visualItems[0];
    let isAnimating = false;
    
    ScrollTrigger.create({
      trigger: wrapper,
      start: 'top-=50% bottom',
      onEnter: () => {
        let first = visualItems[0]
        if (first && first.dataset.tabsContent === 'video') {
          let vid = first.querySelector('video')
          if (vid) {
            if (!vid.src && vid.dataset.src) {
              vid.src = vid.dataset.src
              vid.load()
            }
            vid.play()
          }
        }
      }
    })

    function switchTab(index, initial = false) {
      if (!initial && (isAnimating || buttons[index] === activeButton)) return;
      isAnimating = true;

      const outgoingContent = activeContent;
      const incomingContent = contentItems[index];
      const outgoingVisual = activeVisual;
      const incomingVisual = visualItems[index];

      let outgoingLines = outgoingContent.querySelectorAll(".single-line") || [];
      let incomingLines = incomingContent.querySelectorAll(".single-line");

      const timeline = gsap.timeline({
        defaults: { duration: 0.5, ease: "power2.inOut" },
        onComplete: () => {
          if(!initial){
            outgoingContent && outgoingContent.classList.remove("active");
            outgoingVisual && outgoingVisual.classList.remove("active");            
          }
          activeContent = incomingContent;
          activeVisual = incomingVisual;
          isAnimating = false;
        },
      });

      incomingContent.classList.add("active");
      incomingVisual.classList.add("active");

      timeline
        .to(outgoingLines, { y: "-120%", stagger: 0.01 }, 0)
        .to(outgoingVisual, { autoAlpha: 0, xPercent: 3 }, 0)
        .fromTo(incomingLines, { y: "120%" }, { y: "0%", stagger: 0.075 }, 0.3)
        .fromTo(incomingVisual, { autoAlpha: 0, xPercent: 3 }, { autoAlpha: 1, xPercent: 0 }, "<");
        
      // pause any outgoing vid and play potential incoming one  
      let outgoingVideo = outgoingVisual.querySelector('video')
      if (outgoingVideo && !outgoingVideo.paused) outgoingVideo.pause()
      let incomingVideo = incomingVisual.querySelector('video')
      if (incomingVideo && incomingVisual.dataset.tabsContent === 'video') {
        if (!incomingVideo.src && incomingVideo.dataset.src) {
          incomingVideo.src = incomingVideo.dataset.src
          incomingVideo.load()
        }
        incomingVideo.play()
      }        

      activeButton && activeButton.classList.remove("active");
      buttons[index].classList.add("active");
      activeButton = buttons[index];
    }

    switchTab(0, true); // on page load
 
    buttons.forEach((button, i) => {
      button.addEventListener("click", () => switchTab(i));
    });

    contentItems[0].classList.add("active");
    visualItems[0].classList.add("active");
    buttons[0].classList.add("active");    
    
    
  })
  
  let easterEggTrigger = next.querySelector("[data-easteregg]")
  if(easterEggTrigger){
    let wrap = easterEggTrigger.parentElement;
    let note = wrap.querySelector('[data-notification="home-slack"]')
    let overlay = wrap.querySelector(".slack-overlay")

    easterEggTrigger.addEventListener("click", () => {
      note.setAttribute("data-notification-status", "active")
      gsap.fromTo(overlay,{opacity: 0},{opacity: 0.35, duration: 0.4})
    })
    
    let input = easterEggTrigger.querySelector("input")
    if(input) {
      input.addEventListener("blur", () => {
        note.setAttribute("data-notification-status", "inactive")
        gsap.to(overlay, {opacity: 0, duration: 0.4})
      })
    }
  }
}

function initStartTextScroll(next){
  let wrap = next.querySelector("[data-start-wrap]")
  let headings = wrap.querySelectorAll(".h-large")
  let letters1 = headings[0].querySelectorAll(".single-letter")
  let letters2 = headings[1].querySelectorAll(".single-letter")
  
  gsap.set(letters2,{autoAlpha: 0})
  
  let tl = gsap.timeline({
    scrollTrigger:{
      trigger: wrap,
      start:"top 95%",
      end:"top 25%",
      //markers:true,
      scrub: true
    },
    defaults:{
      ease:"linear",
      duration: 1
    }
  })
  
  tl
  .from(letters1,{
    autoAlpha: 0,
    stagger: 0.03,
    yoyo: true,
    repeat:1
  })
  .fromTo(letters2,{
    autoAlpha:0,
  },{
    autoAlpha:1,
    stagger:0.03,
  },">-=0.1")
}

function createStackEffect(stackSelector) {
  const wrap = document.querySelector(stackSelector);

  const contentElement = wrap.querySelector(".rotate-content");
  const cards = wrap.querySelectorAll(".rotate-card");
  const cardsTotal = cards.length;
  
  let winsize = {width: window.innerWidth, height: window.innerHeight};
  
  gsap.set(contentElement, { opacity: 0, transform: "rotate3d(0.75, 0, 0, 40deg) rotate3d(0, 1, 0, 35deg)" });
  gsap.set(cards, { z: (i) => -200 - i * 20, rotationZ: -90 });

  const tl = gsap.timeline({ 
    paused: true,
    defaults:{
      duration: awardsStackDuration
    },
    onStart:() => {
      gsap.set(contentElement, {opacity: 1})
    },
  });
  
  const zStartFactor = -0.8;
  const zEndFactor = -0.9;
  const zSpacing = 90; 

  tl.fromTo(cards, {
      z: (pos) => zStartFactor * winsize.height - pos * zSpacing,
    }, {
      z: (pos) => zEndFactor * winsize.height + (cardsTotal - pos - 1) * zSpacing,
    }, 0)
  .fromTo(cards, {
      rotationZ: -150,
    }, {
      rotationZ: (pos) => 360 - pos * 4,
      stagger: 0.006,
    }, 0)

  
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card,{x:"-2em",duration:0.4,ease:"power1"})
    })
    card.addEventListener("mouseleave", () => {
      gsap.to(card,{x:"0em",duration:0.4,ease:"power1"})
    })    
  })


  return tl;
  
}

function initFeaturesIcons(next) {
  // Process SVG wraps
  const svgWraps = next.querySelectorAll("[data-svg-src]");
  svgWraps.forEach((singleSVG) => {
    const singleSVGSource = singleSVG.getAttribute("data-svg-src");
    singleSVG.setAttribute("data-svg-src", "");
    singleSVG.innerHTML = singleSVGSource;
  });

  // Add event listeners to Copy and Download buttons
  const copyButtons = next.querySelectorAll("[data-svg-copy]");
  const downloadButtons = next.querySelectorAll("[data-svg-download]");

  // Handle Copy to Clipboard
  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const parentWithSvg = button.closest("[data-svg]");
      const svg = parentWithSvg?.querySelector("svg");

      if (svg) {
        const svgHTML = svg.outerHTML;
        copyToClipboard(svgHTML);

        // Add feedback
        const span = button.querySelector("span");
        if (span) span.textContent = "Copied!";
        const notification = document.querySelector('[data-notification="icon-positive"]');
        if (notification) notification.setAttribute("data-notification-status", "active");

        setTimeout(() => {
          if (span) span.textContent = "Copy";
          if (notification) notification.setAttribute("data-notification-status", "not-active");
        }, 2000);
      }
    });
  });

  // Handle Download SVG
  downloadButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const parentWithSvg = button.closest("[data-svg]");
      const svg = parentWithSvg?.querySelector("svg");

      if (svg) {
        const svgHTML = svg.outerHTML;
        const svgSlug = parentWithSvg.getAttribute("data-svg") || "icon";
        const filename = `${svgSlug}.svg`;

        downloadSVG(svgHTML, filename);
      }
    });
  });

  // Function to download SVG as a file
  function downloadSVG(svgContent, filename) {
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

function initFeaturesCode(next) {
  const copyButtons = next.querySelectorAll("[data-code-copy]");

  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const dashCode = button.closest(".dash-code"); // Find the closest `.dash-code` element
      const codeBlock = dashCode?.querySelector("pre code"); // Find the `<pre><code>` block within

      if (codeBlock) {
        const codeContent = codeBlock.textContent; // Get the text content of the code block

        // Copy the code content to the clipboard
        copyToClipboard(codeContent);

        // Visual feedback
        button.querySelector("span").textContent = "Copied!";
        const notification = document.querySelector('[data-notification="icon-positive"]');
        if (notification) {
          notification.setAttribute("data-notification-status", "active");
        }

        setTimeout(() => {
          button.querySelector("span").textContent = "Copy";
          if (notification) {
            notification.setAttribute("data-notification-status", "not-active");
          }
        }, 2000);
      }
    });
  });
}

function copyToClipboard(text) {
  navigator.clipboard
  .writeText(text)
  .catch((err) => console.error("Failed to copy text: ", err));
}

function initAboutScroll(next){
  let wrap = next.querySelector("[data-about-scroll]")
  let images = wrap.querySelectorAll(".about-divider-img")
  let dividers = wrap.querySelectorAll(".divider")
  
  let tl = gsap.timeline({
    scrollTrigger:{
      trigger: wrap,
      start: "top 60%",
      once:true
    }
  })
  
  tl.fromTo(dividers,{scaleX: 0.2},{scaleX:1, duration:1})
  .fromTo(images[0],{x:"20em"},{x:"0em",duration:1.2},"<")
  .fromTo(images[1],{x:"-20em"},{x:"0em",duration:1.2},"<")
  
  
}


//
//
//


function initGeneral(next) {
  initLenis()
  initLenisCheckScrollUpDown()
  initSplit(next)
  UnicornStudio.init()
  initLoad(next)
  initTextScroll(next)
  initParallax(next)
  initCurrentYear(next)
  initFooterLogo(next)
  initBasicFormValidation(next)
}


//
//
//

barba.hooks.leave((data) => {
  lenis.destroy();
});

barba.hooks.enter((data) => {
  initBarbaNavUpdate(data)
  // Scroll to top on load
  window.scrollTo(0, 0);
});


barba.hooks.afterEnter((data) => {
  let next = data.next.container;
  let name = data.next.namespace;
  
  let triggers = ScrollTrigger.getAll();
  triggers.forEach((trigger) => {
    trigger.kill();
  });

  if(Webflow.env("editor") === undefined){
    lenis = new Lenis({
      duration: 1.25,
      wrapper: document.body,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -13 * t)),
    });
    lenis.scrollTo(".page-w", {
      duration: 0.5,
      force: true,
      lock: true,
    });
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

  }

  initGeneral(next);
});

barba.init({
  debug: false,
  preventRunning: true,
  prevent: function ({ el }) {
    if (el.hasAttribute("data-barba-prevent")) {
      return true;
    }
  },
  transitions: [
    {
      name: "default",
      sync: false,
      leave(data) {
      
        let nextName = data.next.namespace
        let currentName = data.current.container.getAttribute("data-barba-namespace")
        
        const tl = gsap.timeline({
            onStart: () => {
              if(menuOpen){
                menuButton.click()            
              }
            },
            onComplete:()=>{
              data.current.container.remove()
            }
          });
          tl.to( data.current.container,{ autoAlpha: 0, duration: 0.5 })
          return tl;
      
      },
      enter(data) {
        
        const tl = gsap.timeline({
          onComplete: () => {
            lenis.start()
          }
        })
        tl.from( data.next.container,{ autoAlpha: 0,duration: 1 })
      },
    },
  ],
  views: [
    {
      namespace: "home",
      afterEnter(data) {
        let next = data.next.container;
        initHomeDashboard(next)
        initPlayVideoHover(next)
        initFlipButtons(next)
        initSliders(next)
        initTabSystem(next)
        initPricingCards(next)
        initStartTextScroll(next)
        initModal()
        initVideoModal()
        initVideos()
        initFeaturesIcons(next)
        initFeaturesCode(next)  
        initAboutScroll(next)
        awardStackEffect = createStackEffect("[data-rotating-cards]");
        
      },
    },
    {
      namespace: "pricing",
      afterEnter(data) {
        let next = data.next.container;
        initFlipButtons(next)
        initPricingCards(next)
      },
    },    
    {
      namespace: "faq",
      afterEnter(data) {
        let next = data.next.container;
        initFaq(next)
        initFlipButtons(next)
      },
    },
  ],
});

