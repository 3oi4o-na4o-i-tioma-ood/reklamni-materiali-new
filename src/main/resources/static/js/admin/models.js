const adminModels = {
    _productType: null,
    _models: [],
    async init(productType) {
        adminModels._productType = productType
        await adminModels.fetchModels()
        adminModels.initModelForm()
        adminModels.initModelColorForm()
    },
    async fetchModels() {
        const modelsResponse = await API.getModels(adminModels._productType, 0, 100000)
        adminModels._models = modelsResponse.result.items
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
            API.createModel({
                model: modelNameInput.value,
                catalogueNumber: modelCatalogueNumberInput.value,
                price: modelPriceInput.value,
                size: modelSizeSelect.value || null
            }, adminModels._productType)
        })
    },

    initModelColorForm() {
        const selectedModelSelect = document.querySelector("#selected-model")
        const primaryColorInput = document.querySelector("#primary-color")
        const secondaryColorInput = document.querySelector("#secondary-color")
        const colorNameInput = document.querySelector("#color-name")
        const modelColorImageInput = document.querySelector("#model-color-image")

        for(const model of adminModels._models) {
            const option = document.createElement("option")
            option.value = model.id
            option.text = model.model + " " + model.catalogueNumber
            selectedModelSelect.appendChild(option)
        }

        NiceSelect.bind(selectedModelSelect, {placeholder: "Модел"})

        const createModelColorButton = document.querySelector("#create-model-color-button")

        createModelColorButton.addEventListener("click", () => {
            adminModels.createModelColor()
        })
    }
}