const checkoutPage = {
    // _createItemSecondColumn(item) {
    //     const secondColumn = document.createElement("div")
    //     secondColumn.classList.add("column")

    //     const nameContainer = document.createElement("span")
    //     const amountContainer = document.createElement("span")

    //     nameContainer.classList.add("name-container")
    //     amountContainer.classList.add("amount-container")

    //     nameContainer.innerText = item.name
    //     nameContainer.innerText = item.amount

    //     secondColumn.append(nameContainer, amountContainer)

    //     return secondColumn
    // },
    // createCartItem(item) {
    //     const container = document.createElement("div")
    //     container.classList.add("cart-item")

    //     const image = document.createElement("img")

    //     const priceContainer = document.createElement("span")
    //     priceContainer.classList.add("price-container")
    //     priceContainer.innerText = item.price

    //     container.append(image, checkoutPage._createItemSecondColumn(item), priceContainer)

    //     return container
    // },
    _setError(id, error) {
        const input = document.getElementById(id)
        const container = input.parentElement

        container.classList.add("error")

        let errorContainer = container.querySelector(".error-container")

        if (!errorContainer) {
            errorContainer = document.createElement("span")
            errorContainer.classList.add("error-container")
            container.append(errorContainer)
        }

        errorContainer.innerText = error
    },
    _setIsLoading(isLoading) {
        const backdrop = document.getElementById("loading-backdrop")
        if (isLoading) {
            backdrop.style.display = "flex"
            setTimeout(() => {
                backdrop.classList.add("visible")
            })
        }
        else {
            backdrop.classList.remove("visible")
            setTimeout(() => {
                backdrop.style.display = "none"
            })
        }
    },
    _validateUserDetails(userData) {
        let isValid = true

        if (!userData.email) {
            checkoutPage._setError("form-email", "Задължително поле")
            isValid = false
        }

        if (!userData.name) {
            checkoutPage._setError("form-name", "Задължително поле")
            isValid = false
        }

        if (!userData.surname) {
            checkoutPage._setError("form-surname", "Задължително поле")
            isValid = false
        }

        if (!userData.phone) {
            checkoutPage._setError("form-phone", "Задължително поле")
            isValid = false
        }


        if (userData.deliveryType === "office") {
            if (!userData.econtAddress) {
                checkoutPage._setError("form-econt-address", "Задължително поле")
                isValid = false
            }
        }
        else {
            if (!userData.addressCity) {
                checkoutPage._setError("form-address-city", "Задължително поле")
                isValid = false
            }

            if (!userData.addressStreet) {
                checkoutPage._setError("form-address-street", "Задължително поле")
                isValid = false
            }

            if (!userData.addressNumber) {
                checkoutPage._setError("form-address-number", "Задължително поле")
                isValid = false
            }
        }

        return isValid
    },
    _validateInvoiceDetails(invoiceData) {
        if (!invoiceData) {
            return true
        }


    },
    _clearErrors() {
        const page = document.getElementById("checkout-page-content")
        const errorContainers = page.querySelectorAll(".error-container")
        errorContainers.forEach(errorContainer => {
            errorContainer.parentElement.classList.remove("error")
            errorContainer.remove()
        })
    },
    _validateForms(data) {
        checkoutPage._clearErrors()
        return checkoutPage._validateUserDetails(data.userDetails) &&
            checkoutPage._validateInvoiceDetails(data.invoiceDetails)
    },

    async _makeOrder() {
        const deliveryForm = document.getElementById("delivery-form")
        const invoiceForm = document.getElementById("invoice-form")
        const paymentForm = document.getElementById("payment-form")

        const deliveryFormData = new FormData(deliveryForm)
        const invoiceFormData = new FormData(invoiceForm)
        const paymentFormData = new FormData(paymentForm)

        // const data = [deliveryFormData, invoiceFormData, paymentFormData].flatMap(data => Object.fromEntries(data))

        const invoiceData = Object.fromEntries(invoiceFormData)

        const details = {
            userDetails: Object.fromEntries(deliveryFormData),
            invoiceDetails: !Number(invoiceData.issueInvoice) ? null : {
                companyName: invoiceData.invoiceCompanyName,
                companyAddress: invoiceData.invoiceCompanyAddress,
                UIC: invoiceData.invoiceUIC,
                taxId: invoiceData.invoiceTaxId,
                receiver: invoiceData.invoiceReceiver
            },
            paymentMethod: Object.fromEntries(paymentFormData).paymentMethod
        }

        console.log(details)

        if (!checkoutPage._validateForms(details)) {
            checkoutPage._setIsLoading(false)
            return false
        }

        if (details.userDetails.deliveryType !== "office") {
            details.userDetails.address = [
                details.userDetails.addressCity,
                details.userDetails.addressStreet,
                details.userDetails.addressNumber,
                details.userDetails.addressEntrance,
                details.userDetails.addressApartment
            ].join(" ")
        }

        const shoppingCartId = editorStorage.getUserCartId()

        const { result, response } = await API.makeOrder(shoppingCartId, details)

        if (!response.ok) {
            checkoutPage._setIsLoading(false)
            return false
        }

        checkoutPage._setIsLoading(false)
        return orderCodeUtil.getOrderCode(result)
    },
    _initOrderButton() {
        const button = document.getElementById("order-button")

        button.addEventListener("click", async () => {
            checkoutPage._setIsLoading(true)
            const orderNumber = await checkoutPage._makeOrder()
            console.log(orderNumber)
            if (!orderNumber) {
                return
            }

            editorStorage.removeCartId()

            const JWT = auth.getToken()
            if (JWT) {
                await API.refreshJWT()
            }

            checkoutPage._setIsLoading(false)

            window.location.href = "/приключена-поръчка?orderNumber=" + orderNumber
        })
    },
    async _autoFillInputs() {
        const user = auth.parseToken(auth.getToken())

        if (!user) {
            return
        }

        const name = document.getElementById("form-name")
        const surname = document.getElementById("form-surname")
        const email = document.getElementById("form-email")
        const phone = document.getElementById("form-phone")
        // const address = document.getElementById("form-address")

        console.log(user)

        name.value = user.name
        surname.value = user.surname
        email.value = user.email
        phone.value = user.phone
        // address.value = user.delivery_address
    },
    _initUserDetailsForm() {
        const deliveryForm = document.getElementById("delivery-form")

        const officeDeliveryContainer = document.getElementById("delivery-office-data-container")
        const deliveryAddressContainer = document.getElementById("delivery-address-container")


        deliveryForm.addEventListener("change", () => {
            const deliveryFormData = new FormData(deliveryForm)

            console.log(deliveryFormData)


            const deliveryType = deliveryFormData.get("deliveryType")

            if (deliveryType === "address") {
                officeDeliveryContainer.style.display = "none"
                deliveryAddressContainer.style.display = null
            }
            else {
                officeDeliveryContainer.style.display = null
                deliveryAddressContainer.style.display = "none"
            }
        })
    },
    _initInvoiceDetailsForm() {
        const invoiceForm = document.getElementById("invoice-form")

        const invoiceDataContainer = document.getElementById("invoice-data-container")

        invoiceForm.addEventListener("change", () => {
            const invoiceData = new FormData(invoiceForm)

            console.log([...invoiceData])


            if (Number(invoiceData.get("issueInvoice"))) {
                invoiceDataContainer.style.display = null
            }
            else {
                invoiceDataContainer.style.display = "none"
            }
        })
    },
    async init() {
        // const shoppingCartId = editorStorage.getUserCartId()
        // const shoppingCart = await API.getCart(shoppingCartId)

        // const cartContainer = document.getElementById("cart-overview")

        // cartContainer.append(...shoppingCart.items.map(item => checkoutPage.createCartItem(item)))

        checkoutPage._initOrderButton()

        checkoutPage._autoFillInputs()

        checkoutPage._initUserDetailsForm()
        checkoutPage._initInvoiceDetailsForm()
    }
}

window.addEventListener("load", () => {
    checkoutPage.init()
})