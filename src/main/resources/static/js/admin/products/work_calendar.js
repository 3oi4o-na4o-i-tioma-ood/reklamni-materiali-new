window.addEventListener("load", () => {
    const columns = [
        "SMALL",
        "MEDIUM",
        "BIG"
    ]
    adminProductPage.init("WORK_CALENDAR", columns)
    adminCategories.init("WORK_CALENDAR")
    createCategoriesList("WORK_CALENDAR")

    adminProductPage.initTableEditing("editable-prices-table", "WORK_CALENDAR")

    adminModels.init("WORK_CALENDAR")
})