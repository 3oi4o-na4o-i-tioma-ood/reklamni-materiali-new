const pagination = {
  _pagesOffset: 0,
  _page: 0,
  _id: null,
  _numberOfPages: 0,
  _onPageChange: null,
  async goToPage(number, invokeUpdateListener = false) {
    const active_buttons = document.querySelectorAll(
      "#active_button_container button"
    );

    const startIndex = Math.min(pagination._numberOfPages - active_buttons.length, Math.max(0, number - 2));

    pagination._pagesOffset = startIndex
    pagination._page = Math.min(pagination._numberOfPages - 1, Math.max(0, number))

    active_buttons.forEach((button, i) => {
      const buttonIndex = startIndex + i
      button.innerHTML = buttonIndex + 1;

      if (buttonIndex === pagination._page) {
        button.classList.add("active_button");
      } else {
        button.classList.remove("active_button");
      }
    });

    pagination._updateEllipsis()

    if(invokeUpdateListener) { 
      pagination._onPageChange?.(pagination._page)
    }
  },
  _createArrowButton(src, isLeft) {
    const name = isLeft ? "left" : "right"

    const button = document.createElement("button");
    button.classList.add("arrow-" + name)
    const img = document.createElement("img");
    img.src = src
    button.append(img)

    button.addEventListener("click", () => {
      pagination.goToPage(pagination._page + (isLeft ? -1 : 1), true)
    });

    return button
  },
  _updateEllipsis() {
    const container = document.getElementById(pagination._id);

    if (pagination._page <= 2 && pagination._numberOfPages > 5) {
      container.classList.add("left-ellipsis-hidden")
    }
    else {
      container.classList.remove("left-ellipsis-hidden")
    }

    if (pagination._page >= pagination._numberOfPages - 3 && pagination._numberOfPages > 5) {
      container.classList.add("right-ellipsis-hidden")
    }
    else {
      container.classList.remove("right-ellipsis-hidden")
    }
  },
  _generateEllipsis(isLeft) {
    const name = isLeft ? "left" : "right"

    const ellipsis = document.createElement("button");
    ellipsis.classList.add("pagination-ellipsis-" + name)
    ellipsis.innerHTML = "...";

    ellipsis.addEventListener("click", () => {
      pagination.goToPage(pagination._page + (isLeft ? -5 : 5), true);
    });

    return ellipsis
  },
  _appendComponents(container, arrow_left, ellipsis_left, pages_buttons, ellipsis_right, arrow_right) {
    container.append(arrow_left);

    if (pagination._numberOfPages > 5) {
      container.append(ellipsis_left);
    }

    container.append(pages_buttons);

    if (pagination._numberOfPages > 5) {
      container.append(ellipsis_right);
    }

    container.append(arrow_right);
  },
  _createPagesButtons() {
    const container = document.createElement("div");
    container.setAttribute("class", "active_button_container");
    container.id = "active_button_container";

    const amount = Math.min(pagination._numberOfPages, 5)
    const buttons = new Array(amount).fill(null).map((_, index) => {
      const button = document.createElement("button")

      button.addEventListener("click", async () => {
        const newPage = pagination._pagesOffset + index
        pagination.goToPage(newPage, true);
      });

      return button
    })

    container.append(...buttons)

    return container
  },
  generateButtons(numberOfPages, id, onPageChange) {
    pagination._onPageChange = onPageChange
    pagination._numberOfPages = numberOfPages
    pagination._id = id

    const container = document.getElementById(id);
    container.innerHTML = "";

    const arrow_left = pagination._createArrowButton("/images/category/arrow_left.svg", true)
    const arrow_right = pagination._createArrowButton("/images/category/arrow_right.svg", false)
    
    const ellipsisLeft = pagination._generateEllipsis(true)
    const ellipsisRight = pagination._generateEllipsis(false)
    
    const buttons_container = pagination._createPagesButtons()

    pagination._appendComponents(container, arrow_left, ellipsisLeft, buttons_container, ellipsisRight, arrow_right)

    pagination.goToPage(0, false)
    pagination._updateEllipsis()
  },
};