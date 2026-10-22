const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const pageKey = document.body.dataset.page;

document
  .querySelector(`[data-nav="${pageKey}"]`)
  ?.setAttribute("aria-current", "page");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Open navigation" : "Close navigation",
    );
    primaryNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  primaryNav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  });
}

const detailDialog = document.querySelector(".detail-dialog");
if (detailDialog) {
  const title = detailDialog.querySelector("[data-dialog-title]");
  const kicker = detailDialog.querySelector("[data-dialog-kicker]");
  const copy = detailDialog.querySelector("[data-dialog-copy]");
  const facilities = detailDialog.querySelector("[data-dialog-facilities]");

  document.querySelectorAll("[data-detail-title]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      title.textContent = trigger.dataset.detailTitle;
      kicker.textContent = trigger.dataset.detailKicker;
      copy.textContent = trigger.dataset.detailCopy;
      facilities.replaceChildren(
        ...trigger.dataset.detailFacilities.split(" · ").map((item) => {
          const entry = document.createElement("li");
          entry.textContent = item;
          return entry;
        }),
      );
      detailDialog.showModal();
    });
  });

  detailDialog
    .querySelector(".dialog-close")
    ?.addEventListener("click", () => detailDialog.close());
  detailDialog.addEventListener("click", (event) => {
    if (event.target === detailDialog) detailDialog.close();
  });
}

document.querySelectorAll("[data-mission-filter]").forEach((filter) => {
  filter.addEventListener("click", () => {
    const selectedStatus = filter.dataset.missionFilter;
    document.querySelectorAll("[data-mission-filter]").forEach((button) => {
      const selected = button === filter;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("[data-mission-status]").forEach((mission) => {
      mission.hidden =
        selectedStatus !== "all" &&
        mission.dataset.missionStatus !== selectedStatus;
    });
  });
});

const imageDialog = document.querySelector(".image-dialog");
if (imageDialog) {
  const image = imageDialog.querySelector("[data-lightbox-image]");
  const caption = imageDialog.querySelector("[data-lightbox-caption]");
  document.querySelectorAll("[data-lightbox]").forEach((tile) => {
    tile.addEventListener("click", () => {
      image.src = tile.dataset.lightbox;
      image.alt = tile.querySelector("img").alt;
      caption.textContent = tile.dataset.caption;
      imageDialog.showModal();
    });
  });
  imageDialog
    .querySelector(".dialog-close")
    ?.addEventListener("click", () => imageDialog.close());
  imageDialog.addEventListener("click", (event) => {
    if (event.target === imageDialog) imageDialog.close();
  });
}

const contactForm = document.querySelector("#contact-form");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = new FormData(contactForm).get("name").trim();
  document.querySelector("#form-status").textContent =
    `Thanks, ${name}. Your message is ready for the concept team. (Demo only; nothing was sent.)`;
  contactForm.reset();
});

const hero = document.querySelector(".home-hero");
if (hero) {
  const visuals = [...hero.querySelectorAll(".hero-visual")];
  const counter = hero.querySelector("[data-hero-counter]");
  const imageSet = [
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=2400&q=90",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2400&q=90",
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2400&q=90",
  ];
  let activeVisual = 0;
  const previousImage = Number(sessionStorage.getItem("orbital-hero-image"));
  const hasPreviousImage =
    Number.isInteger(previousImage) &&
    previousImage >= 0 &&
    previousImage < imageSet.length;
  let currentImage = hasPreviousImage
    ? (previousImage + 1) % imageSet.length
    : Math.floor(Math.random() * imageSet.length);

  const showImage = (nextImage) => {
    const image = new Image();
    image.onload = () => {
      const nextVisual = (activeVisual + 1) % visuals.length;
      visuals[nextVisual].style.backgroundImage =
        `url("${imageSet[nextImage]}")`;
      visuals[nextVisual].classList.add("is-active");
      visuals[activeVisual].classList.remove("is-active");
      activeVisual = nextVisual;
      currentImage = nextImage;
      sessionStorage.setItem("orbital-hero-image", String(currentImage));
      counter.textContent = String(currentImage + 1).padStart(2, "0");
    };
    image.src = imageSet[nextImage];
  };

  visuals[activeVisual].style.backgroundImage =
    `url("${imageSet[currentImage]}")`;
  visuals[activeVisual].classList.add("is-active");
  sessionStorage.setItem("orbital-hero-image", String(currentImage));
  counter.textContent = String(currentImage + 1).padStart(2, "0");

  document.querySelectorAll(".brand").forEach((brand) => {
    brand.addEventListener("click", (event) => {
      event.preventDefault();
      const nextImage = (currentImage + 1) % imageSet.length;
      showImage(nextImage);
      window.scrollTo({
        top: 0,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });
  });
}
