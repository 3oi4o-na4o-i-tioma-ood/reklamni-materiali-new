const editorPreviewPopups = {
    _amount: 0,
    _design: null,
    _faceBlackWhite: null,
    _backBlackWhite: null,
    _previewEffectsTool: null,
    _selectAmountHandler: null,

    async addCartItem(designId, amount, productionTime) {
        let cartId = editorStorage.getUserCartId()
        if (!cartId) {
            cartId = await API.createShoppingCart()
            editorStorage.setCartId(cartId)
        }

        await API.addShoppingCartItem(cartId, {
            designId,
            amount,
            productionTime
        })
    },
    _initSideSelectButtons() {
        const face = document.getElementById("preview-button-select-product-face")
        const back = document.getElementById("preview-button-select-product-back")

        if (!face || !back) {
            return
        }

        face.addEventListener("click", () => {
            face.classList.add("active")
            face.classList.remove("secondary")

            back.classList.remove("active")
            back.classList.add("secondary")

            editorPreviewPopups.renderImage(true)
        })

        back.addEventListener("click", () => {
            back.classList.add("active")
            back.classList.remove("secondary")

            face.classList.remove("active")
            face.classList.add("secondary")

            editorPreviewPopups.renderImage(false)
        })
    },
    renderImage(isFront) {
        const previewPopup = document.getElementById("preview-popup")
        const previewImage = previewPopup.querySelector("#preview-image")
        const previewImageMessage = previewPopup.querySelector("#preview-image-message")

        const designId = editorStorage.getDesignId()

        const isSideAdded = isFront || designRepo.productSides[1]
        previewImageMessage.style.display = isSideAdded ? "none" : null
        previewImage.style.display = isSideAdded ? null : "none"

        previewImage.src = API.getDesignPreviewImageUrl(designId, isFront ? "front" : "back") + "&preventCache=" + new Date().getTime()
    },
    _onDesignChange() {
        const backBwCheckbox = document.getElementById("preview-cart-checkbox-back-bw")

        const design = editorPreviewPopups._design

        if (!design.back) {
            backBwCheckbox.parentElement.classList.add("disabled")
        }
        else {
            backBwCheckbox.parentElement.classList.remove("disabled")
        }
        backBwCheckbox.disabled = !design.back
    },
    async openPreview(isCart) {
        const previewPopup = document.getElementById("preview-popup")

        const designId = await designRepo.updateOrCreateDesign()

        if (!designId) {
            return
        }

        editorPreviewPopups._previewEffectsTool.update()

        await editorPreviewPopups._updatePrice()

        const { result: design } = await API.getDesign(designId)
        editorPreviewPopups._design = design
        editorPreviewPopups._onDesignChange()

        editorPreviewPopups.renderImage(true)

        popup.open("preview-popup")
        previewPopup.classList[isCart ? "add" : "remove"]("cart")

        editorPreviewPopups._initSideSelectButtons()
    },
    initPreviewPopup() {
        const openPreviewButton = document.getElementById("button-open-preview")
        openPreviewButton.addEventListener("click", () => editorPreviewPopups.openPreview(false))
    },
    _getSelectColorsCount() {
        const selectedColorCount = document.querySelector('.preview-popup input[name="colors-count"]:checked');
        return selectedColorCount ? selectedColorCount.value : 'ONE_COLOR';
    },
    _getPrintType() {
        if (["PEN", "LIGHTER"].includes(editor.currentProduct)) {
            const selectedRadio = document.querySelector('.preview-popup input[name="print-type"]:checked');
            const printKind = selectedRadio ? selectedRadio.value : 'SCREEN';

            if (printKind === "FULL_COLOR") {
                return "FULL_COLOR"
            }

            return printKind + "_" + editorPreviewPopups._getSelectColorsCount()
        }

        if (editor.currentProduct === "WORK_CALENDAR") {
            return "NORMAL"
        }

        const face = editorPreviewPopups._faceBlackWhite ? "BLACK" : "COLORED"
        const backColored = editorPreviewPopups._faceBlackWhite ? "BLACK" : "COLORED"
        const back = editorPreviewPopups._design?.back ? backColored : "NO_BACK"

        const printType = face + "_" + back

        if (printType === "BLACK_COLORED") {
            return "COLORED_BLACK"
        }

        return printType
    },
    _initPrintColorSelect() {
        const faceBwCheckbox = document.getElementById("preview-cart-checkbox-face-bw")
        const backBwCheckbox = document.getElementById("preview-cart-checkbox-back-bw")
        async function onChange() {
            designRepo.printType = editorPreviewPopups._getPrintType()
            await editorPreviewPopups._updatePrice()
        }

        faceBwCheckbox.addEventListener("change", async e => {
            console.log("Check event: ", e)
            editorPreviewPopups._faceBlackWhite = e.target.checked
            await onChange()
        })

        backBwCheckbox.addEventListener("change", async e => {
            console.log("Check event: ", e)
            editorPreviewPopups._backBlackWhite = e.target.checked
            await onChange()
        })
    },
    _initPrintTypeSelect() {
        const printTypeRadios = document.querySelectorAll('.preview-popup input[name="print-type"]');
        const colorsCountRadios = document.querySelectorAll('.preview-popup input[name="colors-count"]');
        const colorsCountContainer = document.getElementById('colors-count-container');

        function updateColorsCountVisibility(printType) {
            if (printType === 'FULL_COLOR') {
                colorsCountContainer.classList.add('disabled');
                colorsCountRadios.forEach(radio => radio.disabled = true);
            } else {
                colorsCountContainer.classList.remove('disabled');
                colorsCountRadios.forEach(radio => radio.disabled = false);
            }
        }

        // Initialize visibility based on current selection
        const initialPrintType = document.querySelector('.preview-popup input[name="print-type"]:checked')?.value;
        updateColorsCountVisibility(initialPrintType);

        async function onChange() {
            const selectedPrintType = document.querySelector('.preview-popup input[name="print-type"]:checked')?.value;
            updateColorsCountVisibility(selectedPrintType);

            designRepo.printType = editorPreviewPopups._getPrintType();
            await editorPreviewPopups._updatePrice();
            editorPreviewPopups._updateSelectAmount()
        }

        // Add listeners to print type radios
        printTypeRadios.forEach(radio => {
            radio.addEventListener('change', onChange);
        });

        // Add listeners to colors count radios
        colorsCountRadios.forEach(radio => {
            radio.addEventListener('change', onChange);
        });
    },
    _getPrintPrice(priceAmounts) {
        const printPrice = priceAmounts.find(amount => amount.amount === editorPreviewPopups._amount)?.price

        if(["PEN", "LIGHTER", "WORK_CALENDAR"].includes(editor.currentProduct)) {
            return printPrice * editorPreviewPopups._amount
        }

        return printPrice
    },
    async _updatePrice() {
        const { priceAmounts: amounts, modelPrice } = await editorPreviewPopups._getPrices()
        console.log(amounts)
        const basePrice = (modelPrice || 0) * editorPreviewPopups._amount

        const priceContainer = document.getElementById("cart-price")
        const priceContainerAfterTax = document.getElementById("cart-price-after-tax")

        const printPrice = editorPreviewPopups._getPrintPrice(amounts)
        const price = basePrice + printPrice

        const effectsOverhead = await pricesCalculation.getEffectsOverhead(designRepo.effects, editor.currentProduct, editorPreviewPopups._amount)

        // const clichePrice = await editorPreviewPopups._getClichePrice()

        const priceWithEffects = price + effectsOverhead //+ clichePrice
        const formattedPrice = pricesCalculation.formatPrice(priceWithEffects)

        priceContainer.innerText = formattedPrice
        priceContainerAfterTax.innerText = `(${pricesCalculation.formatPrice(priceWithEffects * 1.2)} с ДДС)`
    },
    // async _getClichePrice() {
    //     return 0;
    //     const clicheName = "CLICHE_" + editorPreviewPopups._getSelectColorsCount()
    //     const price = await pricesCalculation.getCartItemAmountsPrices(editor.currentProduct, designRepo.modelColorId, clicheName)
    //     return price.priceAmounts[0]?.price
    // },
    async _getPrices() {
        const printType = editorPreviewPopups._getPrintType();
        console.log(printType)
        const modelColorId = designRepo.modelColorId
        return await pricesCalculation.getCartItemAmountsPrices(editor.currentProduct, modelColorId, printType)
    },
    _getInitialAmount(amounts) {
        const sorted = [...amounts].sort(amount => amount.amount)
        return sorted[1] || sorted[0]
    },
    async _getSelectedAmount() {
        if (editorPreviewPopups._amount) {
            return editorPreviewPopups._amount
        }

        const amounts = await editorPreviewPopups._getPrices()

        return editorPreviewPopups._getInitialAmount(amounts)?.amount
    },
    async _updateSelectAmount() {
        const selectAmount = document.getElementById("product-amount-select")
        selectAmount.innerHTML = ""

        const { priceAmounts: amounts } = await editorPreviewPopups._getPrices()

        const options = amounts.map(amount => {
            const option = document.createElement("option")
            option.innerText = amount.amount + " бр."
            option.value = amount.amount
            return option
        })

        selectAmount.append(...options)

        const initialAmount = editorPreviewPopups._getInitialAmount(amounts)?.amount

        selectAmount.value = initialAmount
        editorPreviewPopups._amount = initialAmount

        editorPreviewPopups._selectAmountHandler?.update()
    },
    async _initSelectAmount() {
        await editorPreviewPopups._updateSelectAmount()
        
        const selectAmount = document.getElementById("product-amount-select")
        editorPreviewPopups._selectAmountHandler = NiceSelect.bind(selectAmount, { placeholder: "Брой" })


        selectAmount.addEventListener("change", async e => {
            const value = e.target.value

            editorPreviewPopups._amount = Number(value)

            await editorPreviewPopups._updatePrice()
        })
    },
    _initEffects() {

        editorPreviewPopups._previewEffectsTool = newEffectsTool({
            baseInputId: "preview-effect-checkbox",
            async onChange(e) {
                effectsTool.update()
                await editorPreviewPopups._updatePrice()
            }
        }
        )

        editorPreviewPopups._previewEffectsTool.init()
    },
    _showRelevantSettings() {
        const hiddenIds = []
        switch (editor.currentProduct) {
            case "PEN":
            case "LIGHTER":
                hiddenIds.push("effects-container", "colors-container")
                break;
            case "WORK_CALENDAR":
                hiddenIds.push("colors-container", "preview-effect-checkbox-ROUNDED_CORNERS-container", "preview-effect-checkbox-PARTIAL_VARNISH-container", "colors-count-container", "print-type")
                break;
            case "BUSINESS_CARD":
            case "POCKET_CALENDAR":
                hiddenIds.push("preview-effect-checkbox-PARTIAL_VARNISH-container", "colors-count-container", "print-type")
                break;
            case "FLIER_10x15":
            case "FLIER_10x20":
                hiddenIds.push("preview-effect-checkbox-PARTIAL_VARNISH-container", "colors-count-container", "print-type", "preview-effect-checkbox-ROUNDED_CORNERS-container")
                break;
            default:
                break;
        }

        hiddenIds.forEach(id => {
            const element = document.getElementById(id)
            if (element) {
                element.style.display = "none"
            }
        })
    },
    async initCartPreviewPopup() {
        const openCartPreviewButton = document.getElementById("button-open-cart-preview")

        openCartPreviewButton.addEventListener("click", () => {
            editorPreviewPopups.openPreview(true);
        })

        editorPreviewPopups._showRelevantSettings()

        editorPreviewPopups._initPrintColorSelect()

        await editorPreviewPopups._initSelectAmount()

        editorPreviewPopups._initEffects()

        editorPreviewPopups._initPrintTypeSelect()

        const addToCartButton = document.getElementById("button-add-to-cart")
        addToCartButton.addEventListener("click", async () => {
            addToCartButton.classList.add("disabled")

            const designId = editorStorage.getDesignId()
            // const design = {...editorPreviewPopups._design}

            await API.updateDesign(designRepo.getDesignData())

            await editorPreviewPopups.addCartItem(designId, await editorPreviewPopups._getSelectedAmount(), "NORMAL")
            editorStorage.setDesignId(null)

            // window.location.href = "/количка"

            const snackbar = document.getElementById("add-to-cart-snackbar")
            snackbar.classList.add("visible")

            setTimeout(() => {
                snackbar.classList.remove("visible")
            }, 3000)

            popup.close("preview-popup")
        })
    },
    init() {
        popup.init("preview-popup")
        editorPreviewPopups.initPreviewPopup()
        editorPreviewPopups.initCartPreviewPopup()
    }
}