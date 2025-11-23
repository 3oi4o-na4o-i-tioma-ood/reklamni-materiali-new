const editCategory = {
    _productType: null,
    _pageSize: 12,
    _imagesTotal: null,
    _createImages(images) {
        return images.map(image => {
            const img = document.createElement("img")
            img.src = API.getImageUrl(editCategory._productType, image)
            const productDescription = products.find(product => product.name === editCategory._productType)
            img.style.aspectRatio = productDescription.sizeMM.width / productDescription.sizeMM.height
            const container = document.createElement("div")
            container.classList.add("image-container")

            const deleteButton = document.createElement("button")
            deleteButton.classList.add("delete-button")
            deleteButton.addEventListener("click", async (e) => {
                const path = e.target.previousElementSibling?.src;
                const imagePath = new URLSearchParams(path).get("path")

                await adminCategories.deleteCategoryPicture(editCategory._productType, imagePath);
                this.init(editCategory._productType);
            })
            deleteButton.innerHTML = "&#215;"

            container.append(img, deleteButton)

            return container
        })
    },
    async updateImages(page_number, categoryPath) {
        const images = await API.getPictures(editCategory._productType, page_number, editCategory._pageSize, categoryPath);
        editCategory._imagesTotal = images.total
        const imagesContainer = document.getElementById("images-container")
        imagesContainer.innerText = ""
        imagesContainer.append(...editCategory._createImages(images.images))
    },
    showSnackbar() {
        const snackbar = document.getElementById("files-added-snackbar")
        snackbar.classList.add("visible")

        setTimeout(() => {
            snackbar.classList.remove("visible")
        }, 3000)
    },
    async _uploadImage(file) {

    },

    addImageUploadListener() {
        const uploadElement = document.getElementById("admin-image-upload");
        console.log(uploadElement);
        if (!uploadElement) {
            return; // Skip if element doesn't exist on the page
        }

        uploadElement.addEventListener("change", (e) => {
            const file = e.target.files[0];
            console.log(file);

            const categoryPath = new URLSearchParams(window.location.search).get(
                "categoryPath"
            );
            editCategory.addCategoryPicture(
                editCategory._productType,
                file.name,
                categoryPath,
                file
            );
        });
    },
    async addCategoryPicture(productType, fileName, pathName, image) {
        const searchParams = new URLSearchParams();

        const formData = new FormData();
        searchParams.set("productType", productType);
        searchParams.set("fileName", fileName || "");
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
    async init(productType) {
        editCategory._productType = productType

        const categoryPath = new URLSearchParams(window.location.search).get("categoryPath")
        await editCategory.updateImages(0, categoryPath)

        pagination.generateButtons(Math.ceil(editCategory._imagesTotal / editCategory._pageSize), "pagination-container", (page_number) => {
            editCategory.updateImages(page_number, categoryPath)
        })

        editCategory.addImageUploadListener();

        // imageUpload.init("image-upload", _uploadImage)
    }
}