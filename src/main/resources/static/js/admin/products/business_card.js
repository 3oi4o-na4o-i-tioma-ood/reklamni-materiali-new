window.addEventListener("load", () => {
    const columns = [
        "COLORED_BLACK",
        "COLORED_COLORED",
        "COLORED_NO_BACK",
        "BLACK_BLACK",
        "BLACK_NO_BACK"
    ]
    adminProductPage.init("BUSINESS_CARD", columns)
    adminCategories.init("BUSINESS_CARD")
})