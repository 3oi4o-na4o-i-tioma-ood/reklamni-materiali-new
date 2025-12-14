const adminModels = {
    _productType: null,
    _models: [],
    _confirmPopupId: "delete-model-confirm-popup",
    _confirmTitleEl: null,
    _confirmMessageEl: null,
    _confirmPreviewEl: null,
    _confirmActionButton: null,
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

            if(secondaryColorInput.value && !hexColorRegex.test(secondaryColorInput.value.trim())) {
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
    _ensureConfirmPopup() {
        let popupElement = document.getElementById(adminModels._confirmPopupId)
        if (!popupElement) {
            popupElement = document.createElement("div")
            popupElement.id = adminModels._confirmPopupId
            popupElement.classList.add("popup")
            popupElement.innerHTML = `
                <div class="content">
                    <div class="header">
                        <span id="delete-confirm-title">Потвърждение</span>
                        <button type="button" class="icon-button close-button" aria-label="Затвори">&#215;</button>
                    </div>
                    <div class="popup-body">
                        <p id="delete-confirm-message" class="delete-popup-text"></p>
                        <div id="delete-confirm-preview" class="delete-popup-image-wrapper confirm-preview"></div>
                        <div class="delete-popup-actions">
                            <button type="button" class="button primary" id="delete-confirm-button">Да</button>
                        </div>
                    </div>
                </div>
            `
            document.body.appendChild(popupElement)
            popup.init(adminModels._confirmPopupId)
        }

        adminModels._confirmTitleEl = popupElement.querySelector("#delete-confirm-title")
        adminModels._confirmMessageEl = popupElement.querySelector("#delete-confirm-message")
        adminModels._confirmPreviewEl = popupElement.querySelector("#delete-confirm-preview")
        adminModels._confirmActionButton = popupElement.querySelector("#delete-confirm-button")
    },
    _openConfirmPopup({ title, message, previewBuilder, onConfirm }) {
        adminModels._ensureConfirmPopup()

        if (adminModels._confirmTitleEl) {
            adminModels._confirmTitleEl.innerText = title
        }
        if (adminModels._confirmMessageEl) {
            adminModels._confirmMessageEl.innerText = message
        }
        if (adminModels._confirmPreviewEl) {
            adminModels._confirmPreviewEl.innerHTML = ""
            if (typeof previewBuilder === "function") {
                const previewContent = previewBuilder()
                if (previewContent) {
                    if (Array.isArray(previewContent)) {
                        adminModels._confirmPreviewEl.append(...previewContent)
                    } else {
                        adminModels._confirmPreviewEl.append(previewContent)
                    }
                }
            }
        }
        if (adminModels._confirmActionButton) {
            adminModels._confirmActionButton.onclick = async () => {
                popup.close(adminModels._confirmPopupId)
                await onConfirm()
            }
        }

        popup.open(adminModels._confirmPopupId)
    },
    _initModelDeleteButton(modelContainer, modelIndex) {
        const deleteModelButton = modelContainer.querySelector("#delete-model-button")
        deleteModelButton.addEventListener("click", () => {
            const model = adminModels._models[modelIndex]
            adminModels._openConfirmPopup({
                title: "Изтриване на модел",
                message: "Сигурни ли сте, че искате да изтриете този модел?",
                previewBuilder: () => {
                    const wrapper = document.createElement("div")
                    wrapper.classList.add("confirm-model-info")
                    const name = document.createElement("div")
                    name.innerText = `${model.model} (${model.catalogueNumber || "без каталог"})`
                    const price = document.createElement("div")
                    price.classList.add("confirm-model-price")
                    price.innerText = model.price ? `${model.price} лв.` : ""
                    wrapper.append(name, price)
                    return wrapper
                },
                onConfirm: async () => {
                    await API.deleteModel(model.id)
                }
            })
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

        deleteModelColorButton.addEventListener("click", () => {
            selectedColorIndex = colorButtons.findIndex(button => button.classList.contains("selected"))
            const model = adminModels._models[modelIndex]
            const modelColor = model.colors[selectedColorIndex]
            adminModels._openConfirmPopup({
                title: "Изтриване на цвят",
                message: "Сигурни ли сте, че искате да изтриете този цвят?",
                previewBuilder: () => {
                    const preview = document.createElement("div")
                    preview.classList.add("confirm-color-preview")

                    const swatch = document.createElement("div")
                    swatch.classList.add("confirm-color-swatch")
                    swatch.style.background = modelColor.secondaryColor
                        ? `linear-gradient(90deg, ${modelColor.primaryColor} 0 50%, ${modelColor.secondaryColor} 50% 100%)`
                        : modelColor.primaryColor

                    const meta = document.createElement("div")
                    meta.classList.add("confirm-color-meta")
                    meta.innerText = modelColor.name || ""

                    preview.append(swatch, meta)
                    return preview
                },
                onConfirm: async () => {
                    await API.deleteModelColor(modelColor.id)
                }
            })
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