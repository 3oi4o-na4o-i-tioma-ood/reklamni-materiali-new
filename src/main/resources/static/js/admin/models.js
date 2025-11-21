const adminModels = {
    _productType: null,
    init(productType) {
        adminModels._productType = productType
        adminModels.initModelForm()
        adminModels.initModelColorForm()
    },
    async fetchModels() {
        const modelsResponse = await API.getModels()
    },
    async initModelForm() {
        const modelNameInput = document.querySelector("#model-name")
        const modelCatalogueNumberInput = document.querySelector("#model-catalogue-number")
        const modelPriceInput = document.querySelector("#model-price")
        const modelSizeSelect = document.querySelector("#model-size")

        if(adminModels._productType === "WORK_CALENDAR") {
            for(const size of ["SMALL", "MEDIUM", "BIG"]) {
                const option = document.createElement("option")
                option.value = size
                option.text = size
                modelSizeSelect.options.push(option)
            }

            NiceSelect.bind(modelSizeSelect, {placeholder: "Размер"})
        }
        else {
            modelSizeSelect.style.display = "none"
        }


        const createModelButton = document.querySelector("#create-model-button")

        createModelButton.addEventListener("click", () => {
            adminModels.createModel()
        })
    },

    initModelColorForm() {
        const selectedModelSelect = document.querySelector("#selected-model")
        const primaryColorInput = document.querySelector("#primary-color")
        const secondaryColorInput = document.querySelector("#secondary-color")
        const colorNameInput = document.querySelector("#color-name")
        const modelColorImageInput = document.querySelector("#model-color-image")

        NiceSelect.bind(selectedModelSelect, {placeholder: "Модел"})

        const createModelColorButton = document.querySelector("#create-model-color-button")

        createModelColorButton.addEventListener("click", () => {
            adminModels.createModelColor()
        })
    }
}