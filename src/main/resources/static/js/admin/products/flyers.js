window.addEventListener("load", () => {
    const columns = [
        "COLORED_NO_BACK",
        "COLORED_COLORED",
        "COLORED_BLACK"
    ]
    adminProductPage.init("FLYER_BOTH_SIZES", columns)
    adminCategories.init("FLIER_10x15")
    createCategoriesList("FLIER_10x15","categories-10x15")
    createCategoriesList("FLIER_10x20","categories-10x20")

    adminProductPage.initTableEditing("editable-prices-table-flyer-10x15", "FLIER_10x15")
    adminProductPage.initTableEditing("editable-prices-table-flyer-10x20", "FLIER_10x20")
})