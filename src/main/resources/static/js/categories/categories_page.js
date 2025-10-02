// const urlToProduct = [
//   {
//     name: "BUSINESS_CARD",
//     url: "визитки",
//   },
//   {
//     name: "rabotni-kalendari",
//     url: "работни-календари",
//   },
// ];
const categoriesPage = {
  categoryPath: "",
  _productName: null,
  _pageSize: null,
  _imagesTotal: 0,
  _getNumberOfPages() {
    console.log("_getNumberOfPages: ", categoriesPage._imagesTotal, categoriesPage._pageSize)
    return Math.ceil(categoriesPage._imagesTotal / categoriesPage._pageSize);
  },
  _onCategoryClick() {

  },
  _createPagination() {
    const numberOfPages = categoriesPage._getNumberOfPages()

    pagination.generateButtons(
      numberOfPages,
      `images_pagination_container`,
      async (page) => {
        await categoriesPage.onPaginationChange(
          page
        );
      }
    );
  },
  async generateCategories(product_name, product) {
    const categories = await API.getCategories(product);
    const button_container = document.getElementById(
      "categories_buttons_container"
    );
    const product_url = product_name;

    function createButton(element, path, parentNames = []) {
      const button = document.createElement("button");

      button.textContent = element.name;
      button.setAttribute("class", "category_button");
      const li = document.createElement("li");
      li.append(button);

      let buttons

      if (element.children?.length) {
        const img = document.createElement("img");
        img.className = "arrow_down";
        img.src = "/images/category/arrow_down.svg";

        button.className += " parent";

        button.append(img);
        buttons = createButtons(element.children, path, [...parentNames, element.name]);
        li.append(buttons);
      }

      button.addEventListener("click", async () => {
        const siblings = li.parentElement.children;
        //console.log(siblings);
        categoriesPage.categoryPath = path
        await categoriesPage.updateImages(0)

        categoriesPage._createPagination()

        const subtitle = document.getElementById(
          "categories_subtitle"
        );
        //subtitle.innerText = path;
        subtitle.innerText = [...parentNames, element.name].join(" / ")
        const uls = [...siblings].flatMap((li) => {
          return [...li.querySelectorAll("ul")];
        });

        uls.forEach((ul) => {
          ul.style.display = "none";
        });

        if(buttons) {
          buttons.style.display = "flex";
        }
      });

      return li;
    }

    function createButtons(buttons, path = "", parentNames = []) {
      const listItems = buttons.map((button) =>
        createButton(button, (path ? path + "/" : path) + button.url, parentNames)
      );

      const ul = document.createElement("ul");
      ul.append(...listItems);
      return ul;
    }

    const ul = createButtons(categories);
    button_container.append(ul);
  },
  async onPaginationChange(page_number) {
    categoriesPage.updateImages(page_number)
  },

  async updateImages(page_number) {
    const images = await API.getPictures(categoriesPage._productName, page_number, categoriesPage._pageSize, categoriesPage.categoryPath);
    categoriesPage._imagesTotal = images.total
    categoriesPage._generateImages(images.images, `images_container`, categoriesPage.getProductDescription()?.url, categoriesPage._productName);
  },
  getProductDescription() {
    return products.find(p => p.name === categoriesPage._productName)
  },
  _initSkipBgButton() {
    const a = document.getElementById("continue-without-bg-button")
    if (!a) {
      return
    }

    a.href = `/${categoriesPage.getProductDescription()?.url}/дизайн`
  },
  _orientationSelectInstance: null,
  _orientation: null,
  _updateOrientation(orientation) {
    categoriesPage._orientation = orientation

    const imagesContainer = document.getElementById("images_container")
    imagesContainer.style.gridTemplateColumns = `repeat(${orientation === "horizontal" ? 3 : 5}, 1fr)`;
  },
  _initOrientationSelect() {
    const select = document.getElementById("select-orientation")

    if(categoriesPage._orientationSelectInstance || !select) {
      return
    }

    categoriesPage._orientationSelectInstance = NiceSelect.bind(select, {placeholder: "Ориентация"})
    select.addEventListener("change", e => {
      categoriesPage._updateOrientation(e.target.value)
    })
  },
  _generateImages(imagesArray, id, product_url, product_name) {
    const images_container = document.getElementById(id);
    images_container.innerHTML = "";

    const modelColorId = new URLSearchParams(window.location.search).get("modelColorId")
  
    for (let i = 0; i < imagesArray.length; i++) {
      const img = document.createElement("img");
      const a = document.createElement("a");
      // console.log(imagesArray[i]);
      console.log("product_name:", product_name)
      img.src = API.getImageUrl(product_name, imagesArray[i]);
      a.append(img);
      images_container.append(a);
    
      const searchParams = new URLSearchParams({
        bg: imagesArray[i],
      })

      if(modelColorId) {
        searchParams.set("modelColorId", modelColorId)
      }
      a.href = `/${product_url}/дизайн?${searchParams}`;
    }
  },
  
  async init(product, page_size = 12, hasCategories = true) {
    categoriesPage._productName = product
    categoriesPage._pageSize = page_size

    categoriesPage._initSkipBgButton()

    categoriesPage._initOrientationSelect()

    if (hasCategories) {
      categoriesPage.generateCategories(categoriesPage.getProductDescription()?.url, product)
    }

    await categoriesPage.updateImages(0)

    categoriesPage._createPagination()
  }
};
