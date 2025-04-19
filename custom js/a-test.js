// MWG CERTIFIED CARDS
window.addEventListener("DOMContentLoaded", () => {
  // ✅ Only run animation on desktop (greater than 991px)
  if (window.innerWidth <= 991) return;

  const container = document.querySelector('.layout-component .layout-container');
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
      trigger: '.mwg_effect048',
      start: 'top top',
      end: 'top top-=1',
      toggleActions: "play none reverse none"
    }
  });

  // 3D Y rotation on scroll for each media element
  const medias = document.querySelectorAll('.mwg_effect048 .about-media');
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

