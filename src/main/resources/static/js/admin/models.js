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
            const modelNameError = document.querySelector("#model-name-error")
            const modelCatalogueNumberError = document.querySelector("#model-catalogue-number-error")
            const modelPriceError = document.querySelector("#model-price-error")

            if(modelNameInput.value === "") {
                modelNameError.innerText = "Това поле е задължително"
                return
            }
            else {
                modelNameError.innerText = ""
            }

            if(modelCatalogueNumberInput.value === "") {
                modelCatalogueNumberError.innerText = "Това поле е задължително"
                return
            }
            else {
                modelCatalogueNumberError.innerText = ""
            }

            if(modelPriceInput.value === "") {
                modelPriceError.innerText = "Това поле е задължително"
                return
            }
            else {
                modelPriceError.innerText = ""
            }

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

        const primaryColorError = document.querySelector("#primary-color-error")
        const secondaryColorError = document.querySelector("#secondary-color-error")
        const colorNameError = document.querySelector("#color-name-error")
        const modelColorImageError = document.querySelector("#model-color-image-error")
        const submitButton = document.getElementById("create-model-color-button")

        for(const model of adminModels._models) {
            const option = document.createElement("option")
            option.value = model.id
            option.text = model.model + " " + model.catalogueNumber
            selectedModelSelect.appendChild(option)
        }

        NiceSelect.bind(selectedModelSelect, {placeholder: "Модел"})


        modelColorImageInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            console.log(file);


            const selectedImageContainer = document.querySelector("#selected-image-container")
            selectedImageContainer.style.display = "block"
            const selectedImage = document.querySelector("#selected-image")
            selectedImage.src = URL.createObjectURL(file)
        })

        submitButton.addEventListener("click", () => {
            const hexColorRegex = /^(?:[A-Fa-f0-9]{3}){1,2}$/;

            if(primaryColorInput.value === "") {
                primaryColorError.innerText = "Това поле е задължително"
                return
            }
            else if(!hexColorRegex.test(primaryColorInput.value.trim())) {
                primaryColorError.innerText = "Въведете валиден HEX цвят (напр. A1B2C3)"
                return
            }
            else {
                primaryColorError.innerText = ""
            }

            if(secondaryColorInput.value === "") {
                secondaryColorError.innerText = "Това поле е задължително"
                return
            }
            else if(!hexColorRegex.test(secondaryColorInput.value.trim())) {
                secondaryColorError.innerText = "Въведете валиден HEX цвят (напр. A1B2C3)"
                return
            }
            else {
                secondaryColorError.innerText = ""
            }

            if(colorNameInput.value === "") {
                colorNameError.innerText = "Това поле е задължително"
                return
            }
            else {
                colorNameError.innerText = ""
            }

            if(modelColorImageInput.files.length === 0) {
                modelColorImageError.innerText = "Изберете изображение"
                return
            }
            else {
                modelColorImageError.innerText = ""
            }

            API.createModelColor({
                primaryColor: primaryColorInput.value,
                secondaryColor: secondaryColorInput.value,
                name: colorNameInput.value,
                modelId: selectedModelSelect.value,
                product: adminModels._productType,
                image: modelColorImageInput.files[0]
            })
        })
    },
    _initModelDeleteButton(modelContainer, modelIndex) {
        const deleteModelButton = modelContainer.querySelector("#delete-model-button")
        deleteModelButton.addEventListener("click", () => {
            const model = adminModels._models[modelIndex]
            API.deleteModel(adminModels._productType, model.id)
        })
    },
    initModelDeleteButtons() {
        const modelsContainer = document.getElementById("models-container")
        const models = [...modelsContainer.children]

        models.forEach((model, modelIndex) => {
            adminModels._initModelDeleteButton(model, modelIndex)
        })
    },
    _initModelColorDeleteButton(modelContainer, modelIndex) {
        const deleteModelColorButton = modelContainer.querySelector("#delete-model-color-button")
        const colorButtons = [...modelContainer.querySelectorAll(".colors-container button")]
        selectedColorIndex = colorButtons.findIndex(button => button.classList.contains("selected"))
        deleteModelColorButton.addEventListener("click", () => {
            const model = adminModels._models[modelIndex]
            const modelColor = model.colors[selectedColorIndex]
            API.deleteModelColor(adminModels._productType, modelColor.id)
        })
    },
    initModelColorDeleteButtons() {
        const modelsContainer = document.getElementById("models-container")
        const models = [...modelsContainer.children]

        models.forEach((model, modelIndex) => {
            adminModels._initModelColorDeleteButton(model, modelIndex)
        })
    }
}