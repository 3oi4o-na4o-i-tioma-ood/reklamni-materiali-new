window.addEventListener("load", () => {
    const columns = [
        "COLORED_NO_BACK",
        "COLORED_COLORED",
        "COLORED_BLACK"
    ]
    adminProductPage.init("FLYER_BOTH_SIZES", columns)
    //adminCategories.init("FLYER_BOTH_SIZES")

    adminProductPage.initTableEditing("editable-prices-table-flyer-10x15", "FLIER_10x15")
    adminProductPage.initTableEditing("editable-prices-table-flyer-10x20", "FLIER_10x20")
})