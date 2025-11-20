const adminCategories = {
  _productType: null,
  _categories: null,

  // <button id="open-category-button" class="main-button">
  //     <img src="/images/admin/folder.svg" alt="folder">
  //     Dizainerski
  // </button>
  // <button id="delete-category-button" class="icon-button">
  //     <img src="/images/common/delete.svg" alt="delete">
  // </button>

  

  async init(productType) {
    adminCategories._productType = productType;

    adminCategories.addImageUploadListener();    
  },

  addImageUploadListener() {
    const uploadElement = document.getElementById("admin-image-upload");
    if (!uploadElement) {
      return; // Skip if element doesn't exist on the page
    }

    uploadElement.addEventListener("change", (e) => {
      const file = e.target.files[0];
      console.log(file);

      const categoryPath = new URLSearchParams(window.location.search).get(
        "categoryPath"
      );
      adminCategories.addCategoryPicture(
        adminCategories._productType,
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
  }
}

