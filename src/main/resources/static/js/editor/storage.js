const editorStorage = {
    setDesignId(id) {
        const searchParams = new URLSearchParams(window.location.search)
        searchParams.set("designId", id)
        window.history.pushState(null, "", window.location.pathname + "?" + searchParams)
        // window.sessionStorage.setItem("designId", id)
    },
    getDesignId() {
        const searchParams = new URLSearchParams(window.location.search)
        return searchParams.get("designId")
        // return window.sessionStorage.getItem("designId")
    },
    removeDesignId() {
        const searchParams = new URLSearchParams(window.location.search)
        searchParams.delete("designId")
        window.location.search = searchParams
        // window.sessionStorage.removeItem("designId")
    },


    setCartId(id) {
        window.localStorage.setItem("cartId", id)
    },
    getCartId() {
        return window.localStorage.getItem("cartId")
    },
    removeCartId() {
        window.localStorage.removeItem("cartId")
    },
    getUserCartId() {
        const jwt = auth.getToken()
        if(!jwt) {
            return editorStorage.getCartId()
        }

        editorStorage.removeCartId()

        const jwtParsed = auth.parseToken(jwt)
        return jwtParsed.cart_id
    },
}