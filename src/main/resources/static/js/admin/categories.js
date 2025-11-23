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
}

