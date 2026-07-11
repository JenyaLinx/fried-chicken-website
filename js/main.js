/*=============== ELEMENTS ===============*/
const navMenu = document.getElementById("js-nav-menu");
const navToggle = document.getElementById("js-nav-toggle");
const navClose = document.getElementById("js-nav-close");
const navLinks = document.querySelectorAll(".nav-link");

const header = document.getElementById("header");
const scrollUp = document.getElementById("scroll-up");
const sections = document.querySelectorAll("section[id]");

const subscribeForm = document.querySelector(".footer__form");
const subscribeInput = document.querySelector(".footer__input");

/*=============== SHOW MENU ===============*/
const showMenu = () => {
  if (!navMenu) return;

  navMenu.classList.add("show-menu");

  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "true");
  }
};

if (navToggle) {
  navToggle.addEventListener("click", showMenu);
}

/*=============== HIDE MENU ===============*/
const hideMenu = () => {
  if (!navMenu) return;

  navMenu.classList.remove("show-menu");

  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
  }
};

if (navClose) {
  navClose.addEventListener("click", hideMenu);
}

/*=============== REMOVE MENU MOBILE ===============*/
navLinks.forEach((link) => {
  link.addEventListener("click", hideMenu);
});

/*=============== CLOSE MENU WITH ESCAPE ===============*/
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideMenu();
  }
});

/*=============== CLOSE MENU OUTSIDE ===============*/
document.addEventListener("click", (event) => {
  if (!navMenu || !navToggle) return;

  const clickedInsideMenu = navMenu.contains(event.target);
  const clickedToggle = navToggle.contains(event.target);

  if (
    navMenu.classList.contains("show-menu") &&
    !clickedInsideMenu &&
    !clickedToggle
  ) {
    hideMenu();
  }
});

/*=============== ADD SHADOW HEADER ===============*/
const shadowHeader = () => {
  if (!header) return;

  if (window.scrollY >= 50) {
    header.classList.add("shadow-header");
  } else {
    header.classList.remove("shadow-header");
  }
};

/*=============== SHOW SCROLL UP ===============*/
const showScrollUp = () => {
  if (!scrollUp) return;

  if (window.scrollY >= 200) {
    scrollUp.classList.add("show-scroll");
  } else {
    scrollUp.classList.remove("show-scroll");
  }
};

/*=============== SCROLL TO TOP ===============*/
if (scrollUp) {
  scrollUp.addEventListener("click", (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const scrollActive = () => {
  const scrollDown = window.scrollY;

  sections.forEach((currentSection) => {
    const sectionHeight = currentSection.offsetHeight;
    const sectionTop = currentSection.offsetTop - 100;
    const sectionId = currentSection.getAttribute("id");

    const currentLink = document.querySelector(
      `.nav-menu a[href="#${sectionId}"]`
    );

    if (!currentLink) return;

    const sectionIsActive =
      scrollDown >= sectionTop &&
      scrollDown < sectionTop + sectionHeight;

    if (sectionIsActive) {
      currentLink.classList.add("active-link");
    } else {
      currentLink.classList.remove("active-link");
    }
  });
};

/*=============== WINDOW SCROLL EVENTS ===============*/
const handleScroll = () => {
  shadowHeader();
  showScrollUp();
  scrollActive();
};

window.addEventListener("scroll", handleScroll, {
  passive: true,
});

handleScroll();

/*=============== SUBSCRIBE FORM ===============*/
if (subscribeForm && subscribeInput) {
  const message = document.createElement("p");

  message.classList.add("footer__message");
  message.setAttribute("aria-live", "polite");

  subscribeForm.insertAdjacentElement("afterend", message);

  subscribeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = subscribeInput.value.trim();

    if (!email) {
      message.textContent = "Please enter your email address.";
      return;
    }

    if (!subscribeInput.checkValidity()) {
      message.textContent = "Please enter a valid email address.";
      return;
    }

    message.textContent = "Thank you! You are subscribed.";
    subscribeForm.reset();
  });
}

/*=============== ORDER BUTTONS ===============*/
const orderButtons = document.querySelectorAll(".order__button");

orderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".order__card");
    const productTitle =
      card?.querySelector(".order__title")?.textContent.trim() || "Product";

    button.classList.add("order__button--added");
    button.setAttribute("aria-label", `${productTitle} added to cart`);

    const icon = button.querySelector("i");

    if (icon) {
      icon.className = "ri-check-line";
    }

    setTimeout(() => {
      button.classList.remove("order__button--added");
      button.setAttribute(
        "aria-label",
        `Add ${productTitle} to cart`
      );

      if (icon) {
        icon.className = "ri-shopping-bag-4-fill";
      }
    }, 1500);
  });
});

/*=============== CURRENT YEAR ===============*/
const footerCopy = document.querySelector(".footer__copy");

if (footerCopy) {
  const currentYear = new Date().getFullYear();

  footerCopy.textContent = `© ${currentYear} Fried Chicken. All rights reserved.`;
}

/*=============== SCROLL REVEAL ANIMATION ===============*/
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 1800,
    delay: 150,
    reset: false,
  });

  sr.reveal(".home__data, .about__data, .section__title", {
    origin: "left",
    interval: 100,
  });

  sr.reveal(".home__images, .about__images", {
    origin: "right",
    interval: 100,
  });

  sr.reveal(
    ".order__card, .combo__content, .contact__data, .contact__info",
    {
      interval: 180,
    }
  );
}