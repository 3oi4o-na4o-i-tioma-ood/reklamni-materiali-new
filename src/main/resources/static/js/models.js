const colorButtonsModule = {
    _handleColorButtonClick(model, colorButtons, colorButtonIndex) {
        const colorButton = colorButtons[colorButtonIndex]

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
                colorButtonsModule._handleColorButtonClick(model, colorButtons, colorButtonIndex)
            })
        })
    },
    init() {
        const modelsContainer = document.getElementById("models-container")

        const models = [...modelsContainer.children]

        models.forEach(model => {
            colorButtonsModule._initColorButtonsForModel(model)
        })
    },
}

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
            colorButtonsModule.init()
        }

        modelsPage.initModelPopups()
    }
}