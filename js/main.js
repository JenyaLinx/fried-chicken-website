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
  navToggle.style.visibility = "hidden";
  navToggle.style.pointerEvents = "none";
}

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
  navToggle.style.visibility = "visible";
  navToggle.style.pointerEvents = "auto";
}

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

/*=============== SHOPPING CART ===============*/
const cart = document.getElementById("js-cart");
const cartOpen = document.getElementById("js-cart-open");
const cartClose = document.getElementById("js-cart-close");
const cartOverlay = document.getElementById("js-cart-overlay");
const cartContent = document.getElementById("js-cart-content");
const cartEmpty = document.getElementById("js-cart-empty");
const cartCount = document.getElementById("js-cart-count");
const cartTotal = document.getElementById("js-cart-total");
const orderButtons = document.querySelectorAll(".order__button");

let cartItems = [];

const openCart = () => {
  if (!cart || !cartOverlay) return;

  cart.classList.add("show-cart");
  cartOverlay.classList.add("show-cart");
  cart.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
};

const closeCart = () => {
  if (!cart || !cartOverlay) return;

  cart.classList.remove("show-cart");
  cartOverlay.classList.remove("show-cart");
  cart.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
};

cartOpen?.addEventListener("click", openCart);
cartClose?.addEventListener("click", closeCart);
cartOverlay?.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
  }
});

const getPriceNumber = (priceText) => {
  const normalizedPrice = priceText.replace(",", ".");
  const price = Number.parseFloat(normalizedPrice.replace(/[^\d.]/g, ""));

  return Number.isNaN(price) ? 0 : price;
};

const updateCart = () => {
  if (!cartContent || !cartCount || !cartTotal || !cartEmpty) return;

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

  cartContent
    .querySelectorAll(".cart__item")
    .forEach((item) => item.remove());

  if (cartItems.length === 0) {
    cartEmpty.hidden = false;
    return;
  }

  cartEmpty.hidden = true;

  cartItems.forEach((item) => {
    const cartItem = document.createElement("article");

    cartItem.className = "cart__item";
    cartItem.dataset.id = item.id;

    cartItem.innerHTML = `
      <img
        src="${item.image}"
        alt="${item.title}"
        class="cart__item-image"
      />

      <div>
        <h3 class="cart__item-title">${item.title}</h3>
        <span class="cart__item-price">$${item.price.toFixed(2)}</span>

        <div class="cart__item-controls">
          <button
            class="cart__quantity-button"
            type="button"
            data-action="decrease"
            aria-label="Decrease quantity"
          >
            <i class="ri-subtract-line"></i>
          </button>

          <span>${item.quantity}</span>

          <button
            class="cart__quantity-button"
            type="button"
            data-action="increase"
            aria-label="Increase quantity"
          >
            <i class="ri-add-line"></i>
          </button>
        </div>
      </div>

      <button
        class="cart__remove"
        type="button"
        data-action="remove"
        aria-label="Remove ${item.title}"
      >
        <i class="ri-delete-bin-6-line"></i>
      </button>
    `;

    cartContent.appendChild(cartItem);
  });
};

orderButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const card = button.closest(".order__card, .combo__content");

if (!card) return;

    const title =
  button.dataset.title ||
  card.querySelector(".order__title")?.textContent.trim() ||
  `Product ${index + 1}`;

const priceText =
  button.dataset.price ||
  card.querySelector(".order__price, .combo__price")?.textContent.trim() ||
  "0";

    const image =
      card.querySelector("img")?.getAttribute("src") || "./img/logo.svg";

    const productId = `${title}-${index}`;
    const existingItem = cartItems.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        id: productId,
        title,
        price: getPriceNumber(priceText),
        image,
        quantity: 1,
      });
    }

    const icon = button.querySelector("i");

    button.classList.add("order__button--added");

    if (icon) {
      icon.className = "ri-check-line";
    }

    setTimeout(() => {
      button.classList.remove("order__button--added");

      if (icon) {
        icon.className = "ri-shopping-bag-4-fill";
      }
    }, 1000);

    updateCart();
    openCart();
  });
});


/*=============== CHECKOUT ===============*/
const checkout = document.getElementById("js-checkout");
const checkoutOverlay = document.getElementById(
  "js-checkout-overlay"
);
const checkoutOpen = document.getElementById("js-checkout-open");
const checkoutClose = document.getElementById(
  "js-checkout-close"
);
const checkoutForm = document.getElementById(
  "js-checkout-form"
);
const checkoutTotal = document.getElementById(
  "js-checkout-total"
);
const checkoutItems = document.getElementById(
  "js-checkout-items"
);
const checkoutMessage = document.getElementById(
  "js-checkout-message"
);

const openCheckout = () => {
  if (!checkout || !checkoutOverlay) return;

  if (cartItems.length === 0) {
    return;
  }

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (checkoutTotal) {
    checkoutTotal.textContent = `$${totalPrice.toFixed(2)}`;
  }

  if (checkoutItems) {
    checkoutItems.textContent = `${totalQuantity} ${
      totalQuantity === 1 ? "item" : "items"
    }`;
  }

  closeCart();

  checkout.classList.add("show-checkout");
  checkoutOverlay.classList.add("show-checkout");
  checkout.setAttribute("aria-hidden", "false");

  document.body.classList.add("checkout-open");

  const firstInput = checkout.querySelector("input");

  setTimeout(() => {
    firstInput?.focus();
  }, 350);
};

const closeCheckout = () => {
  if (!checkout || !checkoutOverlay) return;

  checkout.classList.remove("show-checkout");
  checkoutOverlay.classList.remove("show-checkout");
  checkout.setAttribute("aria-hidden", "true");

  document.body.classList.remove("checkout-open");

  if (checkoutMessage) {
    checkoutMessage.textContent = "";
  }
};

checkoutOpen?.addEventListener("click", openCheckout);
checkoutClose?.addEventListener("click", closeCheckout);
checkoutOverlay?.addEventListener("click", closeCheckout);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCheckout();
  }
});

checkoutForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!checkoutForm.checkValidity()) {
    checkoutForm.reportValidity();
    return;
  }

  if (cartItems.length === 0) {
    if (checkoutMessage) {
      checkoutMessage.textContent =
        "Your cart is empty.";
    }

    return;
  }

  if (checkoutMessage) {
    checkoutMessage.textContent =
      "Thank you! Your order has been placed.";
  }

  cartItems = [];

  updateCart();
  checkoutForm.reset();

  setTimeout(() => {
    closeCheckout();
  }, 1800);
});


cartContent?.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  const cartItem = event.target.closest(".cart__item");

  if (!actionButton || !cartItem) return;

  const productId = cartItem.dataset.id;
  const action = actionButton.dataset.action;
  const item = cartItems.find((product) => product.id === productId);

  if (!item) return;

  if (action === "increase") {
    item.quantity += 1;
  }

  if (action === "decrease") {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      cartItems = cartItems.filter(
        (product) => product.id !== productId
      );
    }
  }

  if (action === "remove") {
    cartItems = cartItems.filter(
      (product) => product.id !== productId
    );
  }

  updateCart();
});

updateCart();

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