const orderCompletePage = {
    _renderOrderData(order, orderCode) {
        const orderNumberContainer = document.getElementById("order-number")
        const paymentMethodContainer = document.getElementById("payment-method")
        const priceContainer = document.getElementById("total")

        
        orderNumberContainer.innerText = orderCode
        
        const paymentMethod = order.details.paymentMethod === "ON_DELIVERY"
        const paymentMethodName = paymentMethod ? "На куриер при получаване" : "Банков превод"
        paymentMethodContainer.innerText = paymentMethodName
        priceContainer.innerText = pricesCalculation.formatPrice(order.price)
    },
    async init() {
        const orderCode = new URLSearchParams(window.location.search).get("orderNumber")
        const orderId = orderCodeUtil.getOrderId(orderCode)

        if (!orderId) {
            return
        }

        const {
            result: order
        } = await API.getOrder(orderId)

        if(order) {   
            orderCompletePage._renderOrderData(order, orderCode)
        }
    }
}

window.addEventListener("load", () => {
    orderCompletePage.init()
})