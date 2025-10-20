const orderCodeUtil = {
    getOrderCode(orderId) {
        return Number(orderId).toString(10).toUpperCase()
    },
    getOrderId(orderCode) {
        return parseInt(orderCode, 10)
    }
}