/**
 * Amber's Loving Paws — layout + content plug-in
 * All wording/prices load from data/content.json
 * Amber edits that file via the Admin (no HTML).
 */
(function () {
  var PAGE = document.body.getAttribute("data-page") || "home";

  function el(html) {
    var d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstChild;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** Prefer Scritches booking link; fall back to contact page */
  function bookHref(biz) {
    var u = (biz && biz.bookingUrl) || "";
    u = String(u).trim();
    return u || "contact.html";
  }

  function bookAttrs(biz) {
    var href = bookHref(biz);
    var external = /^https?:\/\//i.test(href);
    return {
      href: href,
      target: external ? ' target="_blank" rel="noopener noreferrer"' : "",
      label: (biz && biz.bookingLabel) || "Book Consultation",
    };
  }

  function renderHeader(active, biz) {
    var logo = biz.logo || "assets/logo-main.png";
    var name = esc(biz.shortName || biz.name);
    var book = bookAttrs(biz);
    // Header logo: small heart picture + business name as real text (readable on phones).
    // Falls back to the full logo picture when no heart picture is set.
    var logoHtml = biz.logoMark
      ? '<img class="logo-mark" src="' +
        esc(biz.logoMark) +
        '" alt="" width="58" height="57" />' +
        '<span class="logo-text"><strong>' +
        name +
        "</strong>" +
        (biz.logoSub ? "<span>" + esc(biz.logoSub) + "</span>" : "") +
        "</span>"
      : '<img class="logo-header" src="' +
        esc(logo) +
        '" alt="' +
        esc(biz.name) +
        '" />';
    return (
      '<header class="site-header">' +
      '<div class="header-inner">' +
      '<a class="logo-link" href="index.html" aria-label="' +
      name +
      ' home">' +
      logoHtml +
      "</a>" +
      '<button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false">' +
      '<span class="paw-ico" aria-hidden="true"></span><span>Menu</span></button>' +
      "<nav><ul class=\"nav-list\">" +
      navItem("index.html", "Home", active === "home") +
      navItem("about.html", "About", active === "about") +
      navItem("services.html", "Services", active === "services") +
      navItem("training.html", "Certificates", active === "training") +
      navItem("gallery.html", "Gallery", active === "gallery") +
      navItem("contact.html", "Contact", active === "contact") +
      '<li><a class="nav-cta" href="' +
      esc(book.href) +
      '"' +
      book.target +
      ">" +
      esc(book.label) +
      "</a></li>" +
      "</ul></nav></div></header>"
    );
  }

  function navItem(href, label, isActive) {
    return (
      "<li><a" +
      (isActive ? ' class="active"' : "") +
      ' href="' +
      href +
      '">' +
      label +
      "</a></li>"
    );
  }

  /** Social profile links (Instagram, Facebook…) as list items */
  function socialItems(biz) {
    return ((biz && biz.social) || [])
      .map(function (s) {
        return (
          '<li><a href="' +
          esc(s.url) +
          '" target="_blank" rel="noopener noreferrer">' +
          esc(s.name) +
          "</a></li>"
        );
      })
      .join("");
  }

  /** Short trust points shown under the hero buttons */
  function trustList(items) {
    if (!items || !items.length) return "";
    return (
      '<ul class="trust-list">' +
      items
        .map(function (t) {
          var text = esc(t.text);
          return (
            "<li>" +
            (t.href ? '<a href="' + esc(t.href) + '">' + text + "</a>" : text) +
            "</li>"
          );
        })
        .join("") +
      "</ul>"
    );
  }

  /** Slogan ribbon shown right under the top bar on the home page */
  function sloganRibbon(h) {
    if (!h.slogan) return "";
    return (
      '<div class="slogan-ribbon"><p>' +
      '<span class="paw-ico" aria-hidden="true"></span>' +
      esc(h.slogan) +
      '<span class="paw-ico" aria-hidden="true"></span>' +
      "</p></div>"
    );
  }

  /** Edge-to-edge band of real client pet photos under the first card on the home page */
  function petsBand(h) {
    var photos = h.petsPhotos || [];
    if (!photos.length) return "";
    var label = h.petsLabel || "Pets I've watched";
    var imgs = photos
      .map(function (p) {
        return (
          '<img src="' +
          esc(p.src) +
          '" alt="' +
          esc(p.alt || "") +
          '"' +
          (p.focus ? ' style="object-position:' + esc(p.focus) + '"' : "") +
          ' loading="lazy" decoding="async" />'
        );
      })
      .join("");
    return (
      '<section class="pets-band" aria-label="' +
      esc(label) +
      '">' +
      '<span class="pets-band-pill pets-band-top"><span class="paw-ico" aria-hidden="true"></span>' +
      esc(label) +
      "</span>" +
      '<div class="pets-band-row">' +
      imgs +
      "</div>" +
      '<a class="pets-band-pill pets-band-bottom" href="gallery.html">' +
      esc(h.petsCta || "See all photos") +
      "</a></section>"
    );
  }

  /** Home page: sections below the first screen fade in gently as they scroll into view */
  function wireReveal(root) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var pending = [];
    root.querySelectorAll(".pets-band, .section").forEach(function (sec) {
      // Anything already on the first screen stays as it is, so nothing flashes on load.
      if (sec.getBoundingClientRect().top < window.innerHeight) return;
      sec.classList.add("reveal");
      pending.push(sec);
    });
    if (!pending.length) return;
    // Plain position check on scroll: a section shows as soon as its top edge is on screen,
    // and anything the visitor has already scrolled past is shown too, so nothing can stay hidden.
    function check() {
      var line = window.innerHeight * 0.94;
      pending = pending.filter(function (sec) {
        if (sec.getBoundingClientRect().top > line) return true;
        sec.classList.add("in");
        return false;
      });
      if (!pending.length) {
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    check();
  }

  /** Home section for recurring weekly dog walks */
  function weeklySection(h, biz) {
    if (!h.weeklyTitle) return "";
    var bullets = (h.weeklyBullets || [])
      .map(function (b) {
        return "<li>" + esc(b) + "</li>";
      })
      .join("");
    var textBtn =
      biz.smsHref && h.weeklyCtaText
        ? '<a class="btn btn-secondary" href="' +
          esc(biz.smsHref) +
          '">' +
          esc(h.weeklyCtaText) +
          "</a>"
        : "";
    return (
      '<section class="section section-tight" id="weekly-walks"><div class="container"><div class="area-banner weekly-band">' +
      '<span class="section-label">' +
      esc(h.weeklyLabel) +
      "</span><h2>" +
      esc(h.weeklyTitle) +
      '</h2><p class="lead" style="margin:0.75rem auto 0">' +
      esc(h.weeklyLead) +
      '</p><ul class="checklist weekly-list">' +
      bullets +
      '</ul><div class="btn-row" style="justify-content:center">' +
      '<a class="btn btn-primary" href="contact.html">' +
      esc(h.weeklyCta || "Ask about weekly walks") +
      "</a>" +
      textBtn +
      "</div></div></div></section>"
    );
  }

  function renderFooter(biz) {
    var year = new Date().getFullYear();
    return (
      '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid">' +
      '<div class="footer-brand">' +
      '<img src="' +
      esc(biz.logoSmall || biz.logo || "assets/logo-main.png") +
      '" alt="" width="240" height="240" loading="lazy" decoding="async" />' +
      "<div><h3>" +
      esc(biz.name) +
      "</h3><p>" +
      esc(biz.tagline) +
      "</p></div></div>" +
      "<div><h4>Explore</h4><ul>" +
      "<li><a href=\"index.html\">Home</a></li>" +
      "<li><a href=\"about.html\">About</a></li>" +
      "<li><a href=\"services.html\">Services</a></li>" +
      "<li><a href=\"training.html\">Certificates</a></li>" +
      "<li><a href=\"gallery.html\">Gallery</a></li>" +
      "<li><a href=\"contact.html\">Contact</a></li>" +
      "</ul></div>" +
      "<div><h4>Contact</h4><ul>" +
      '<li><a href="' +
      esc(biz.phoneHref) +
      '">' +
      esc(biz.phone) +
      "</a></li>" +
      '<li><a href="mailto:' +
      esc(biz.email) +
      '">' +
      esc(biz.email) +
      "</a></li>" +
      "<li>" +
      esc(biz.owner) +
      "</li>" +
      socialItems(biz) +
      "</ul></div></div>" +
      '<div class="footer-bottom"><span>© ' +
      year +
      " " +
      esc(biz.name) +
      ". All rights reserved.</span>" +
      "<span>Made with ♥ for pets & their people</span></div>" +
      "</div></footer>"
    );
  }

  function formatPriceBlock(s) {
    var note = s.priceNote ? String(s.priceNote).trim() : "";
    var unit = s.priceUnit ? String(s.priceUnit).trim() : "";
    var amount = s.price ? String(s.price).trim() : "";
    if (!note && !unit) {
      return (
        '<div class="price-block price-block-solo">' +
        '<span class="price-amount">' +
        esc(amount) +
        "</span></div>"
      );
    }
    return (
      '<div class="price-block">' +
      (note
        ? '<span class="price-prefix">' + esc(note) + "</span>"
        : "") +
      '<span class="price-amount">' +
      esc(amount) +
      "</span>" +
      (unit
        ? '<span class="price-unit">' + esc(unit) + "</span>"
        : "") +
      "</div>"
    );
  }

  function priceLabel(s) {
    var parts = [];
    if (s.priceNote) parts.push(String(s.priceNote).toLowerCase());
    if (s.price) parts.push(s.price);
    if (s.priceUnit) parts.push(s.priceUnit);
    return parts.join(" ");
  }

  function serviceCard(s, longDesc, biz) {
    var desc = longDesc ? s.descriptionLong || s.description : s.description;
    var emphasis =
      longDesc && s.descriptionEmphasis
        ? "<strong>" + esc(s.descriptionEmphasis) + "</strong> "
        : !longDesc && s.descriptionEmphasis
          ? '<span class="service-chip">' +
            esc(s.descriptionEmphasis) +
            "</span>"
          : "";
    var book = bookAttrs(biz || {});
    var btnLabel = s.button || "View Availability";
    var btn =
      '<a class="btn btn-primary" href="' +
      esc(book.href) +
      '"' +
      book.target +
      ">" +
      esc(btnLabel) +
      "</a>";
    var cardClass = longDesc
      ? "price-card price-card-detail"
      : "price-card price-card-compact";
    return (
      '<article class="' +
      cardClass +
      '">' +
      '<img class="service-photo" src="' +
      esc(s.image) +
      '" alt="' +
      esc(s.name) +
      '" loading="lazy" decoding="async" />' +
      "<h3>" +
      esc(s.name) +
      "</h3>" +
      formatPriceBlock(s) +
      (emphasis && longDesc
        ? "<p>" + emphasis + esc(desc) + "</p>"
        : emphasis && !longDesc
          ? emphasis + "<p>" + esc(desc) + "</p>"
          : "<p>" + esc(desc) + "</p>") +
      btn +
      "</article>"
    );
  }

  /** Services page: price list on top, then one block per service (photo rows on wide screens, opening rows on phones) */
  function servicesList(data, p, biz) {
    var list = data.services || [];
    var book = bookAttrs(biz || {});
    var hasDigit = function (s) {
      return /\d/.test(String(s.price || ""));
    };
    var extraNote =
      p.extraPets && p.extraPets.length
        ? '<div class="svc-extra-note"><strong>' +
          esc(p.extraPetsTitle || "Additional pets") +
          "</strong>" +
          p.extraPets
            .map(function (x) {
              return "<div><b>" + esc(x.amount) + "</b><span>" + esc(x.services) + "</span></div>";
            })
            .join("") +
          "</div>"
        : "";
    var menu =
      '<nav class="svc-menu" aria-label="' +
      esc(p.pricesTitle || "Prices") +
      '"><h2>' +
      esc(p.pricesTitle || "Prices") +
      "</h2>" +
      list
        .map(function (s) {
          return (
            '<a href="#svc-' +
            esc(s.id) +
            '"><span>' +
            esc(s.name) +
            '</span><i aria-hidden="true"></i><em>' +
            (s.priceNote ? "<small>from </small>" : "") +
            esc(s.price) +
            (s.priceUnit ? " <small>" + esc(s.priceUnit) + "</small>" : "") +
            "</em></a>"
          );
        })
        .join("") +
      extraNote +
      (p.pricesHint ? "<p>" + esc(p.pricesHint) + "</p>" : "") +
      "</nav>";
    var items = list
      .map(function (s, i) {
        var open = i === 0;
        var pts = (s.points || [])
          .map(function (t) {
            return "<li>" + esc(t) + "</li>";
          })
          .join("");
        var note = s.priceNote ? "<small>" + esc(s.priceNote) + "</small>" : "";
        var unit = s.priceUnit ? "<span>" + esc(s.priceUnit) + "</span>" : "";
        var word = hasDigit(s) ? "" : " svc-price-word";
        return (
          '<article class="svc' +
          (open ? " is-open" : "") +
          (s.extraPet ? " svc-has-extra" : "") +
          '" id="svc-' +
          esc(s.id) +
          '">' +
          '<h3 class="svc-head-h"><button class="svc-head" type="button" aria-expanded="' +
          (open ? "true" : "false") +
          '" aria-controls="svc-body-' +
          esc(s.id) +
          '"><img class="svc-thumb" src="' +
          esc(s.image) +
          '" alt="" loading="lazy" decoding="async" />' +
          '<span class="svc-head-name">' +
          esc(s.name) +
          '</span><span class="svc-head-price' +
          word +
          '">' +
          note +
          "<b>" +
          esc(s.priceBadge || s.price) +
          "</b>" +
          unit +
          (s.extraPet
            ? '<span class="svc-head-extra">' + esc(s.extraPet) + " " + esc(p.extraPetShort || "extra pet") + "</span>"
            : "") +
          '</span><span class="svc-chev" aria-hidden="true"></span></button></h3>' +
          '<div class="svc-body" id="svc-body-' +
          esc(s.id) +
          '"><div class="svc-pic"><img class="svc-photo" src="' +
          esc(s.image) +
          '" alt="' +
          esc(s.name) +
          '" loading="lazy" decoding="async" /><div class="svc-badge' +
          word +
          '">' +
          note +
          "<b>" +
          esc(s.priceBadge || s.price) +
          "</b>" +
          unit +
          '</div></div><div class="svc-text"><h3 class="svc-title">' +
          esc(s.name) +
          "</h3>" +
          (s.extraPet
            ? '<p class="svc-extra">' + esc(s.extraPet) + " " + esc(p.extraPetLabel || "per extra pet") + "</p>"
            : "") +
          (pts ? '<ul class="svc-points">' + pts + "</ul>" : "") +
          (pts && s.descriptionLong
            ? '<details class="svc-more"><summary>' +
              esc(p.readMoreLabel || "Read more") +
              "</summary><p>" +
              esc(s.descriptionLong) +
              "</p></details>"
            : '<p class="svc-long">' + esc(s.descriptionLong || s.description) + "</p>") +
          '<a class="btn btn-primary" href="' +
          esc(book.href) +
          '"' +
          book.target +
          ">" +
          esc(s.button || "View Availability") +
          "</a></div></div></article>"
        );
      })
      .join("");
    return (
      '<section class="section section-tight"><div class="container">' +
      menu +
      '<div class="svc-list">' +
      items +
      "</div></div></section>"
    );
  }

  /** Services page: rows open and close on phones; a price-list line jumps to its service and opens it */
  function wireServices(root) {
    function setOpen(item, open) {
      item.classList.toggle("is-open", open);
      var b = item.querySelector(".svc-head");
      if (b) b.setAttribute("aria-expanded", open ? "true" : "false");
    }
    function goTo(item, smooth) {
      setOpen(item, true);
      var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      item.scrollIntoView({ behavior: smooth && !calm ? "smooth" : "auto", block: "start" });
    }
    root.addEventListener("click", function (e) {
      var t = e.target;
      var head = t.closest && t.closest(".svc-head");
      if (head) {
        var item = head.closest(".svc");
        setOpen(item, !item.classList.contains("is-open"));
        return;
      }
      var link = t.closest && t.closest(".svc-menu a");
      if (!link) return;
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (!target) return;
      e.preventDefault();
      goTo(target, true);
      if (window.history && history.replaceState) history.replaceState(null, "", link.getAttribute("href"));
    });
    if (/^#svc-/.test(location.hash)) {
      var first = document.getElementById(location.hash.slice(1));
      if (first) goTo(first, false);
    }
  }

  function cityChips(cities) {
    return (cities || [])
      .map(function (c) {
        return '<span class="city-chip">' + esc(c) + "</span>";
      })
      .join("");
  }

  function processSteps(steps) {
    return (steps || [])
      .map(function (p) {
        return (
          '<article class="process-step"><div class="step-num">' +
          esc(p.num) +
          "</div><h3>" +
          esc(p.title) +
          "</h3><p>" +
          esc(p.text) +
          "</p></article>"
        );
      })
      .join("");
  }

  /** Home page: lavender card inviting past clients to leave a Google review */
  function reviewInvite(h) {
    if (!h.reviewInviteUrl) return "";
    var g = function (px) {
      return (
        '<svg class="rv-g" width="' + px + '" height="' + px + '" viewBox="0 0 48 48" aria-hidden="true">' +
        '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
        '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
        '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
        '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>'
      );
    };
    return (
      '<div class="review-invite"><div class="review-invite-badge">' +
      g(40) +
      '</div><div class="review-invite-text"><div class="stars" aria-hidden="true">★★★★★</div><h3>' +
      esc(h.reviewInviteTitle) +
      "</h3><p>" +
      esc(h.reviewInviteText) +
      '</p></div><a class="btn btn-primary review-invite-btn" href="' +
      esc(h.reviewInviteUrl) +
      '" target="_blank" rel="noopener">' +
      g(20) +
      esc(h.reviewInviteButton) +
      "</a></div>"
    );
  }

  function reviewCards(reviews, limit) {
    var list = reviews || [];
    if (limit) list = list.slice(0, limit);
    return list
      .map(function (r) {
        return (
          '<article class="review-card"><div class="stars" aria-hidden="true">★★★★★</div>' +
          "<blockquote>“" +
          esc(r.quote) +
          "”</blockquote>" +
          "<cite>— " +
          esc(r.author) +
          "</cite></article>"
        );
      })
      .join("");
  }

  function wireNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav-list");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /** Phones and tablets can send a text message straight from a link; most computers cannot. */
  function canText(biz) {
    if (!biz || !biz.smsHref) return false;
    var coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    var mobileUa = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
    return coarse || mobileUa || window.innerWidth <= 700;
  }

  /** sms: link with the message already typed (works on iPhone and Android) */
  function smsLink(biz, text) {
    return biz.smsHref + "?&body=" + encodeURIComponent(text || "");
  }

  function wireContactForm(biz, c) {
    var form = document.getElementById("contact-form");
    if (!form) return;
    c = c || {};
    var textBtn = form.querySelector(".form-send-text");
    var emailBtn = form.querySelector(".form-send-email");
    var hint = document.getElementById("form-hint");
    var mode = "text";
    if (!canText(biz)) {
      // Computer: email is the main button, the text button is hidden
      mode = "email";
      if (textBtn) textBtn.style.display = "none";
      if (emailBtn) emailBtn.className = "btn btn-primary form-send-email";
      if (hint && c.formHintEmail) hint.textContent = c.formHintEmail;
    }
    [textBtn, emailBtn].forEach(function (btn) {
      if (!btn) return;
      btn.addEventListener("click", function () {
        mode = btn.getAttribute("data-send");
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.querySelector('[name="name"]') || {}).value || "";
      var email = (form.querySelector('[name="email"]') || {}).value || "";
      var phone = (form.querySelector('[name="phone"]') || {}).value || "";
      var service = (form.querySelector('[name="service"]') || {}).value || "";
      var message = (form.querySelector('[name="message"]') || {}).value || "";
      var success = document.getElementById("form-success");
      if (mode === "text") {
        var text =
          "Hi Amber! This is " +
          name +
          ". I'm interested in: " +
          service +
          ".\n" +
          message +
          (phone ? "\nBest phone: " + phone : "") +
          (email ? "\nEmail: " + email : "");
        window.location.href = smsLink(biz, text);
        if (success)
          success.textContent =
            "Your text is ready in your messages app—hit send when it looks good!";
      } else {
        var subject = encodeURIComponent("Pet care inquiry from " + name);
        var body = encodeURIComponent(
          "Name: " +
            name +
            "\nEmail: " +
            email +
            "\nPhone: " +
            phone +
            "\nService: " +
            service +
            "\n\n" +
            message
        );
        window.location.href =
          "mailto:" + biz.email + "?subject=" + subject + "&body=" + body;
        if (success)
          success.textContent =
            "Your email draft should be ready—hit send when it looks good!";
      }
      if (success) success.classList.add("show");
    });
  }

  /** Phone-only bar fixed to the bottom of the screen: Book online + Text Amber */
  function addMobileBar(biz, c) {
    if (document.getElementById("mobile-cta")) return;
    var book = bookAttrs(biz);
    var textBtn = biz.smsHref
      ? '<a class="btn btn-secondary" href="' +
        esc(smsLink(biz, biz.textGreeting || "")) +
        '">' +
        esc((c && c.textCta) || "Text Amber") +
        "</a>"
      : "";
    document.body.insertAdjacentHTML(
      "beforeend",
      '<div class="mobile-cta" id="mobile-cta">' +
        '<a class="btn btn-primary" href="' +
        esc(book.href) +
        '"' +
        book.target +
        '><span class="paw-ico" aria-hidden="true"></span>' +
        esc(book.label) +
        "</a>" +
        textBtn +
        "</div>"
    );
    document.body.classList.add("has-mobile-cta");
    var bar = document.getElementById("mobile-cta");
    // Appears once the visitor has scrolled past the first buttons on the page
    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      bar.classList.toggle("show", y > 320);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function fillHome(data) {
    var h = data.home;
    var biz = data.business;
    var root = document.getElementById("page-root");
    if (!root) return;

    var book = bookAttrs(biz);
    var allServices = data.services || [];
    var featured = allServices.filter(function (s) {
      return s.featured;
    });
    if (!featured.length) featured = allServices.slice(0, 4);
    var servicesHtml = featured
      .map(function (s) {
        return serviceCard(s, false, biz);
      })
      .join("");

    root.innerHTML =
      sloganRibbon(h) +
      '<section class="hero"><div class="container hero-grid">' +
      '<div class="hero-copy">' +
      '<div class="hero-badge">' +
      esc(h.badge) +
      "</div>" +
      "<h1>" +
      esc(h.title) +
      " <em>" +
      esc(h.titleEm) +
      "</em></h1>" +
      (h.offer ? '<p class="hero-offer">' + esc(h.offer) + "</p>" : "") +
      '<p class="lead">' +
      esc(h.lead) +
      "</p>" +
      '<div class="btn-row">' +
      '<a class="btn btn-primary" href="' +
      esc(book.href) +
      '"' +
      book.target +
      ">" +
      esc(h.ctaPrimary) +
      "</a>" +
      '<a class="btn btn-secondary" href="services.html">' +
      esc(h.ctaSecondary) +
      "</a></div>" +
      trustList(h.trust) +
      "</div>" +
      '<div class="hero-card"><img src="' +
      esc(biz.logo) +
      '" alt="' +
      esc(biz.name) +
      '" /></div></div></section>' +
      petsBand(h) +
      '<section class="section section-tight" id="services"><div class="container text-center">' +
      '<span class="section-label">' +
      esc(h.servicesLabel) +
      "</span><h2>" +
      esc(h.servicesTitle) +
      '</h2><p class="lead">' +
      esc(h.servicesLead) +
      '</p><div class="price-grid price-grid-featured">' +
      servicesHtml +
      "</div>" +
      '<div class="btn-row" style="justify-content:center">' +
      '<a class="btn btn-secondary" href="services.html">See all services</a>' +
      '<a class="btn btn-primary" href="' +
      esc(book.href) +
      '"' +
      book.target +
      ">View Availability</a></div></div></section>" +
      weeklySection(h, biz) +
      '<section class="section area-sec"><div class="container"><div class="area-banner">' +
      '<span class="section-label">' +
      esc(h.areaLabel) +
      "</span><h2>" +
      esc(h.areaTitle) +
      '</h2><p class="lead" style="margin:0.75rem auto 0">' +
      esc(h.areaLead) +
      '</p><p style="margin-top:1.25rem;font-weight:800;color:var(--purple-deep)">' +
      esc(h.areaSubtitle) +
      '</p><div class="city-grid">' +
      cityChips(data.cities) +
      '</div><p style="margin-top:1.75rem;color:var(--text-muted)">' +
      esc(h.areaNote) +
      '</p><div class="btn-row" style="justify-content:center;margin-top:1rem">' +
      '<a class="btn btn-primary" href="contact.html">' +
      esc(h.areaCta) +
      "</a></div></div></div></section>" +
      '<section class="section section-tight process-sec"><div class="container text-center">' +
      '<span class="section-label">' +
      esc(h.processLabel) +
      "</span><h2>" +
      esc(h.processTitle) +
      '</h2><p class="lead">' +
      esc(h.processLead) +
      '</p><div class="process-grid">' +
      processSteps(data.process) +
      "</div></div></section>" +
      '<section class="section reviews-sec"><div class="container text-center">' +
      '<span class="section-label">' +
      esc(h.reviewsLabel) +
      "</span><h2>" +
      esc(h.reviewsTitle) +
      '</h2><div class="review-grid">' +
      reviewCards(data.reviews) +
      "</div>" +
      reviewInvite(h) +
      "</div></section>" +
      '<section class="section section-tight"><div class="container"><div class="cta-band">' +
      "<h2>" +
      esc(h.ctaBandTitle) +
      "</h2><p>" +
      esc(h.ctaBandLead) +
      '</p><div class="btn-row">' +
      '<a class="btn btn-primary" href="' +
      esc(book.href) +
      '"' +
      book.target +
      ">" +
      esc(h.ctaBandPrimary) +
      "</a>" +
      '<a class="btn btn-secondary" href="' +
      esc(biz.phoneHref) +
      '">' +
      esc(h.ctaBandSecondary) +
      "</a></div></div></div></section>";
    wireReveal(root);
  }

  /** About page: photo, facts and pet photos beside Amber's story in headed parts */
  function aboutBlock(data, a, biz, book) {
    var story = a.ownerStory || [];
    var parts = a.storyParts && a.storyParts.length ? a.storyParts : [{ title: "", paragraphs: story.length }];
    var at = 0;
    var partsHtml = parts
      .map(function (p) {
        var ps = story.slice(at, at + (p.paragraphs || 0));
        at += p.paragraphs || 0;
        if (!ps.length) return "";
        return (
          '<div class="about-v2-part">' +
          (p.title ? "<h3>" + esc(p.title) + "</h3>" : "") +
          ps
            .map(function (t) {
              return "<p>" + esc(t) + "</p>";
            })
            .join("") +
          "</div>"
        );
      })
      .join("");
    // any paragraphs the parts did not cover still show
    var rest = story
      .slice(at)
      .map(function (t) {
        return "<p>" + esc(t) + "</p>";
      })
      .join("");
    if (rest) partsHtml += '<div class="about-v2-part">' + rest + "</div>";
    var facts = (a.facts || [])
      .map(function (t) {
        return "<li>" + esc(t) + "</li>";
      })
      .join("");
    var pets = ((data.home && data.home.petsPhotos) || [])
      .slice(0, 4)
      .map(function (p) {
        return (
          '<img src="' +
          esc(p.src) +
          '" alt="' +
          esc(p.alt || "Happy pet") +
          '"' +
          (p.focus ? ' style="object-position:' + esc(p.focus) + '"' : "") +
          ' loading="lazy" decoding="async" />'
        );
      })
      .join("");
    var bullets = (a.bullets || [])
      .map(function (b) {
        return "<li>" + esc(b) + "</li>";
      })
      .join("");
    return (
      '<section class="section section-tight"><div class="container about-v2">' +
      '<div class="about-v2-side">' +
      (a.ownerPhoto
        ? '<img class="about-v2-photo" src="' +
          esc(a.ownerPhoto) +
          '" alt="' +
          esc(a.ownerPhotoAlt || a.ownerLabel || biz.name) +
          '" />'
        : "") +
      (facts
        ? '<div class="about-v2-box about-v2-factsbox"><h3>' +
          esc(a.factsTitle || "At a glance") +
          '</h3><ul class="about-v2-facts">' +
          facts +
          "</ul></div>"
        : "") +
      (pets
        ? '<div class="about-v2-box about-v2-petsbox"><h3>' +
          esc(a.petsTitle || "Pets I've watched") +
          '</h3><div class="about-v2-pets">' +
          pets +
          '</div><a class="about-v2-more" href="gallery.html">' +
          esc(a.petsCta || "See all photos") +
          " →</a></div>"
        : "") +
      "</div>" +
      '<div class="about-v2-main"><span class="about-v2-label">' +
      esc(a.ownerLabel) +
      "</span><h2>" +
      esc(a.ownerTitle) +
      '</h2><p class="about-v2-bio">' +
      esc(a.ownerBio) +
      '</p><div class="about-v2-btns">' +
      '<a class="btn btn-primary" href="' +
      esc(book.href) +
      '"' +
      book.target +
      ">Book a consultation</a>" +
      '<a class="btn btn-secondary" href="services.html">View services</a></div>' +
      partsHtml +
      (a.ownerSignOff ? '<p class="about-v2-sign">' + esc(a.ownerSignOff) + "</p>" : "") +
      (a.ownerSignature ? '<p class="about-v2-signature">' + esc(a.ownerSignature) + "</p>" : "") +
      (bullets ? '<ul class="about-v2-check">' + bullets + "</ul>" : "") +
      "</div></div></section>"
    );
  }

  function fillAbout(data) {
    var a = data.about;
    var biz = data.business;
    var book = bookAttrs(biz);
    var root = document.getElementById("page-root");
    var bullets = (a.bullets || [])
      .map(function (b) {
        return "<li>" + esc(b) + "</li>";
      })
      .join("");
    var story = (a.ownerStory || [])
      .map(function (p) {
        return '<p class="about-story-p">' + esc(p) + "</p>";
      })
      .join("");
    var signOff = a.ownerSignOff
      ? '<p class="about-signoff">' + esc(a.ownerSignOff) + "</p>"
      : "";
    var signature = a.ownerSignature
      ? '<p class="about-signature">' + esc(a.ownerSignature) + "</p>"
      : "";
    var aboutImg = a.ownerPhoto || biz.logo;
    var aboutImgAlt = a.ownerPhotoAlt || a.ownerLabel || biz.name;
    var aboutPhotoBlock = a.ownerPhoto
      ? '<div class="about-photo-wrap">' +
        '<img class="about-photo" src="' +
        esc(a.ownerPhoto) +
        '" alt="' +
        esc(aboutImgAlt) +
        '" />' +
        "</div>"
      : "";

    root.innerHTML =
      '<section class="page-hero"><div class="container">' +
      '<span class="section-label">' +
      esc(a.label) +
      "</span><h1>" +
      esc(a.title) +
      '</h1><p class="lead">' +
      esc(a.lead) +
      "</p></div></section>" +
      aboutBlock(data, a, biz, book) +
      '<section class="section about-reviews"><div class="container text-center">' +
      '<span class="section-label">' +
      esc(a.reviewsLabel) +
      "</span><h2>" +
      esc(a.reviewsTitle) +
      '</h2><div class="review-grid">' +
      reviewCards(data.reviews, 3) +
      '</div><div class="btn-row" style="justify-content:center">' +
      '<a class="btn btn-secondary" href="services.html">See all services</a></div></div></section>' +
      '<section class="section section-tight"><div class="container"><div class="area-banner">' +
      '<span class="section-label">' +
      esc(a.areaLabel) +
      "</span><h2>" +
      esc(a.areaTitle) +
      '</h2><p class="lead" style="margin:0.75rem auto 0">' +
      esc(a.areaLead) +
      '</p><div class="city-grid">' +
      cityChips(data.cities) +
      "</div></div></div></section>";
  }

  function fillServices(data) {
    var p = data.servicesPage;
    var biz = data.business;
    var book = bookAttrs(biz);
    var root = document.getElementById("page-root");
    root.innerHTML =
      '<section class="page-hero"><div class="container">' +
      '<span class="section-label">' +
      esc(p.label) +
      "</span><h1>" +
      esc(p.title) +
      '</h1><p class="lead">' +
      esc(p.lead) +
      "</p></div></section>" +
      servicesList(data, p, biz) +
      '<section class="section"><div class="container text-center">' +
      '<span class="section-label">' +
      esc(p.processLabel) +
      "</span><h2>" +
      esc(p.processTitle) +
      '</h2><p class="lead">' +
      esc(p.processLead) +
      '</p><div class="process-grid">' +
      processSteps(data.process) +
      "</div></div></section>" +
      '<section class="section section-tight"><div class="container"><div class="cta-band">' +
      "<h2>" +
      esc(p.ctaTitle) +
      "</h2><p>" +
      esc(p.ctaLead) +
      '</p><div class="btn-row">' +
      '<a class="btn btn-primary" href="' +
      esc(book.href) +
      '"' +
      book.target +
      ">Book a consultation</a>" +
      '<a class="btn btn-secondary" href="' +
      esc(biz.phoneHref) +
      '">' +
      esc(biz.phone) +
      "</a></div></div></div></section>";
    wireServices(root);
  }

  function fillContact(data) {
    var c = data.contactPage;
    var biz = data.business;
    var book = bookAttrs(biz);
    var hasBooking = !!(biz.bookingUrl && String(biz.bookingUrl).trim());
    var root = document.getElementById("page-root");
    var options = (data.services || [])
      .map(function (s) {
        var detail = priceLabel(s);
        var label = detail ? s.name + " (" + detail + ")" : s.name;
        return (
          '<option value="' +
          esc(s.name) +
          '">' +
          esc(label) +
          "</option>"
        );
      })
      .join("");
    options +=
      '<option value="Not sure / consultation">Not sure / consultation</option>';

    var bookingBanner = hasBooking
      ? '<div class="container" style="margin-bottom:1.5rem"><div class="cta-band">' +
        "<h2>Book online anytime</h2>" +
        "<p>Check availability and request services through Scritches — Amber's scheduler.</p>" +
        '<div class="btn-row"><a class="btn btn-primary" href="' +
        esc(book.href) +
        '"' +
        book.target +
        ">" +
        esc(book.label) +
        "</a></div></div></div>"
      : "";

    root.innerHTML =
      '<section class="page-hero"><div class="container">' +
      '<span class="section-label">' +
      esc(c.label) +
      "</span><h1>" +
      esc(c.title) +
      '</h1><p class="lead">' +
      esc(c.lead) +
      "</p></div></section>" +
      bookingBanner +
      '<section class="section section-tight"><div class="container contact-grid">' +
      '<div class="contact-card"><h3>' +
      esc(c.cardTitle) +
      "</h3>" +
      '<div class="contact-line"><div class="icon" aria-hidden="true">📞</div><div><strong>Phone / text</strong>' +
      '<a href="' +
      esc(biz.phoneHref) +
      '">' +
      esc(biz.phone) +
      "</a></div></div>" +
      '<div class="contact-line"><div class="icon" aria-hidden="true">✉️</div><div><strong>Email</strong>' +
      '<a href="mailto:' +
      esc(biz.email) +
      '">' +
      esc(biz.email) +
      "</a></div></div>" +
      '<div class="contact-line"><div class="icon" aria-hidden="true">💜</div><div><strong>Owner</strong><span>' +
      esc(biz.owner) +
      " · " +
      esc(biz.name) +
      "</span></div></div>" +
      '<div class="contact-line"><div class="icon" aria-hidden="true">📍</div><div><strong>Service area</strong><span>North Houston & surrounding communities</span></div></div>' +
      (biz.social && biz.social.length
        ? '<div class="contact-line"><div class="icon" aria-hidden="true">📷</div><div><strong>Follow along</strong>' +
          '<ul class="contact-social">' +
          socialItems(biz) +
          "</ul></div></div>"
        : "") +
      (biz.smsHref && c.textCta
        ? '<div class="btn-row contact-quick"><a class="btn btn-primary" href="' +
          esc(biz.smsHref) +
          '">' +
          esc(c.textCta) +
          '</a><a class="btn btn-secondary" href="' +
          esc(biz.phoneHref) +
          '">Call</a></div>'
        : "") +
      '<p class="form-note" style="margin-top:1rem">' +
      esc(c.locationNote) +
      '</p><p class="form-note">' +
      esc((data.cities || []).join(" · ")) +
      "</p></div>" +
      '<div class="contact-card"><h3>' +
      esc(c.formTitle) +
      '</h3><form id="contact-form" class="contact-form">' +
      '<div class="field"><label for="name">Your name</label><input id="name" name="name" type="text" required autocomplete="name" /></div>' +
      '<div class="field"><label for="email">Email <span class="optional">(optional)</span></label><input id="email" name="email" type="email" autocomplete="email" /></div>' +
      '<div class="field"><label for="phone">Phone <span class="optional">(optional)</span></label><input id="phone" name="phone" type="tel" autocomplete="tel" /></div>' +
      '<div class="field"><label for="service">Service interested in</label><select id="service" name="service">' +
      options +
      "</select></div>" +
      '<div class="field"><label for="message">Tell me about your pets & location</label>' +
      '<textarea id="message" name="message" required placeholder="Pet names, city, dates needed..."></textarea></div>' +
      '<div class="btn-row form-actions">' +
      '<button class="btn btn-primary form-send-text" type="submit" data-send="text">' +
      esc(c.formTextBtn || "Send as a text") +
      "</button>" +
      '<button class="btn btn-secondary form-send-email" type="submit" data-send="email">' +
      esc(c.formEmailBtn || "Send by email") +
      "</button></div>" +
      '<p class="form-note" id="form-hint">' +
      esc(c.formHint) +
      '</p><div id="form-success" class="form-success" role="status"></div>' +
      "</form></div></div></section>";
  }

  function fillGallery(data) {
    var g = data.galleryPage;
    var biz = data.business;
    var book = bookAttrs(biz);
    var root = document.getElementById("page-root");
    var items = data.gallery || [];
    var tiles =
      items.length > 0
        ? items
            .map(function (item) {
              return (
                '<div class="gallery-tile gallery-tile-photo">' +
                '<img src="' +
                esc(item.src) +
                '" alt="' +
                esc(item.alt || "Happy pet") +
                '"' +
                (item.focus ? ' style="object-position:' + esc(item.focus) + '"' : "") +
                ' loading="lazy" decoding="async" />' +
                "</div>"
              );
            })
            .join("")
        : '<div class="gallery-tile">🐾 Client photo coming soon</div>' +
          '<div class="gallery-tile">📸 Walk-time smiles</div>' +
          '<div class="gallery-tile">🏠 Cozy sit visits</div>';
    root.innerHTML =
      '<section class="page-hero"><div class="container">' +
      '<span class="section-label">' +
      esc(g.label) +
      "</span><h1>" +
      esc(g.title) +
      '</h1><p class="lead">' +
      esc(g.lead) +
      "</p></div></section>" +
      '<section class="section section-tight"><div class="container">' +
      '<div class="gallery-grid">' +
      tiles +
      '</div><div class="btn-row" style="justify-content:center;margin-top:2rem">' +
      '<a class="btn btn-primary" href="' +
      esc(book.href) +
      '"' +
      book.target +
      ">Book a Visit</a></div></div></section>";
  }

  function certCard(c, idx) {
    var meta = [];
    if (c.completed)
      meta.push(
        '<li><span>Completed</span><strong>' + esc(c.completed) + "</strong></li>"
      );
    if (c.expires)
      meta.push(
        '<li><span>Valid through</span><strong>' + esc(c.expires) + "</strong></li>"
      );
    if (c.verifyId)
      meta.push(
        '<li><span>Certificate ID</span><strong>' + esc(c.verifyId) + "</strong></li>"
      );
    var actions =
      '<button class="btn btn-primary cert-open" type="button" data-cert="' +
      idx +
      '">View certificate</button>';
    if (c.pdf)
      actions +=
        '<a class="btn btn-secondary" href="' +
        esc(c.pdf) +
        '" target="_blank" rel="noopener noreferrer">Download PDF</a>';
    if (c.verifyUrl)
      actions +=
        '<a class="btn btn-secondary" href="' +
        esc(c.verifyUrl) +
        '" target="_blank" rel="noopener noreferrer">Verify online</a>';
    return (
      '<article class="cert-card">' +
      '<button class="cert-preview cert-open" type="button" data-cert="' +
      idx +
      '" aria-label="View ' +
      esc(c.title) +
      ' certificate full size">' +
      '<img src="' +
      esc(c.image) +
      '" alt="' +
      esc(c.alt || c.title) +
      '" loading="lazy" />' +
      '<span class="cert-zoom" aria-hidden="true">🔍 Click to enlarge</span>' +
      "</button>" +
      '<div class="cert-body">' +
      '<span class="cert-type">' +
      esc(c.type || "Certificate") +
      "</span>" +
      "<h3>" +
      esc(c.title) +
      "</h3>" +
      '<p class="cert-issuer">' +
      (c.logo
        ? '<img class="cert-logo" src="' + esc(c.logo) + '" alt="" />'
        : "") +
      "<span>" +
      esc(c.issuer) +
      "</span></p>" +
      "<p>" +
      esc(c.description) +
      "</p>" +
      (meta.length ? '<ul class="cert-meta">' + meta.join("") + "</ul>" : "") +
      '<div class="btn-row cert-actions">' +
      actions +
      "</div></div></article>"
    );
  }

  function wireCertLightbox(certs) {
    var box = document.getElementById("cert-lightbox");
    if (!box) return;
    var img = box.querySelector(".cert-lightbox-img");
    var cap = box.querySelector(".cert-lightbox-cap");
    var closeBtn = box.querySelector(".cert-lightbox-close");
    var lastFocus = null;

    function open(i) {
      var c = certs[i];
      if (!c) return;
      lastFocus = document.activeElement;
      img.src = c.image;
      img.alt = c.alt || c.title;
      cap.textContent = c.title + " — " + c.issuer;
      box.classList.add("open");
      box.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      closeBtn.focus();
    }

    function close() {
      box.classList.remove("open");
      box.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
      img.removeAttribute("src");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.querySelectorAll(".cert-open").forEach(function (btn) {
      btn.addEventListener("click", function () {
        open(parseInt(btn.getAttribute("data-cert"), 10));
      });
    });
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target === closeBtn) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && box.classList.contains("open")) close();
    });
  }

  function fillTraining(data) {
    var t = data.trainingPage || {};
    var biz = data.business;
    var book = bookAttrs(biz);
    var root = document.getElementById("page-root");
    var certs = data.certificates || [];
    var cards = certs
      .map(function (c, i) {
        return certCard(c, i);
      })
      .join("");

    root.innerHTML =
      '<section class="page-hero"><div class="container">' +
      '<span class="section-label">' +
      esc(t.label) +
      "</span><h1>" +
      esc(t.title) +
      '</h1><p class="lead">' +
      esc(t.lead) +
      "</p></div></section>" +
      '<section class="section section-tight"><div class="container text-center">' +
      '<span class="section-label">' +
      esc(t.certsLabel) +
      "</span><h2>" +
      esc(t.certsTitle) +
      '</h2><p class="lead">' +
      esc(t.certsLead) +
      '</p><div class="cert-grid">' +
      cards +
      "</div></div></section>" +
      '<section class="section section-tight"><div class="container"><div class="area-banner">' +
      '<span class="section-label">' +
      esc(t.learningLabel) +
      "</span><h2>" +
      esc(t.learningTitle) +
      '</h2><p class="lead" style="margin:0.75rem auto 0">' +
      esc(t.learningText) +
      "</p></div></div></section>" +
      '<section class="section section-tight"><div class="container"><div class="cta-band">' +
      "<h2>" +
      esc(t.ctaTitle) +
      "</h2><p>" +
      esc(t.ctaLead) +
      '</p><div class="btn-row">' +
      '<a class="btn btn-primary" href="' +
      esc(book.href) +
      '"' +
      book.target +
      ">Book a consultation</a>" +
      '<a class="btn btn-secondary" href="contact.html">Contact Amber</a>' +
      "</div></div></div></section>" +
      '<div id="cert-lightbox" class="cert-lightbox" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Certificate viewer">' +
      '<button class="cert-lightbox-close" type="button" aria-label="Close">×</button>' +
      '<figure><img class="cert-lightbox-img" alt="" />' +
      '<figcaption class="cert-lightbox-cap"></figcaption></figure></div>';

    wireCertLightbox(certs);
  }

  function boot(data) {
    var biz = data.business;
    document.title =
      (PAGE === "home"
        ? (data.home && data.home.pageTitle) ||
          biz.name + " | Dog Walking & Pet Sitting"
        : PAGE === "training"
          ? "Training & Certificates | " + biz.name
          : PAGE.charAt(0).toUpperCase() + PAGE.slice(1) + " | " + biz.name);

    var headerMount = document.getElementById("site-header");
    var footerMount = document.getElementById("site-footer");
    if (headerMount) headerMount.outerHTML = renderHeader(PAGE, biz);
    if (footerMount) footerMount.outerHTML = renderFooter(biz);

    if (PAGE === "home") fillHome(data);
    else if (PAGE === "about") fillAbout(data);
    else if (PAGE === "services") fillServices(data);
    else if (PAGE === "contact") fillContact(data);
    else if (PAGE === "gallery") fillGallery(data);
    else if (PAGE === "training") fillTraining(data);

    wireNav();
    wireContactForm(biz, data.contactPage);
    addMobileBar(biz, data.contactPage);
  }

  function load() {
    // 1) Prefer embedded SITE_DATA (works when double-clicking index.html)
    // 2) If running on a real server, try content.json for fresher edits
    function fail() {
      var root = document.getElementById("page-root");
      if (root) {
        root.innerHTML =
          '<div class="container" style="padding:3rem 1rem;text-align:center;background:#fff;border-radius:16px;margin:2rem auto;max-width:640px">' +
          "<h1>Content file missing</h1>" +
          "<p>Make sure <strong>js/site-data.js</strong> is in the folder next to the other site files.</p>" +
          "<p>Or double-click <strong>Start Site.bat</strong>, then open the site from the browser link it opens.</p></div>";
      }
    }

    var isHttp = /^https?:$/i.test(window.location.protocol);

    if (isHttp) {
      fetch("data/content.json", { cache: "no-store" })
        .then(function (r) {
          if (!r.ok) throw new Error("bad status");
          return r.json();
        })
        .then(boot)
        .catch(function () {
          if (window.SITE_DATA) boot(window.SITE_DATA);
          else fail();
        });
      return;
    }

    // file:// — browsers block fetch; use embedded data only
    if (window.SITE_DATA) boot(window.SITE_DATA);
    else fail();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
