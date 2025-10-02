let currentSlide = 0;

function moveSlide(direction) {
  const slides = document.querySelectorAll(
    ".types .content_types .containerche"
  );
  console.log(slides.length);
  const totalSlides = slides.length;

  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;

  const newTransform = `translateX(-${currentSlide * 100}%)`;
  document.querySelector(".types .content_types").style.transform =
    newTransform;
}
