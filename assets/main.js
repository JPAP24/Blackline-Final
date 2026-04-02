document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", function() {
    const loader = document.getElementById("loader");
    // Add the hidden class to trigger the CSS transition
    loader.classList.add("loader-hidden");
});
  
    // --- 1. UNIVERSAL FULLSCREEN FUNCTION ---
  const toggleFullScreen = (element) => {
    if (!element) return;

    // Netflix logic: Unmute if it's a video
    if (element.tagName === "VIDEO") {
      element.muted = false;
    }

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      /* Safari/iOS */
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      /* IE11 */
      element.msRequestFullscreen();
    }
  };

  // Re-mute videos when exiting full screen
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      document.querySelectorAll("video").forEach((v) => (v.muted = true));
    }
  });

  // --- 2. POSTER CLICK LOGIC (STATIC IMAGES) ---
  // This handles images inside .poster-img that are NOT in the slider
  document.querySelectorAll(".poster-img img").forEach((image) => {
    image.addEventListener("click", () => toggleFullScreen(image));
  });

  // --- 3. SLIDER LOGIC (DRAGGING + CLICKING) ---
  const track = document.querySelector(".slide-track");
  const slider = document.querySelector(".slider");

  if (track && slider) {
    const slides = track.innerHTML;
    track.innerHTML += slides;

    let isDragging = false;
    let startX, scrollLeft;
    let moveThreshold = 10; // Increased slightly for better mobile/mouse accuracy
    let mouseDownX = 0;
    let mouseDownY = 0;

    slider.addEventListener("mousedown", (e) => {
      isDragging = true;
      mouseDownX = e.pageX;
      mouseDownY = e.pageY;
      slider.classList.add("dragging");
      track.style.animationPlayState = "paused";

      const style = window.getComputedStyle(track);
      const matrix = new WebKitCSSMatrix(style.transform);
      startX = e.pageX - track.offsetLeft;
      scrollLeft = matrix.m41;
    });

    slider.addEventListener("mouseup", (e) => {
      if (!isDragging) return;

      const moveDistance = Math.sqrt(
        Math.pow(e.pageX - mouseDownX, 2) + Math.pow(e.pageY - mouseDownY, 2),
      );

      // If the movement was tiny, treat it as a CLICK
      if (moveDistance < moveThreshold) {
        const clickedElement = e.target.closest("img, video");
        if (clickedElement) {
          toggleFullScreen(clickedElement);
        }
      }

      isDragging = false;
      slider.classList.remove("dragging");
      track.style.animationPlayState = "running";
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = x - startX;
      track.style.transform = `translateX(${scrollLeft + walk}px)`;
    });

    slider.addEventListener("mouseleave", () => {
      isDragging = false;
      slider.classList.remove("dragging");
      track.style.animationPlayState = "running";
    });
  }

  // --- 4. NAVIGATION & MENU ---
  const menuToggle = document.getElementById("mobile-menu");
  const navMenu = document.getElementById("nav");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isActive = navMenu.classList.toggle("active");
      menuToggle.classList.toggle("active");
      if (window.innerWidth <= 768) {
        document.body.style.overflow = isActive ? "hidden" : "auto";
      }
    });
  }

  document.querySelectorAll("#nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (menuToggle) menuToggle.classList.remove("active");
      if (navMenu) navMenu.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });
});

// --- 5. CONTACT FORM (Global Scope) ---
function submitForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const name = form.querySelector('[name="name"]').value.trim();
  const email = form.querySelector('[name="email"]').value.trim();
  const message = form.querySelector('[name="message"]').value.trim();

  if (!name || !email || !message) {
    alert("Please fill out all required fields.");
    return;
  }

  if (!email.toLowerCase().endsWith("@gmail.com")) {
    alert("Please use an @gmail.com email address.");
    return;
  }

  form.submit();
}


