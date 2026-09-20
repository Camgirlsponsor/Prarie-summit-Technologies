// Prairie Summit Technologies — shared site behavior

if (location.protocol === "http:" && /(?:^|\.)prairiesummittech\.net$/i.test(location.hostname)) {
  location.replace("https://" + location.host + location.pathname + location.search + location.hash);
}

document.addEventListener("DOMContentLoaded", function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".main-nav");

  function setScrolled() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  if (toggle && nav) {
    var navHome = nav.parentNode;
    var navNext = nav.nextSibling;
    function closeNav() {
      nav.classList.remove("open");
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.style.overflow = "";
      if (nav.parentNode !== navHome) {
        navHome.insertBefore(nav, navNext);
      }
    }
    function openNav() {
      document.body.appendChild(nav);
      nav.classList.add("open");
      document.body.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.body.style.overflow = "hidden";
    }
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("open")) closeNav();
      else openNav();
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav ul a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = ((form.querySelector("#name") || {}).value || "").trim();
      var email = ((form.querySelector("#email") || {}).value || "").trim();
      var topic = ((form.querySelector("#topic") || {}).value || "").trim();
      var message = ((form.querySelector("#message") || {}).value || "").trim();
      var first = name.split(/\s+/)[0] || "";
      var subject = "Website inquiry: " + (topic || "General");
      var body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Topic: " + topic + "\n\n" +
        message;
      window.location.href =
        "mailto:prairiesummittech@outlook.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      var status = form.querySelector(".form-status");
      if (status) {
        status.hidden = false;
        status.classList.add("is-success");
        status.textContent = "Thanks" + (first ? ", " + first : "") +
          " — your email app should open with this message ready to send. If it doesn't, email prairiesummittech@outlook.com.";
      }
    });
  }

  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector("button");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  var revealEls = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (revealEls.length && "IntersectionObserver" in window && !reduceMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }
});
