/* =====================================================
       THEME TOGGLE
       ===================================================== */
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function syncThemeIcon() {
  themeToggle.innerHTML =
    root.getAttribute("data-theme") === "dark"
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
}
syncThemeIcon();

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
  syncThemeIcon();
});

/* =====================================================
       SCROLL PROGRESS + NAV STATE
       ===================================================== */
const progress = document.getElementById("progress");
const navbar = document.getElementById("navbar");
let scrollTicking = false;

function onScroll() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    const el = document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    progress.style.width = (max > 0 ? (el.scrollTop / max) * 100 : 0) + "%";
    navbar.classList.toggle("scrolled", el.scrollTop > 20);
    scrollTicking = false;
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* =====================================================
       MOBILE NAV
       ===================================================== */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

function closeNav() {
  navLinks.classList.remove("open");
  navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.innerHTML = open
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

navLinks
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeNav));

document.addEventListener("click", (e) => {
  if (
    navLinks.classList.contains("open") &&
    !navLinks.contains(e.target) &&
    !navToggle.contains(e.target)
  )
    closeNav();
});

/* =====================================================
       SCROLLSPY
       ===================================================== */
const spyLinks = [...navLinks.querySelectorAll("a")];
const sections = spyLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      spyLinks.forEach((a) =>
        a.classList.toggle(
          "active",
          a.getAttribute("href") === "#" + entry.target.id,
        ),
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
);
sections.forEach((s) => spy.observe(s));

/* =====================================================
       TYPING EFFECT
       ===================================================== */
const typedEl = document.getElementById("typed");
const roles = [
  "Full Stack Developer", // klaim utama
  "Front-End Developer", // spesialisasi
  "UI/UX Enthusiast",
  "JavaScript Developer",
  "TRPL Student",
];

let roleIdx = 0,
  charIdx = 0,
  deleting = false;

function typeLoop() {
  const word = roles[roleIdx];
  typedEl.textContent = deleting
    ? word.slice(0, --charIdx)
    : word.slice(0, ++charIdx);

  let delay = deleting ? 45 : 95;

  if (!deleting && charIdx === word.length) {
    deleting = true;
    delay = 1600;
  } else if (deleting && charIdx === 0) {
    deleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    delay = 350;
  }
  setTimeout(typeLoop, delay);
}
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  typeLoop();
}

/* =====================================================
       MARQUEE
       ===================================================== */
const marquee = document.getElementById("marquee");
const baseHTML = marquee.innerHTML;

function buildMarquee() {
  marquee.innerHTML = baseHTML;
  let copies = 1;
  const minWidth = window.innerWidth * 2;
  while (marquee.getBoundingClientRect().width < minWidth && copies < 30) {
    marquee.innerHTML += baseHTML;
    copies++;
  }
  const oneSetWidth = marquee.getBoundingClientRect().width / copies;
  marquee.style.setProperty("--shift", oneSetWidth + "px");
}
buildMarquee();

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildMarquee, 250);
});

/* =====================================================
       REVEAL ON SCROLL + SKILL BAR + COUNTER
       ===================================================== */
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");

      entry.target.querySelectorAll(".fill").forEach((fill, i) => {
        setTimeout(() => {
          fill.style.width = fill.dataset.fill + "%";
        }, i * 110);
      });

      entry.target.querySelectorAll(".num[data-count]").forEach(countUp);

      obs.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

function countUp(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || "";
  const duration = 1500;
  const start = performance.now();

  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* =====================================================
       CONTACT FORM
       ===================================================== */
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  note.classList.add("show");
  form.reset();
  setTimeout(() => note.classList.remove("show"), 5000);
});
