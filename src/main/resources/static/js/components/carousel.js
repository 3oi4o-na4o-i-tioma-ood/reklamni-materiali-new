function newCarousel(id, itemsPerView) {
    const carousel = {
        _currentIndex: 0,
        _getDots() {
            return document.querySelectorAll(`#${id} .dot`);
        },
        updateCarousel(index) {
            const offset = -(index / itemsPerView) * 100; // Calculate the correct offset for transform
            const content = document.querySelector(`#${id} .content`);
            content.style.transform = `translateX(${offset}%)`;

            const dots = carousel._getDots()

            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === Math.floor(index / itemsPerView));
            });
        },
        _getItems() {
            const content = document.querySelector(`#${id} .content`);
            if(!content) {
                return []
            }

            return [...content.children];
        },
        _initContainer() {
            const content = document.querySelector(`#${id} .content`);
            content.style.gridTemplateColumns = `repeat(${carousel._getItems().length}, ${100 / itemsPerView}%)`;
        },
        _getTotalPages() {
            return Math.ceil(carousel._getItems().length / itemsPerView);
        },
        _initArrows() {
            const leftButton = document.querySelector(`#${id} .arrow_left`)
            leftButton.addEventListener("click", () => {
                carousel._currentIndex = Math.max(carousel._currentIndex - itemsPerView, 0);
                carousel.updateCarousel(carousel._currentIndex);
            });

            const rightButton = document
                .querySelector(`#${id} .arrow_right`)


            rightButton.addEventListener("click", () => {
                const totalPages = carousel._getTotalPages()

                carousel._currentIndex = Math.min(
                    carousel._currentIndex + itemsPerView,
                    (totalPages - 1) * itemsPerView
                );
                carousel.updateCarousel(carousel._currentIndex);
            });
        },
        _initDots() {
            const totalPages = carousel._getTotalPages()

            const dotsContainer = document.querySelector(`#${id} .navigation`)

            dotsContainer.innerText = ""

            const dots = new Array(totalPages).fill(null, 0, totalPages).map((_, index) => {
                const dot = document.createElement("div")
                dot.classList.add("dot")

                dot.addEventListener("click", () => {
                    carousel._currentIndex = i * itemsPerView;
                    carousel.updateCarousel(carousel._currentIndex);
                });

                return dot
            })

            dotsContainer.append(...dots)
        }
    }

    carousel._initArrows()
    carousel._initDots()
    carousel._initContainer()
    carousel.updateCarousel(0)

    return carousel
}