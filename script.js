const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const header = document.querySelector(".site-header");
const yearSlot = document.querySelector("#current-year");
const quoteForm = document.querySelector("#quote-form");
const formNote = document.querySelector("#form-note");
const scrollProgressBar = document.querySelector(".scroll-progress__bar");
const backToTopButton = document.querySelector("#back-to-top");
const heroCard = document.querySelector(".hero-card");
const panelTourSection = document.querySelector("#panel-tour");
const panelTourCard = document.querySelector("#panel-tour-card");
const panelAngle = document.querySelector("#panel-angle");
const panelFaceName = document.querySelector("#panel-face-name");
const panelTourProgressBar = document.querySelector("#panel-tour-progress");
const panelTourStages = Array.from(document.querySelectorAll(".panel-tour__stage"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
const revealItems = document.querySelectorAll(".reveal");
const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const shouldReduceMotion = () => prefersReducedMotion.matches;
const isCompactViewport = () => window.innerWidth <= 760;

const closeNav = () => {
  if (!siteNav || !navToggle) {
    return;
  }

  siteNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
};

const getHeaderOffset = () => {
  if (!header) {
    return 88;
  }

  return header.getBoundingClientRect().height + 20;
};

const setActiveNav = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle("is-current", link.getAttribute("href") === `#${id}`);
  });
};

if (yearSlot) {
  yearSlot.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

anchorLinks.forEach((link) => {
  const targetSelector = link.getAttribute("href");

  if (!targetSelector || targetSelector === "#") {
    return;
  }

  const targetElement = document.querySelector(targetSelector);

  if (!targetElement) {
    return;
  }

  link.addEventListener("click", (event) => {
    event.preventDefault();
    closeNav();

    const top = targetElement.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

    window.scrollTo({
      top,
      behavior: shouldReduceMotion() ? "auto" : "smooth",
    });

    if (history.replaceState) {
      history.replaceState(null, "", targetSelector);
    }
  });
});

const updateHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

const updateScrollProgress = () => {
  if (!scrollProgressBar) {
    return;
  }

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  scrollProgressBar.style.transform = `scaleX(${progress})`;
};

const updateBackToTopVisibility = () => {
  if (!backToTopButton) {
    return;
  }

  backToTopButton.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.55);
};

const updatePanelTour = () => {
  if (!panelTourSection || !panelTourCard) {
    return;
  }

  const stickyOffset = getHeaderOffset();
  const rect = panelTourSection.getBoundingClientRect();
  const travelRange = Math.max(panelTourSection.offsetHeight - window.innerHeight + stickyOffset, 1);
  const progress = Math.min(1, Math.max(0, (stickyOffset - rect.top) / travelRange));
  const angle = progress * 360;
  const viewStages = [
    "Front Glass",
    "Frame Edge",
    "Rear Surface",
    "Return Angle",
  ];
  const stageIndex = Math.min(viewStages.length - 1, Math.floor(progress * viewStages.length));
  const tilt = shouldReduceMotion() ? -12 : -13 + Math.sin(progress * Math.PI * 2) * 3.5;
  const lift = shouldReduceMotion() ? 0 : Math.sin(progress * Math.PI) * -8;

  panelTourCard.style.setProperty("--tour-progress", progress.toFixed(4));
  panelTourCard.style.setProperty("--tour-rotation", `${angle.toFixed(2)}deg`);
  panelTourCard.style.setProperty("--tour-tilt", `${tilt.toFixed(2)}deg`);
  panelTourCard.style.setProperty("--tour-lift", `${lift.toFixed(2)}px`);
  panelTourCard.style.setProperty("--tour-sheen", `${(progress * 100).toFixed(2)}%`);

  if (panelTourProgressBar) {
    panelTourProgressBar.style.transform = `scaleX(${progress})`;
  }

  if (panelAngle) {
    panelAngle.textContent = `${Math.round(angle)} deg`;
  }

  if (panelFaceName) {
    panelFaceName.textContent = viewStages[stageIndex];
  }

  panelTourStages.forEach((stage, index) => {
    stage.classList.toggle("is-active", index === stageIndex);
  });
};

const updateSectionDepth = () => {
  if (!revealItems.length) {
    return;
  }

  if (shouldReduceMotion()) {
    revealItems.forEach((item) => {
      item.style.setProperty("--section-shift", "0px");
      item.style.setProperty("--section-z", "0px");
      item.style.setProperty("--section-tilt", "0deg");
      item.style.setProperty("--section-scale", "1");
      item.style.setProperty("--section-opacity", "1");
      item.style.setProperty("--section-blur", "0px");
    });
    return;
  }

  const viewportHeight = window.innerHeight || 1;
  const nearPageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 24;

  revealItems.forEach((item) => {
    if (!item.classList.contains("is-visible")) {
      return;
    }

    const rect = item.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight * 0.52;
    const depthRatio = Math.max(-1, Math.min(1, (sectionCenter - viewportCenter) / viewportHeight));
    const distance = Math.abs(depthRatio);

    if (isCompactViewport() || nearPageBottom) {
      item.style.setProperty("--section-shift", `${depthRatio * 18}px`);
      item.style.setProperty("--section-z", "0px");
      item.style.setProperty("--section-tilt", "0deg");
      item.style.setProperty("--section-scale", "1");
      item.style.setProperty("--section-opacity", "1");
      item.style.setProperty("--section-blur", "0px");
      return;
    }

    item.style.setProperty("--section-shift", `${depthRatio * 46}px`);
    item.style.setProperty("--section-z", `${-distance * 140}px`);
    item.style.setProperty("--section-tilt", `${depthRatio * -7}deg`);
    item.style.setProperty("--section-scale", `${1 - distance * 0.04}`);
    item.style.setProperty("--section-opacity", `${1 - distance * 0.14}`);
    item.style.setProperty("--section-blur", `${distance * 1.4}px`);
  });
};

