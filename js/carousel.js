import { playAudio } from "./audio.js";

const cars = [
  {
    name: "SACMA // 01",
    accent: "#ef1722",
    label: "01",
    file: "../assets/cars/sacma.png",
    wallpaper: "../assets/wallpapers/sacma.png",
  },
  {
    name: "SACTWU // 02",
    accent: "#f0f0f0",
    label: "02",
    file: "../assets/cars/sactwu.png",
    wallpaper: "../assets/wallpapers/sactwu.png",
  },
  {
    name: "NBC // 03",
    accent: "#ef1722",
    label: "03",
    file: "../assets/cars/nbc.png",
    wallpaper: "../assets/wallpapers/nbc.png",
  },
  {
    name: "ATASA // 04",
    accent: "#4bbdff",
    label: "04",
    file: "../assets/cars/atasa.png",
    wallpaper: "../assets/wallpapers/atasa.png",
  },
  {
    name: "SAAA // 05",
    accent: "#ffd000",
    label: "05",
    file: "../assets/cars/saaa.png",
    wallpaper: "../assets/wallpapers/saaa.png",
  },
  {
    name: "EPCMA // 06",
    accent: "#00a651",
    label: "06",
    file: "../assets/cars/epcma.png",
    wallpaper: "../assets/wallpapers/epcma.png",
  },
];

let selected = 2;

const carsContainer = document.getElementById("cars");
const carouselDots = document.getElementById("carouselDots");

const carName = document.getElementById("carName");
const modalCarName = document.getElementById("modalCarName");
const modalCarArt = document.getElementById("modalCarArt");
const modalWallpaper = document.getElementById("modalWallpaper");
const carModal = document.getElementById("carModal");

const prevCar = document.getElementById("prevCar");
const nextCar = document.getElementById("nextCar");
const wallpaperButton = document.getElementById("wallpaperButton");
const modalClose = document.getElementById("modalClose");
const buttonClickSound = document.getElementById("buttonClickSound");

cars.forEach(function (car, index) {
  const carElement = document.createElement("button");

  carElement.type = "button";
  carElement.className = "car-card";

  carElement.innerHTML = `
    <img src="${car.file}" alt="${car.name}">
  `;

  carElement.onclick = function () {
    selectCar(index, false);
  };

  carsContainer.appendChild(carElement);

  const dot = document.createElement("button");

  dot.type = "button";

  dot.onclick = function () {
    selectCar(index, false);
  };

  carouselDots.appendChild(dot);
});

/**
 * Gets the carousel position of a car relative to the selected car.
 *
 * @param {number} index - Car index.
 * @returns {number} Relative carousel position.
 */
function getRelativePosition(index) {
  let distance = index - selected;
  const carCount = cars.length;

  if (distance > Math.floor(carCount / 2)) {
    distance -= carCount;
  }

  if (distance < -Math.floor(carCount / 2)) {
    distance += carCount;
  }

  return distance;
}

/**
 * Updates the visual position of all cars.
 */
function renderCarousel() {
  const carElements = Array.from(carsContainer.children);
  const dots = Array.from(carouselDots.children);

  carElements.forEach(function (carElement, index) {
    carElement.className = "car-card";

    const distance = getRelativePosition(index);

    if (distance === 0) {
      carElement.classList.add("active");
    } else if (distance === -1) {
      carElement.classList.add("left");
    } else if (distance === 1) {
      carElement.classList.add("right");
    } else if (distance === -2) {
      carElement.classList.add("far-left");
    } else if (distance === 2) {
      carElement.classList.add("far-right");
    } else {
      carElement.classList.add("hidden");
    }
  });

  dots.forEach(function (dot, index) {
    dot.classList.toggle("active", index === selected);
  });

  const selectedCar = cars[selected];

  carName.textContent = selectedCar.name;

  if (modalCarName) {
    modalCarName.textContent = selectedCar.name;
  }
}

/**
 * Selects a car.
 *
 * @param {number} index - Car index.
 * @param {boolean} openModal - Whether to open the modal.
 */
function selectCar(index, openModal) {
  selected = (index + cars.length) % cars.length;

  renderCarousel();

  if (openModal === true) {
    setTimeout(function () {
      openCarModal();
    }, 180);
  }
}

/**
 * Opens the selected car modal.
 */
function openCarModal() {
  const selectedCar = cars[selected];

  modalCarArt.innerHTML = `
    <img src="${selectedCar.file}" alt="${selectedCar.name}">
  `;

  carName.textContent = selectedCar.name;

  modalWallpaper.dataset.file = selectedCar.wallpaper;
  modalWallpaper.dataset.name = selectedCar.label;

  carModal.classList.add("open");
  carModal.setAttribute("aria-hidden", "false");
}

/**
 * Closes the car modal.
 */
function closeCarModal() {
  carModal.classList.remove("open");
  carModal.setAttribute("aria-hidden", "true");
}

prevCar.onclick = function () {
  playAudio(buttonClickSound, 0.2);
  selectCar(selected - 1, false);
};

nextCar.onclick = function () {
  playAudio(buttonClickSound, 0.2);
  selectCar(selected + 1, false);
};

wallpaperButton.onclick = function () {
  playAudio(buttonClickSound, 0.2);
  const selectedCar = cars[selected];

  const downloadLink = document.createElement("a");

  downloadLink.href = selectedCar.wallpaper;
  downloadLink.download = `NBC-AGM-2026-${selectedCar.label}.png`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
};

modalClose.onclick = function () {
  closeCarModal();
};

document.querySelector("[data-close-modal]").onclick = function () {
  closeCarModal();
};

/**
 * Downloads the selected car's finished wallpaper.
 */
modalWallpaper.onclick = function () {
  const wallpaperFile = modalWallpaper.dataset.file;
  const carLabel = modalWallpaper.dataset.name;

  const downloadLink = document.createElement("a");

  downloadLink.href = wallpaperFile;
  downloadLink.download = `NBC-AGM-2026-${carLabel}.png`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
};

document.onkeydown = function (event) {
  if (event.key === "Escape") {
    closeCarModal();
  }

  if (event.key === "ArrowLeft") {
    selectCar(selected - 1, false);
  }

  if (event.key === "ArrowRight") {
    selectCar(selected + 1, false);
  }
};

renderCarousel();

let autoSlideTimer;
let carouselPaused = false;

function startAutoSlide() {
  clearInterval(autoSlideTimer);

  autoSlideTimer = setInterval(function () {
    if (!carouselPaused) {
      selectCar(selected + 1, false);
    }
  }, 5000);
}

carsContainer.addEventListener("mouseenter", function () {
  carouselPaused = true;
});

carsContainer.addEventListener("mouseleave", function () {
  carouselPaused = false;
});

startAutoSlide();
