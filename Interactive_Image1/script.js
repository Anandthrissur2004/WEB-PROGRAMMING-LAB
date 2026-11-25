
// Image paths displayed by the gallery viewer.
const images = [
    "./Image/image1.png",
    "./Image/image2.png",
    "./Image/image3.png",
    "./Image/image4.png",
];

const viewer = document.getElementById("viewer");
const slide = document.getElementById("slide");
const zoomLevel = document.getElementById("zoom-level");
const zoomOutButton = document.querySelector('[data-action="zoom-out"]');
const zoomInButton = document.querySelector('[data-action="zoom-in"]');
const slideFrame = document.querySelector(".slide-frame");
// Keep zoom within these bounds and adjust it in fixed increments.
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;
let currentIndex = 0;
let timer = null;
let zoom = 1;

// Apply the current zoom and refresh the percentage and button states.
function updateZoom() {
    slide.style.transform = `scale(${zoom})`;
    zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
    zoomOutButton.disabled = zoom <= MIN_ZOOM;
    zoomInButton.disabled = zoom >= MAX_ZOOM;
}

// Change zoom by one step without exceeding the supported range.
function changeZoom(step) {
    zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + step));
    updateZoom();
}

// Display the selected image, reset its zoom, and open the viewer.
function show(index) {
    currentIndex = index;
    slide.src = images[currentIndex];
    zoom = 1;
    updateZoom();
    viewer.classList.add("is-open");
}

// Move through the image list, wrapping at either end.
function change(step) {
    show((currentIndex + step + images.length) % images.length);
}

// Toggle automatic image advance on a two-second interval.
function autoPlay() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
        return;
    }

    timer = setInterval(() => change(1), 2000);
}

// Hide the viewer and stop any active automatic playback.
function closeView() {
    viewer.classList.remove("is-open");
    clearInterval(timer);
    timer = null;
}

// Open the image chosen from the thumbnail grid.
document.querySelectorAll(".thumbnail").forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
        show(Number(thumbnail.dataset.index));
    });
});

// Connect viewer controls to navigation, playback, and zoom actions.
document.querySelector('[data-action="previous"]').addEventListener("click", () => change(-1));
document.querySelector('[data-action="next"]').addEventListener("click", () => change(1));
document.querySelector('[data-action="autoplay"]').addEventListener("click", autoPlay);
document.querySelector('[data-action="close"]').addEventListener("click", closeView);
zoomInButton.addEventListener("click", () => changeZoom(ZOOM_STEP));
zoomOutButton.addEventListener("click", () => changeZoom(-ZOOM_STEP));
document.querySelector('[data-action="zoom-reset"]').addEventListener("click", () => {
    zoom = 1;
    updateZoom();
});
// Allow zooming with the mouse wheel while the pointer is over the image.
slideFrame.addEventListener("wheel", (event) => {
    event.preventDefault();
    changeZoom(event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
}, { passive: false });
