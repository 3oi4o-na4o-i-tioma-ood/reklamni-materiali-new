const shoppingCart = {
    _cartId: null,
    _cart: null,
    _updateCartItemData(id, update) {
        if (!shoppingCart._cart) {
            return
        }

        shoppingCart._cart = {
            ...shoppingCart._cart,
            items: shoppingCart._cart.items.map(item => item.id === id ? {
                ...item,
                ...update
            } : item)
        }
    },
    _getCartItemHtmlId(id) {
        return "cart-item-" + id
    },
    _getCartItemElement(id) {
        return document.getElementById(shoppingCart._getCartItemHtmlId(id))
    },
    async _updateCartItemPrice(itemId) {
        const item = shoppingCart._cart.items.find(item => item.id === itemId)
        const itemElement = shoppingCart._getCartItemElement(itemId)

        const priceContainer = itemElement.querySelector("#item-price")
        const price = await shoppingCart._getItemPrice(item)
        priceContainer.innerText = pricesCalculation.formatPrice(price)
    },
    async _getItemStandardPrice(item) {
        const price = await pricesCalculation.getCartItemPrice({
            ...item.design,
            printType: item.design.printType || "COLORED_NO_BACK",
            amount: item.amount
        })

        return price
    },
    async _getItemPrice(item) {
        const standard = await shoppingCart._getItemStandardPrice(item)
        console.log("Get price of item: ", item)
        return standard * pricesCalculation.getProductionTimeCoefficient(item.productionTime || "NORMAL")
    },
    _createItemDeleteButton(deleteItem) {
        const deleteButton = document.createElement("button")
        const icon = document.createElement("img")
        icon.src = "/images/common/delete.svg"

        deleteButton.append(icon)
        deleteButton.addEventListener("click", async () => {
            deleteButton.classList.add("disabled")

            deleteItem()
        })

        return deleteButton
    },
    async _createItemRightSection(item, deleteItem) {
        const rightSection = document.createElement("div")
        rightSection.classList.add("right-section")

        rightSection.append(shoppingCart._createItemDeleteButton(deleteItem))

        const priceContainer = document.createElement("span")
        priceContainer.classList.add("price-container")
        priceContainer.id = "item-price"
        const price = await shoppingCart._getItemPrice(item)
        priceContainer.innerText = pricesCalculation.formatPrice(price)
        rightSection.append(priceContainer)

        return rightSection
    },
    async _createAmountSelect(item) {
        console.log("_createAmountSelect: ", item)
        const {
            priceAmounts
        } = await pricesCalculation.getCartItemAmountsPrices(item.design.productType, item.design.modelColorId, (item.design.printType || "COLORED_NO_BACK"))
        
        console.log(priceAmounts)
        const amountSelect = document.createElement("select")
        const amountSelectOptions = priceAmounts.map(op => {
            const option = document.createElement("option")
            option.value = op.amount
            option.innerText = op.amount
            return option
        })
        amountSelect.append(...amountSelectOptions)
        amountSelect.value = item.amount

        amountSelect.addEventListener("change", async e => {
            shoppingCart._updateCartItemData(item.id, {
                amount: Number(e.target.value)
            })

            await shoppingCart._updateCartItemPrice(item.id)
            await shoppingCart.updateTotalPrice(shoppingCart._cart)
        })

        return amountSelect
    },
    _createProductionTimeSelect(item) {
        const productionTimeOptions = [
            {
                name: "Стандартна",
                value: "NORMAL"
            },
            {
                name: "Бърза",
                value: "FAST"
            },
            {
                name: "Експресна",
                value: "EXPRESS"
            }
        ]

        const productionTimeSelect = document.createElement("select")
        const options = productionTimeOptions.map(op => {
            const option = document.createElement("option")
            option.value = op.value
            option.innerText = op.name
            return option
        })
        productionTimeSelect.append(...options)
        productionTimeSelect.value = item.productionTime

        productionTimeSelect.addEventListener("change", async e => {
            console.log("Change prod time: ", e.target.value)
            shoppingCart._updateCartItemData(item.id, {
                productionTime: e.target.value
            })

            await shoppingCart._updateCartItemPrice(item.id)
            await shoppingCart.updateTotalPrice(shoppingCart._cart)
        })

        return productionTimeSelect
    },
    async _createItemSettings(item) {
        const itemSettings = document.createElement("div")
        itemSettings.classList.add("item-settings")

        const amountSelect = await shoppingCart._createAmountSelect(item)
        const productionTimeSelect = shoppingCart._createProductionTimeSelect(item)

        itemSettings.append(amountSelect, productionTimeSelect)

        NiceSelect.bind(amountSelect, { placeholder: "Брой" })
        NiceSelect.bind(productionTimeSelect, { placeholder: "Срок на изработка" })

        return itemSettings
    },
    async _createItemMainSection(item, signlePrice) {
        const product = products.find(product => product.name === item.design.productType)
        const title = product.displayName

        const mainSection = document.createElement("div")
        mainSection.classList.add("cart-item-main-section")

        const titleEl = document.createElement("h4")
        titleEl.innerText = title

        //const singlePriceEl = document.createElement("span")
        //singlePriceEl.innerText = 'Единична цена: ' + signlePrice

        const itemSettings = await shoppingCart._createItemSettings(item)

        mainSection.append(titleEl, /* singlePriceEl, */itemSettings)

        return mainSection
    },
    async generateItem(item) {
        const container = document.createElement("div")
        container.classList.add("cart-item-container")
        container.id = shoppingCart._getCartItemHtmlId(item.id)

        const image = document.createElement("img")
        image.classList.add("preview-image")
        image.src = API.getDesignPreviewImageUrl(item.design?.id, "front")

        async function deleteItem() {
            const resp = await API.deleteCartItem(item.id)
            if (!resp.ok) {
                return
            }

            container.remove()
        }

        container.append(image)
        container.append(await shoppingCart._createItemMainSection(item, null))
        container.append(await shoppingCart._createItemRightSection(item, deleteItem))

        return container
    },
    async fetchCart() {
        const cart = await API.getCart(shoppingCart._cartId)
        return cart
    },
    async renderCartItems(cart) {
        const itemsContainer = document.getElementById("cart-items")

        itemsContainer.innerText = ""

        const itemsElements = await Promise.all(cart.items.map(item => shoppingCart.generateItem(item)))

        itemsContainer.append(
            ...itemsElements
        )
    },
    async updateTotalPrice(cart) {
        const standardContainer = document.getElementById("price-standard-container")
        const fasterDeliveryContainer = document.getElementById("price-faster-delivery-container")
        const deliveryContainer = document.getElementById("price-delivery-container")

        const totalContainer = document.getElementById("price-total-container")
        const totalAfterTaxContainer = document.getElementById("price-total-after-tax-container")

        const itemsPrices = await Promise.all(cart.items?.map(async item => ({
            item,
            price: await shoppingCart._getItemStandardPrice(item)
        })
        ))

        const standard = itemsPrices?.reduce((sum, priceWrapper) => sum + priceWrapper.price, 0)
        standardContainer.innerText = pricesCalculation.formatPrice(standard)

        const total = itemsPrices?.reduce((sum, priceWrapper) => sum + priceWrapper.price * pricesCalculation.getProductionTimeCoefficient(priceWrapper.item.productionTime || "NORMAL"), 0)
        totalContainer.innerText = pricesCalculation.formatPrice(total)

        fasterDeliveryContainer.innerText = pricesCalculation.formatPrice(total - standard)

        totalAfterTaxContainer.innerText = pricesCalculation.formatPrice(total * 1.2)
    },
    render() {
        shoppingCart.renderCartItems(shoppingCart._cart)
        shoppingCart.updateTotalPrice(shoppingCart._cart)
    },
    async init() {
        shoppingCart._cartId = editorStorage.getUserCartId()
        shoppingCart._cart = await shoppingCart.fetchCart()

        const cartIsEmptyContainer = document.getElementById("cart-is-empty")

        if (shoppingCart._cart?.items?.length === 0) {
            cartIsEmptyContainer.style.display = 'block'
        }

        shoppingCart.render()
    }
}

window.addEventListener("load", () => {
    shoppingCart.init()
})