const editCategory = {
    _productType: null,
    _pageSize: 12,
    _imagesTotal: null,
    _deletePopupId: "delete-category-image-popup",
    _deletePopupImage: null,
    _confirmDeleteButton: null,
    _createImages(images) {
        const productType = editCategory._productType
        return images.map(image => {
            const img = document.createElement("img")
            const imageUrl = API.getImageUrl(productType, image)
            img.src = imageUrl
            const productDescription = products.find(product => product.name === productType)
            img.style.aspectRatio = productDescription.sizeMM.width / productDescription.sizeMM.height
            const container = document.createElement("div")
            container.classList.add("image-container")

            const deleteButton = document.createElement("button")
            deleteButton.classList.add("delete-button")
            deleteButton.addEventListener("click", () => {
                const imagePath = editCategory._getImagePathFromUrl(img.src)

                editCategory._openDeletePopup(img.src, async () => {
                    await adminCategories.deleteCategoryPicture(productType, imagePath);
                    this.init(productType);
                })
            })
            deleteButton.innerHTML = "&#215;"

            container.append(img, deleteButton)

            return container
        })
    },
    _createDeletePopup() {
        const existingPopup = document.getElementById(editCategory._deletePopupId)
        if (existingPopup) {
            editCategory._deletePopupImage = existingPopup.querySelector("#delete-popup-image-preview")
            editCategory._confirmDeleteButton = existingPopup.querySelector("#confirm-delete-image-button")
            return
        }

        const popupElement = document.createElement("div")
        popupElement.id = editCategory._deletePopupId
        popupElement.classList.add("popup")
        popupElement.innerHTML = `
            <div class="content">
                <div class="header">
                    <span>Изтриване на фон</span>
                    <button type="button" class="icon-button close-button" aria-label="Затвори">&#215;</button>
                </div>
                <div class="popup-body">
                    <p class="delete-popup-text">Сигурни ли сте, че искате за изтриете този фон?</p>
                    <div class="delete-popup-image-wrapper">
                        <img id="delete-popup-image-preview" alt="Фон за изтриване">
                    </div>
                    <div class="delete-popup-actions">
                        <button type="button" class="button primary" id="confirm-delete-image-button">Да</button>
                    </div>
                </div>
            </div>
        `

        document.body.appendChild(popupElement)
        popup.init(editCategory._deletePopupId)

        editCategory._deletePopupImage = popupElement.querySelector("#delete-popup-image-preview")
        editCategory._confirmDeleteButton = popupElement.querySelector("#confirm-delete-image-button")
    },
    _openDeletePopup(imageUrl, onConfirm) {
        editCategory._createDeletePopup()
        if (editCategory._deletePopupImage) {
            editCategory._deletePopupImage.src = imageUrl
        }

        if (editCategory._confirmDeleteButton) {
            editCategory._confirmDeleteButton.onclick = async () => {
                popup.close(editCategory._deletePopupId)
                await onConfirm()
            }
        }

        popup.open(editCategory._deletePopupId)
    },
    _getImagePathFromUrl(imageUrl) {
        try {
            return new URL(imageUrl, window.location.href).searchParams.get("path")
        } catch (e) {
            return new URLSearchParams(imageUrl).get("path")
        }
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

            // Show success notification
            const snackbar = document.getElementById("snackbar");
            snackbar.innerHTML = "Изображението е добавено успешно! Презаредете страницата за да видите промяната.";
            snackbar.classList.add("visible");

            setTimeout(() => {
                snackbar.classList.remove("visible");
            }, 3000);

        } catch (error) {
            console.error("Error adding the category picture:", error);

            // Show error notification
            //   alert("Error adding Image");
            throw error;
        }
    },
    async init(productType) {
        editCategory._productType = productType
        editCategory._createDeletePopup()

        const categoryPath = new URLSearchParams(window.location.search).get("categoryPath")
        await editCategory.updateImages(0, categoryPath)

        pagination.generateButtons(Math.ceil(editCategory._imagesTotal / editCategory._pageSize), "pagination-container", (page_number) => {
            editCategory.updateImages(page_number, categoryPath)
        })

        editCategory.addImageUploadListener();

        // imageUpload.init("image-upload", _uploadImage)
    }
}