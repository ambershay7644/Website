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
        '" alt="" width="58" height="53" />' +
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
      esc(biz.logo || "assets/logo-main.png") +
      '" alt="" />' +
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
      '" />' +
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

  function wireContactForm(biz) {
    var form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.querySelector('[name="name"]') || {}).value || "";
      var email = (form.querySelector('[name="email"]') || {}).value || "";
      var phone = (form.querySelector('[name="phone"]') || {}).value || "";
      var service = (form.querySelector('[name="service"]') || {}).value || "";
      var message = (form.querySelector('[name="message"]') || {}).value || "";
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
      var success = document.getElementById("form-success");
      if (success) success.classList.add("show");
    });
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
      '<section class="section"><div class="container"><div class="area-banner">' +
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
      '<section class="section section-tight"><div class="container text-center">' +
      '<span class="section-label">' +
      esc(h.processLabel) +
      "</span><h2>" +
      esc(h.processTitle) +
      '</h2><p class="lead">' +
      esc(h.processLead) +
      '</p><div class="process-grid">' +
      processSteps(data.process) +
      "</div></div></section>" +
      '<section class="section"><div class="container text-center">' +
      '<span class="section-label">' +
      esc(h.reviewsLabel) +
      "</span><h2>" +
      esc(h.reviewsTitle) +
      '</h2><div class="review-grid">' +
      reviewCards(data.reviews) +
      "</div></div></section>" +
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
      '<section class="section section-tight"><div class="container split about-split">' +
      '<div class="split-visual about-visual"><img src="' +
      esc(aboutImg) +
      '" alt="' +
      esc(aboutImgAlt) +
      '" /></div>' +
      '<div class="split-content"><span class="section-label">' +
      esc(a.ownerLabel) +
      "</span><h2>" +
      esc(a.ownerTitle) +
      '</h2><p class="lead">' +
      esc(a.ownerBio) +
      "</p>" +
      (story
        ? '<div class="about-story">' + story + signOff + signature + "</div>"
        : "") +
      aboutPhotoBlock +
      '<ul class="checklist">' +
      bullets +
      '</ul><div class="btn-row">' +
      '<a class="btn btn-primary" href="' +
      esc(book.href) +
      '"' +
      book.target +
      ">Book a consultation</a>" +
      '<a class="btn btn-secondary" href="services.html">View services</a></div></div></div></section>' +
      '<section class="section"><div class="container text-center">' +
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
    var cards = (data.services || [])
      .map(function (s) {
        return serviceCard(s, true, biz);
      })
      .join("");

    root.innerHTML =
      '<section class="page-hero"><div class="container">' +
      '<span class="section-label">' +
      esc(p.label) +
      "</span><h1>" +
      esc(p.title) +
      '</h1><p class="lead">' +
      esc(p.lead) +
      "</p></div></section>" +
      '<section class="section section-tight"><div class="container"><div class="price-grid">' +
      cards +
      "</div></div></section>" +
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
      '<div class="field"><label for="email">Email</label><input id="email" name="email" type="email" required autocomplete="email" /></div>' +
      '<div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" autocomplete="tel" /></div>' +
      '<div class="field"><label for="service">Service interested in</label><select id="service" name="service">' +
      options +
      "</select></div>" +
      '<div class="field"><label for="message">Tell me about your pets & location</label>' +
      '<textarea id="message" name="message" required placeholder="Pet names, city, dates needed..."></textarea></div>' +
      '<button class="btn btn-primary" type="submit">Book Consultation (open email)</button>' +
      '<p class="form-note">' +
      esc(c.formHint) +
      '</p><div id="form-success" class="form-success" role="status">Your email draft should be ready—hit send when it looks good!</div>' +
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
                '" loading="lazy" />' +
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
    wireContactForm(biz);
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
