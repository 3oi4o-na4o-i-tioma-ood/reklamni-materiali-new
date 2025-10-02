// document.addEventListener("DOMContentLoaded", () => {
//   if (window.innerWidth < 767) {
//     newCarousel("popular-services", 1);
//   } else {
//     newCarousel("popular-services", 2);
//   }
// });


document.addEventListener("DOMContentLoaded", () => {
  const initCarousel = () => {
    if (window.innerWidth < 767) {
      newCarousel("popular-services", 2);
    } else {
      newCarousel("popular-services", 3);
    }
  };

  // Initialize the carousel on DOMContentLoaded
  initCarousel();

  // Add a debounce function to improve performance on resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initCarousel();
    }, 200); // Adjust the debounce delay as needed
  });
});