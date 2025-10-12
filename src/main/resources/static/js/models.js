const modelsPage = {
    _productType: null,
    _skipCategoriesPage: null,
    _hasColorButtons: null,

    _updateContinueLink(modelColorId) {
        const link = document.getElementById("continue-link")

        const product = products.find(product => product.name === modelsPage._productType)

        const urlQuery = `?modelColorId=${modelColorId}`

        link.classList.remove("disabled")
        
        if(modelsPage._skipCategoriesPage) {   
            link.href = `/${product.url}/дизайн${urlQuery}`
        }
        else {
            link.href = `/категории/${product.url}${urlQuery}`
        }
    },
    _handleColorButtonClick(model, colorButtons, colorButtonIndex) {
        const colorButton = colorButtons[colorButtonIndex]

        // const modelColorId = Number(colorButton.getAttribute("data-id")) || null

        // modelsPage._updateContinueLink(modelColorId)

        colorButtons.forEach(otherColorButton => {
            otherColorButton.classList.remove("selected")
        })

        colorButton.classList.add("selected")

        const images = model.querySelectorAll(".images-container img")

        images.forEach((image, index) => {
            if (index === colorButtonIndex) {
                image.style.display = "block"
            }
            else {
                image.style.display = "none"
            }
        })
    },
    _initColorButtonsForModel(model) {
        const colorButtons = model.querySelectorAll(".colors-container button")

        colorButtons.forEach((colorButton, colorButtonIndex) => {
            colorButton.addEventListener("click", () => {
                modelsPage._handleColorButtonClick(model, colorButtons, colorButtonIndex)
            })
        })
    },
    _initColorButtons() {
        const modelsContainer = document.getElementById("models-container")

        const models = [...modelsContainer.children]

        models.forEach(model => {
            modelsPage._initColorButtonsForModel(model)

            // model.addEventListener("click", () => {
            //     console.log("Click model")
            //     // const selectedColorButton = model.querySelector(".colors-container button.selected") || model.querySelectorAll(".colors-container button")[0]

            //     const modelColorId = Number(model.getAttribute("data-id")) || null

            //     modelsPage._updateContinueLink(modelColorId)

            //     models.forEach(otherModel => {
            //         otherModel.classList.remove("selected")
            //     })

            //     model.classList.add("selected")

            // })
        })
    },
    async openModelPopup(modelId, modelColorId) {
        const popupId = "model-info-popup"
        const {result: modelData} = await API.getModel(modelId)
        const {result: modelColorData} = await API.getModelColor(modelColorId)

        const popupElement = document.getElementById(popupId)

        // const popupBody = popupElement.querySelector(".popup-body")

        modelsPage._updateContinueLink(modelColorId)

        const image = popupElement.querySelector("#popup-model-image")
        image.src = `/api/model-image?modelColorId=${modelColorId}`

        console.log(modelData)

        const headerText = popupElement.querySelector("#popup-header-text")
        headerText.innerText = modelData.model + ', ' + modelColorData.name

        popup.init(popupId)
        popup.open(popupId)
    },
    initModelPopups() {
        const modelsContainer = document.getElementById("models-container")

        const models = [...modelsContainer.children]

        models.forEach(model => {
            const button = model.querySelector("#model-popup-button")

            button.addEventListener("click", () => {
                const modelId = Number(model.getAttribute("data-model-id")) || null
                let modelColorId = null

                if(modelsPage._hasColorButtons) {
                    const selectedColorButton = model.querySelector(".colors-container button.selected") || model.querySelectorAll(".colors-container button")[0]
                    modelColorId = Number(selectedColorButton.getAttribute("data-model-color-id")) || null
                }
                else {
                    modelColorId = Number(model.getAttribute("data-model-color-id")) || null
                }

                modelsPage.openModelPopup(modelId, modelColorId)
            })
        })
    },
    init({productType, skipCategoriesPage, hasColorButtons}) {
        modelsPage._productType = productType
        modelsPage._skipCategoriesPage = skipCategoriesPage
        modelsPage._hasColorButtons = hasColorButtons

        if(hasColorButtons) {
            modelsPage._initColorButtons()
        }

        modelsPage.initModelPopups()
    }
}