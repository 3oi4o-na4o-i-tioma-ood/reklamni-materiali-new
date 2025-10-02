const savedTemplatesPage = {
    async _removeDesignFromFavorites(design){
        await API.updateDesign({
            ...design,
            isFavorite: false
        })

        const {
            result: favoriteDesigns
        } = await API.getFavoriteDesigns()
        savedTemplatesPage._renderDesigns(favoriteDesigns)

        const snackbar = document.getElementById("profile-page-snackbar")
        snackbar.innerText = "Дизайнът беше успешно изтрит"
        snackbar.classList.add("visible")

        setTimeout(() => {
            snackbar.classList.remove("visible")
        }, 3000)
    },
    _requestDelete(design) {
        popup.open("delete-design-popup")

        const designNameContainer = document.getElementById("deleted-design-name")
        designNameContainer.innerText = design.name

        const deleteButton = document.getElementById("close-delete-design-button")
        deleteButton.onclick = () => {
            popup.close("delete-design-popup")
        }

        const confirmButton = document.getElementById("confirm-delete-design-button")
        confirmButton.onclick = () => {
            popup.close("delete-design-popup")
            savedTemplatesPage._removeDesignFromFavorites(design)
        }
    },
    _createDesignSecondColumn(design) {
        const secondColumn = document.createElement("div")

        const title = document.createElement("h4")
        const productDescription = products?.find(product => product.name === design.productType)
        title.innerText = productDescription?.displayName

        const buttonsRow = document.createElement("div")
        buttonsRow.classList.add("buttons-row")

        const editButton = document.createElement("a")
        editButton.classList.add("button", "small")
        editButton.innerText = "Редактирай"
        editButton.href = `/${productDescription.url}/дизайн?designId=${design.id}`

        const deleteButton = document.createElement("button")
        deleteButton.classList.add("button", "small", "secondary")
        deleteButton.innerText = "Изтрий"
        deleteButton.addEventListener("click", () => {
            savedTemplatesPage._requestDelete(design)
        })

        buttonsRow.append(editButton, deleteButton)

        secondColumn.append(title, buttonsRow)
        return secondColumn
    },
    _renderDesign(design) {
        const container = document.createElement("div")
        container.classList.add("design")

        const previewImage = document.createElement("img")
        previewImage.src = API.getDesignPreviewImageUrl(design.id, "front")

        const secondColumn = savedTemplatesPage._createDesignSecondColumn(design)

        container.append(previewImage, secondColumn)

        return container
    },
    _renderDesigns(designs) {
        const designElements = designs.map(design => savedTemplatesPage._renderDesign(design))
        const container = document.getElementById("saved-designs-container")
        container.innerText = ""
        container.append(...designElements)
    },
    async init() {
        const {
            result: favoriteDesigns,
            response
        } = await API.getFavoriteDesigns()

        popup.init("delete-design-popup")

        if (response.ok && favoriteDesigns) {
            savedTemplatesPage._renderDesigns(favoriteDesigns)
        }
    }
}

window.addEventListener("load", () => {
    savedTemplatesPage.init()
})