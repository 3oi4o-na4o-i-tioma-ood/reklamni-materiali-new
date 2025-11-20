window.addEventListener("load", () => {
    const columns = [
        "COLORED_BLACK",
        "COLORED_COLORED"
    ]
    adminProductPage.init("POCKET_CALENDAR", columns)
    adminCategories.init("POCKET_CALENDAR")
    createCategoriesList("POCKET_CALENDAR")

    adminProductPage.initTableEditing("editable-prices-table", "POCKET_CALENDAR")
})