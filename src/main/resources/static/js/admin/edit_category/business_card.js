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
                this.init('BUSINESS_CARD');
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
    showSnackbar(){
        const snackbar = document.getElementById("files-added-snackbar")
        snackbar.classList.add("visible")

        setTimeout(() => {
            snackbar.classList.remove("visible")
        }, 3000)
    },
    async _uploadImage(file) {

    },
    async init(productType) {
        editCategory._productType = productType

        const categoryPath = new URLSearchParams(window.location.search).get("categoryPath")
        await editCategory.updateImages(0, categoryPath)

        pagination.generateButtons(Math.ceil(editCategory._imagesTotal / editCategory._pageSize), "pagination-container", (page_number) => {
            editCategory.updateImages(page_number, categoryPath)
        })

        // imageUpload.init("image-upload", _uploadImage)
    }
}

window.addEventListener("load", () => {
    editCategory.init("BUSINESS_CARD")
})