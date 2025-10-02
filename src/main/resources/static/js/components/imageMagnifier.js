const imageMagnifier = {
  init(imageElement) {
    if (!imageElement) return;

    // Create container to wrap the image
    const container = document.createElement('div');
    container.classList.add('magnifier-container');

    // Wrap image in container
    imageElement.parentNode.insertBefore(container, imageElement);
    container.appendChild(imageElement);

    // Create magnifying glass
    const glass = document.createElement('div');
    glass.classList.add('magnifier-glass');
    container.appendChild(glass);

    // Calculate zoom level
    const zoom = 3;

    function moveMagnifier(e) {
      e.preventDefault();

      // Get cursor position
      const pos = getCursorPos(e);
      let x = pos.x;
      let y = pos.y;

      // Prevent glass from moving outside image
      if (x > imageElement.width - (glass.offsetWidth / zoom)) {
        x = imageElement.width - (glass.offsetWidth / zoom);
      }
      if (x < glass.offsetWidth / zoom) {
        x = glass.offsetWidth / zoom;
      }
      if (y > imageElement.height - (glass.offsetHeight / zoom)) {
        y = imageElement.height - (glass.offsetHeight / zoom);
      }
      if (y < glass.offsetHeight / zoom) {
        y = glass.offsetHeight / zoom;
      }

      // Set glass position
      glass.style.left = (x - glass.offsetWidth / 2) + "px";
      glass.style.top = (y - glass.offsetHeight / 2) + "px";

      // Set background position
      glass.style.backgroundImage = "url('" + imageElement.src + "')";
      glass.style.backgroundSize = (imageElement.width * zoom) + "px " + (imageElement.height * zoom) + "px";
      glass.style.backgroundPosition = "-" + ((x * zoom) - glass.offsetWidth / 2) + "px -" + ((y * zoom) - glass.offsetHeight / 2) + "px";
    }

    function getCursorPos(e) {
      const rect = imageElement.getBoundingClientRect();
      let x = e.pageX - rect.left - window.pageXOffset;
      let y = e.pageY - rect.top - window.pageYOffset;
      return { x, y };
    }

    // Event listeners
    imageElement.addEventListener("mousemove", moveMagnifier);
    glass.addEventListener("mousemove", moveMagnifier);

    imageElement.addEventListener("mouseenter", () => {
      glass.style.display = "block";
    });

    imageElement.addEventListener("mouseleave", () => {
      glass.style.display = "none";
    });
  }
}; 