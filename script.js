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
const podCanvas = document.querySelector("#pod-canvas");
const podContext = podCanvas ? podCanvas.getContext("2d") : null;
const podCallouts = Array.from(document.querySelectorAll("[data-pod-copy]"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
const revealItems = document.querySelectorAll(".reveal");
const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const shouldReduceMotion = () => prefersReducedMotion.matches;
const isCompactViewport = () => window.innerWidth <= 760;
const podFrameCount = 180;
let lastPodFrame = -1;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const drawRoundedRect = (context, x, y, width, height, radius) => {
  const rounded = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + rounded, y);
  context.arcTo(x + width, y, x + width, y + height, rounded);
  context.arcTo(x + width, y + height, x, y + height, rounded);
  context.arcTo(x, y + height, x, y, rounded);
  context.arcTo(x, y, x + width, y, rounded);
  context.closePath();
};

const drawPodFrame = (frameIndex) => {
  if (!podContext || !podCanvas || frameIndex === lastPodFrame) {
    return;
  }

  lastPodFrame = frameIndex;

  const context = podContext;
  const width = podCanvas.width;
  const height = podCanvas.height;
  const progress = frameIndex / Math.max(1, podFrameCount - 1);
  const rotation = progress * Math.PI * 2;
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);
  const frontVisible = cosine >= 0;
  const faceWidth = 240 + Math.abs(cosine) * 140;
  const faceHeight = 356;
  const sideWidth = 48 + Math.abs(sine) * 64;
  const centerX = width * 0.5;
  const centerY = height * 0.56;
  const bodyX = centerX - faceWidth / 2;
  const bodyY = centerY - faceHeight / 2 + Math.sin(progress * Math.PI) * -10;
  const sideX = sine > 0 ? bodyX + faceWidth - 18 : bodyX - sideWidth + 18;
  const sideY = bodyY + 12;
  const sideHeight = faceHeight - 24;

  context.clearRect(0, 0, width, height);

  const backdrop = context.createLinearGradient(0, 0, 0, height);
  backdrop.addColorStop(0, "#26030b");
  backdrop.addColorStop(0.5, "#100208");
  backdrop.addColorStop(1, "#050204");
  context.fillStyle = backdrop;
  context.fillRect(0, 0, width, height);

  const aura = context.createRadialGradient(centerX, height * 0.24, 20, centerX, height * 0.24, 420);
  aura.addColorStop(0, "rgba(255, 72, 103, 0.22)");
  aura.addColorStop(0.45, "rgba(255, 72, 103, 0.1)");
  aura.addColorStop(1, "rgba(255, 72, 103, 0)");
  context.fillStyle = aura;
  context.fillRect(0, 0, width, height);

  const beamPositions = [0.16, 0.32, 0.52, 0.71, 0.86];
  beamPositions.forEach((offset, index) => {
    const beamX = width * offset + Math.sin(rotation + index * 0.8) * 18;
    const beamGradient = context.createLinearGradient(beamX, 80, beamX, height - 120);
    beamGradient.addColorStop(0, "rgba(255, 72, 103, 0)");
    beamGradient.addColorStop(0.3, "rgba(255, 72, 103, 0.75)");
    beamGradient.addColorStop(0.7, "rgba(255, 48, 86, 0.36)");
    beamGradient.addColorStop(1, "rgba(255, 72, 103, 0)");
    context.fillStyle = beamGradient;
    context.fillRect(beamX - 3, 72, 6, height - 180);
  });

  context.fillStyle = "rgba(255, 72, 103, 0.12)";
  context.fillRect(0, height * 0.72, width, height * 0.28);

  context.save();
  context.translate(centerX, height * 0.82);
  context.scale(1.1, 0.26);
  const shadow = context.createRadialGradient(0, 0, 30, 0, 0, 220);
  shadow.addColorStop(0, "rgba(0, 0, 0, 0.55)");
  shadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = shadow;
  context.beginPath();
  context.arc(0, 0, 180, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.save();
  drawRoundedRect(context, sideX, sideY, sideWidth, sideHeight, 26);
  const sideGradient = context.createLinearGradient(sideX, sideY, sideX + sideWidth, sideY);
  sideGradient.addColorStop(0, sine > 0 ? "#3d0f1b" : "#1c0a10");
  sideGradient.addColorStop(1, sine > 0 ? "#10040a" : "#451522");
  context.fillStyle = sideGradient;
  context.fill();
  context.strokeStyle = "rgba(255, 91, 121, 0.18)";
  context.lineWidth = 2;
  context.stroke();

  for (let moduleIndex = 0; moduleIndex < 3; moduleIndex += 1) {
    const segmentY = sideY + 42 + moduleIndex * 92;
    drawRoundedRect(context, sideX + 8, segmentY, sideWidth - 16, 58, 14);
    context.fillStyle = "rgba(255, 92, 118, 0.12)";
    context.fill();
  }
  context.restore();

  context.save();
  drawRoundedRect(context, bodyX, bodyY, faceWidth, faceHeight, 34);
  const faceGradient = context.createLinearGradient(bodyX, bodyY, bodyX, bodyY + faceHeight);

  if (frontVisible) {
    faceGradient.addColorStop(0, "#20262e");
    faceGradient.addColorStop(0.5, "#141a21");
    faceGradient.addColorStop(1, "#0a0d11");
  } else {
    faceGradient.addColorStop(0, "#161318");
    faceGradient.addColorStop(0.55, "#0f0b10");
    faceGradient.addColorStop(1, "#080609");
  }

  context.fillStyle = faceGradient;
  context.fill();
  context.strokeStyle = "rgba(255, 109, 133, 0.26)";
  context.lineWidth = 2;
  context.stroke();
  context.restore();

  context.save();
  context.globalAlpha = 0.85;
  drawRoundedRect(context, bodyX + 14, bodyY + 14, faceWidth - 28, faceHeight - 28, 28);
  const shellGradient = context.createLinearGradient(bodyX, bodyY, bodyX + faceWidth, bodyY + faceHeight);
  shellGradient.addColorStop(0, "rgba(255, 255, 255, 0.03)");
  shellGradient.addColorStop(0.55, "rgba(255, 82, 111, 0.08)");
  shellGradient.addColorStop(1, "rgba(255, 255, 255, 0.02)");
  context.fillStyle = shellGradient;
  context.fill();
  context.restore();

  const railOffset = faceWidth * 0.16;
  const railHeight = faceHeight - 84;
  const railY = bodyY + 42;
  const railWidth = Math.max(10, faceWidth * 0.055);

  context.save();
  context.fillStyle = "rgba(255, 82, 111, 0.9)";
  drawRoundedRect(context, centerX - railOffset - railWidth / 2, railY, railWidth, railHeight, 12);
  context.fill();
  drawRoundedRect(context, centerX + railOffset - railWidth / 2, railY, railWidth, railHeight, 12);
  context.fill();
  context.restore();

  if (frontVisible) {
    for (let moduleIndex = 0; moduleIndex < 3; moduleIndex += 1) {
      const moduleWidth = faceWidth * 0.58;
      const moduleHeight = 60;
      const moduleX = centerX - moduleWidth / 2;
      const moduleY = bodyY + 78 + moduleIndex * 88;

      context.save();
      drawRoundedRect(context, moduleX, moduleY, moduleWidth, moduleHeight, 18);
      const moduleGradient = context.createLinearGradient(moduleX, moduleY, moduleX, moduleY + moduleHeight);
      moduleGradient.addColorStop(0, "rgba(255, 255, 255, 0.08)");
      moduleGradient.addColorStop(1, "rgba(255, 255, 255, 0.02)");
      context.fillStyle = moduleGradient;
      context.fill();
      context.strokeStyle = "rgba(255, 114, 139, 0.16)";
      context.lineWidth = 1.5;
      context.stroke();
      context.restore();

      context.fillStyle = "rgba(255, 82, 111, 0.82)";
      context.fillRect(moduleX + 22, moduleY + 20, moduleWidth - 44, 4);
      context.fillRect(moduleX + 22, moduleY + 34, moduleWidth * 0.48, 3);
    }

    context.fillStyle = "rgba(255, 255, 255, 0.72)";
    context.fillRect(centerX - 12, bodyY + 32, 24, 10);
  } else {
    const panelInsetX = bodyX + faceWidth * 0.18;
    const panelInsetY = bodyY + 72;
    const panelWidth = faceWidth * 0.64;
    const panelHeight = faceHeight * 0.54;

    context.save();
    drawRoundedRect(context, panelInsetX, panelInsetY, panelWidth, panelHeight, 20);
    context.fillStyle = "rgba(255, 255, 255, 0.03)";
    context.fill();
    context.strokeStyle = "rgba(255, 108, 132, 0.14)";
    context.stroke();
    context.restore();

    context.fillStyle = "rgba(255, 255, 255, 0.08)";
    for (let ventIndex = 0; ventIndex < 7; ventIndex += 1) {
      const ventY = panelInsetY + 26 + ventIndex * 24;
      context.fillRect(panelInsetX + 20, ventY, panelWidth - 40, 3);
    }

    const portY = panelInsetY + panelHeight + 30;
    [0.34, 0.5, 0.66].forEach((offset) => {
      context.beginPath();
      context.fillStyle = "rgba(255, 82, 111, 0.74)";
      context.arc(bodyX + faceWidth * offset, portY, 10, 0, Math.PI * 2);
      context.fill();
    });
  }

  context.save();
  context.strokeStyle = "rgba(255, 160, 173, 0.18)";
  context.lineWidth = 1.2;
  context.strokeRect(bodyX + 18, bodyY + 18, faceWidth - 36, faceHeight - 36);
  context.restore();
};

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
    "Battery Stack",
    "Hybrid Core",
    "Thermal Spine",
    "Rear Ports",
  ];
  const stageIndex = Math.min(viewStages.length - 1, Math.floor(progress * viewStages.length));
  const frameIndex = clamp(Math.round(progress * (podFrameCount - 1)), 0, podFrameCount - 1);

  panelTourCard.style.setProperty("--tour-progress", progress.toFixed(4));
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

  podCallouts.forEach((callout, index) => {
    callout.classList.toggle("is-visible", index === stageIndex);
  });

  drawPodFrame(frameIndex);
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
