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

