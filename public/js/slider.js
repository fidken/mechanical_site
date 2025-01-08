let currentIndex = 0;

const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
  const offset = -index * 100;
  slides.forEach(slide => (slide.style.transform = `translateX(${offset}%)`));
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  showSlide(currentIndex);
}

// Автоматическая смена слайдов каждые 3 секунды
setInterval(nextSlide, 1000);
