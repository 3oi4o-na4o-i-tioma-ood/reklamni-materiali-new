const ordersPage = {
    _renderOrder(order) {
        const container = document.createElement("tr")

        const codeContainer = document.createElement("td")
        codeContainer.innerText = "#" + orderCodeUtil.getOrderCode(order.id)

        const orderDateContainer = document.createElement("td")
        orderDateContainer.innerText = order.cart.updated

        container.append(codeContainer, orderDateContainer)

        return container
    },
    _renderOrders(orders) {
        const container = document.getElementById("orders-container")

        const ordersElements = orders?.map(order => ordersPage._renderOrder(order))

        console.log(ordersElements)

        container.append(...ordersElements)
    },
    async init() {
        const {
            response,
            result: orders
        } = await API.getUserOrders()

        console.log(orders)

        if (!response.ok || !orders?.length) {
            const noPackages = document.getElementById("no-packages-container")
            noPackages.style.display = null
            return
        }
        
        const ordersTable = document.getElementById("orders-table")
        ordersTable.style.display = null

        ordersPage._renderOrders(orders)
    }
}

window.addEventListener("load", () => {
    ordersPage.init()
})