let scrollTicking = false;

const syncScrollUi = () => {
  updateHeaderState();
  updateScrollProgress();
  updateBackToTopVisibility();
  updatePanelTour();
  updateSectionDepth();
  scrollTicking = false;
};

const requestScrollUiSync = () => {
  if (scrollTicking) {
    return;
  }

  scrollTicking = true;
  window.requestAnimationFrame(syncScrollUi);
};

syncScrollUi();
window.addEventListener("scroll", requestScrollUiSync, { passive: true });
window.addEventListener("resize", requestScrollUiSync);

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion() ? "auto" : "smooth",
    });
  });
}

if ("IntersectionObserver" in window && trackedSections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

      if (visibleSections[0]) {
        setActiveNav(visibleSections[0].target.id);
      }
    },
    {
      threshold: [0.25, 0.45, 0.65],
      rootMargin: "-24% 0px -46% 0px",
    }
  );

  trackedSections.forEach((section) => navObserver.observe(section));
}

if ("IntersectionObserver" in window && revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          updateSectionDepth();
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal-ready");
    revealObserver.observe(item);
  });
} else if (revealItems.length) {
  revealItems.forEach((item) => {
    item.classList.add("reveal-ready", "is-visible");
  });
}

if (heroCard && !shouldReduceMotion()) {
  const resetHeroMotion = () => {
    heroCard.style.transform = "";
    heroCard.style.setProperty("--pointer-x", "50%");
    heroCard.style.setProperty("--pointer-y", "50%");
    heroCard.style.setProperty("--sun-shift-x", "0px");
    heroCard.style.setProperty("--sun-shift-y", "0px");
    heroCard.style.setProperty("--glow-shift-x", "0px");
    heroCard.style.setProperty("--glow-shift-y", "0px");
    heroCard.style.setProperty("--panel-shift-x", "0px");
    heroCard.style.setProperty("--panel-shift-y", "0px");
    heroCard.style.setProperty("--badge-top-shift-x", "0px");
    heroCard.style.setProperty("--badge-top-shift-y", "0px");
    heroCard.style.setProperty("--badge-bottom-shift-x", "0px");
    heroCard.style.setProperty("--badge-bottom-shift-y", "0px");
  };

  heroCard.addEventListener("pointermove", (event) => {
    const bounds = heroCard.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const tiltX = (0.5 - y) * 10;
    const tiltY = (x - 0.5) * 12;

    heroCard.style.transform = `perspective(1400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    heroCard.style.setProperty("--pointer-x", `${x * 100}%`);
    heroCard.style.setProperty("--pointer-y", `${y * 100}%`);
    heroCard.style.setProperty("--sun-shift-x", `${(x - 0.5) * 18}px`);
    heroCard.style.setProperty("--sun-shift-y", `${(y - 0.5) * 18}px`);
    heroCard.style.setProperty("--glow-shift-x", `${(x - 0.5) * -20}px`);
    heroCard.style.setProperty("--glow-shift-y", `${(y - 0.5) * -14}px`);
    heroCard.style.setProperty("--panel-shift-x", `${(x - 0.5) * -10}px`);
    heroCard.style.setProperty("--panel-shift-y", `${(y - 0.5) * -8}px`);
    heroCard.style.setProperty("--badge-top-shift-x", `${(x - 0.5) * -12}px`);
    heroCard.style.setProperty("--badge-top-shift-y", `${(y - 0.5) * -10}px`);
    heroCard.style.setProperty("--badge-bottom-shift-x", `${(x - 0.5) * 14}px`);
    heroCard.style.setProperty("--badge-bottom-shift-y", `${(y - 0.5) * 12}px`);
  });

  heroCard.addEventListener("pointerleave", resetHeroMotion);
  resetHeroMotion();
}

if (quoteForm && formNote) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const propertyType = (formData.get("propertyType") || "").toString().trim();
    const notes = (formData.get("notes") || "").toString().trim();

    const subject = encodeURIComponent(`Quote request from ${name || "website visitor"}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Property type: ${propertyType}`,
        "",
        "Notes:",
        notes || "No extra notes provided.",
      ].join("\n")
    );

    formNote.textContent = "Opening your email app with the quote details...";
    window.location.href = `mailto:hello@yourcompany.com?subject=${subject}&body=${body}`;
  });
}
