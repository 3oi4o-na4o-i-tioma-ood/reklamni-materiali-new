const orderCodeUtil = {
    // 452930477 is hard-coded on front- and back-end. See Java/src/main/java/com/rm/controllers/ShoppingCartController.java
    getOrderCode(orderId) {
        return (Number(orderId) * 452930477).toString(36).toUpperCase()
    },
    getOrderId(orderCode) {
        return parseInt(orderCode, 36) / 452930477
    }
}