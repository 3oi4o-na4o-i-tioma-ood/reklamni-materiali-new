const adminCategories = {
  _productType: null,
  _openedCategoryPath: [],
  _categories: null,
  _createCategoryItem(category, index) {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.gap = "10px";

    // Create arrows container
    const arrowsContainer = document.createElement("div");
    arrowsContainer.style.display = "flex";
    arrowsContainer.style.flexDirection = "column";
    arrowsContainer.style.gap = "2px";

    // Create up arrow button
    const upArrow = document.createElement("button");
    upArrow.classList.add("button", "secondary");
    upArrow.innerHTML = "↑";
    upArrow.style.padding = "0 4px";
    upArrow.style.cursor = "pointer";
    upArrow.style.background = "none";
    upArrow.style.marginLeft = "10px";
    upArrow.disabled = index === 0; // Disable up arrow for first item
    upArrow.addEventListener("click", async () => {
      try {
        // Get all items
        const allItems = document.querySelectorAll('#categories-list li');
        const totalItems = allItems.length;
        // Create reversed priorities (higher numbers at top)
        const currentPriorities = Array.from(allItems).map((_, idx) => totalItems - idx);
        
        // Swap priorities with the item above
        const temp = currentPriorities[index];
        currentPriorities[index] = currentPriorities[index - 1];
        currentPriorities[index - 1] = temp;
        
        // Send request to update priorities
        const response = await fetch(`${backendUrl}/admin/categories/priority`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("JWT")
          },
          body: JSON.stringify({
            productType: adminCategories._productType,
            parentPath: adminCategories._openedCategoryPath.map(cat => cat.url).join('/'),
            newPriorities: currentPriorities
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update priority');
        }

        // Refresh the categories list
        await adminCategories._fetchCategories();
        adminCategories._renderCategoriesList(adminCategories._categories);
      } catch (error) {
        console.error('Error updating priority:', error);
      }
    });

    // Create down arrow button
    const downArrow = document.createElement("button");
    downArrow.classList.add("button", "secondary");
    downArrow.innerHTML = "↓";
    downArrow.style.padding = "0 4px";
    downArrow.style.cursor = "pointer";
    downArrow.style.background = "none";
    downArrow.style.marginLeft = "10px";
    const allItems = document.querySelectorAll('#categories-list li');
    downArrow.disabled = index === allItems.length - 1; // Disable down arrow for last item
    downArrow.addEventListener("click", async () => {
      try {
        const allItems = document.querySelectorAll('#categories-list li');
        const totalItems = allItems.length;
        // Create reversed priorities (higher numbers at top)
        const currentPriorities = Array.from(allItems).map((_, idx) => totalItems - idx);
        
        // Swap priorities with the item below
        const temp = currentPriorities[index];
        currentPriorities[index] = currentPriorities[index + 1];
        currentPriorities[index + 1] = temp;
        
        // Send request to update priorities
        const response = await fetch(`${backendUrl}/admin/categories/priority`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("JWT")
          },
          body: JSON.stringify({
            productType: adminCategories._productType,
            parentPath: adminCategories._openedCategoryPath.map(cat => cat.url).join('/'),
            newPriorities: currentPriorities
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update priority');
        }

        // Refresh the categories list
        await adminCategories._fetchCategories();
        adminCategories._renderCategoriesList(adminCategories._categories);
      } catch (error) {
        console.error('Error updating priority:', error);
      }
    });

    arrowsContainer.appendChild(upArrow);
    arrowsContainer.appendChild(downArrow);
    li.appendChild(arrowsContainer);

    let mainButton;
    if (category.children?.length) {
      mainButton = document.createElement("button");
      mainButton.addEventListener("click", () => {
        adminCategories._pushCategory(category);
      });
    } else {
      mainButton = document.createElement("a");
      const parentPath = adminCategories._openedCategoryPath
        .map((category) => category.url)
        .join("/");
      const path = (parentPath ? parentPath + "/" : "") + category.url;
      mainButton.href =
        "/админ/визитки/редактиране-на-категория?categoryPath=" + path;
    }
    mainButton.classList.add("main-button");

    const folderIcon = document.createElement("img");
    folderIcon.src = "/images/admin/folder.svg";
    folderIcon.alt = "folder";
    mainButton.append(folderIcon, category.name);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("icon-button");

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "/images/common/delete.svg";
    deleteIcon.alt = "delete";
    deleteButton.append(deleteIcon);

    deleteButton.addEventListener("click", () => {
      alert("losho");
    });

    li.append(mainButton, deleteButton);

    return li;
  },
  // <button id="open-category-button" class="main-button">
  //     <img src="/images/admin/folder.svg" alt="folder">
  //     Dizainerski
  // </button>
  // <button id="delete-category-button" class="icon-button">
  //     <img src="/images/common/delete.svg" alt="delete">
  // </button>
  async _pushCategory(category) {
    adminCategories._openedCategoryPath.push(category);

    adminCategories._renderCategoriesList(category.children || []);

    if (!category.children?.length) {
    }

    const categoryPathContainer = document.getElementById(
      "category-path-container"
    );

    const path = adminCategories._openedCategoryPath.flatMap((category, i) => {
      const button = document.createElement("button");
      button.innerText = category.name;
      button.addEventListener("click", () => {
        adminCategories._openedCategoryPath.splice(i);
        adminCategories._pushCategory(category);
      });
      return [" / ", button];
    });

    categoryPathContainer.innerText = "";

    categoryPathContainer.append(...path);
  },
  _renderCategoriesList(categories) {
    const categoriesList = document.getElementById("categories-list");
    if (!categoriesList) {
      console.error('Categories list element not found');
      return;
    }

    // Ensure categories is an array
    const categoriesToRender = Array.isArray(categories) ? categories : [];
    
    const listItems = categoriesToRender.map((category, index) =>
      adminCategories._createCategoryItem(category, index)
    );

    categoriesList.innerText = "";
    categoriesList.append(...listItems);
  },

  async _fetchCategories() {
    try {
      const response = await API.getCategories(adminCategories._productType);
      console.log('Categories response:', response); // Debug log
      
      // Ensure we have an array to work with
      adminCategories._categories = Array.isArray(response) ? response : [];
      
      if (!Array.isArray(response)) {
        console.error('Expected array of categories, got:', typeof response);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      adminCategories._categories = [];
    }
  },

  async init(productType) {
    adminCategories._productType = productType;

    adminCategories.createCategoryInit();

    adminCategories.addImageUploadListener();

    await adminCategories._fetchCategories();

    adminCategories._renderCategoriesList(adminCategories._categories);
  },

  addImageUploadListener() {
    const uploadElement = document.getElementById("admin-business-upload");
    if (!uploadElement) {
      return; // Skip if element doesn't exist on the page
    }

    uploadElement.addEventListener("change", (e) => {
      const file = e.target.files[0];
      console.log(file);

      const categoryPath = new URLSearchParams(window.location.search).get(
        "categoryPath"
      );
      const path = `/api/category-image?productType=BUSINESS_CARD&path=${categoryPath}&${file.name}`;
      adminCategories.addCategoryPicture(
        "BUSINESS_CARD",
        file.name,
        categoryPath,
        file
      );
    });
  },

  async deleteCategoryPicture(product, path) {
    const searchParams = new URLSearchParams();
    searchParams.set("product", product);
    searchParams.set("path", path || "");

    await fetch(
      `${backendUrl}/admin/categories/images?${searchParams.toString()}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("JWT"),
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const snackbar = document.getElementById("snackbar");
        snackbar.innerHTML = "Изображението е изтрито успешно!";
        snackbar.classList.add("visible");

        setTimeout(() => {
          snackbar.classList.remove("visible");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error deleting the category picture:", error);

        alert("Error deleting Image");
      });
  },

  async addCategoryPicture(productType, path, pathName, image) {
    const searchParams = new URLSearchParams();

    const formData = new FormData();
    searchParams.set("productType", productType);
    searchParams.set("path", path || "");
    searchParams.set("pathName", pathName || "");
    formData.append("image", image);

    try {
      const response = await fetch(
        `${backendUrl}/admin/categories/images?${searchParams.toString()}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("JWT"),
            // "Content-Type": "application/json",
            // 'Content-Type': 'multipart/form-data'
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json(); // Parse response JSON
      console.log("Image added successfully:", result);

      // Show success notification
      const snackbar = document.getElementById("snackbar");
      snackbar.innerHTML = "Изображението е добавено успешно!";
      snackbar.classList.add("visible");

      setTimeout(() => {
        snackbar.classList.remove("visible");
      }, 3000);

      // Optionally reload the page
      window.location.reload();
      return result;
    } catch (error) {
      console.error("Error adding the category picture:", error);

      // Show error notification
      //   alert("Error adding Image");
      throw error;
    }
  },

  async CreateCategory(name, productType) {
    const searchParams = new URLSearchParams();

    searchParams.set("pathName", name);
    searchParams.set("name", name);

    searchParams.set("productType", productType);
    searchParams.set("path", name);

    await fetch(`${backendUrl}/admin/categories?${searchParams.toString()}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("JWT"),
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const snackbar = document.getElementById("snackbar");
        snackbar.innerHTML = "категорията е създадена успешно!";
        snackbar.classList.add("visible");

        setTimeout(() => {
          snackbar.classList.remove("visible");
        }, 3000);

        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting the category picture:", error);

        alert("Error creating category");
      });
  },

  createCategoryInit() {
    const add_category_button = document.getElementById("create-category");
    const add_category_value = document.getElementById("create-category-value");

    add_category_button?.addEventListener("click", async (e) => {
      await this.CreateCategory(add_category_value.value, adminCategories._productType);
    });
  },
};