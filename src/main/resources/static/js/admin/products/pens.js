window.addEventListener("load", () => {
    adminCategories.init("PEN")

    // Set product type once
    adminProductPage.init("PEN")

    // Screen print table (1-3 colors)
    adminProductPage.initTableEditing("editable-prices-table-pen-screen", "PEN", [
        "SCREEN_ONE_COLOR",
        "SCREEN_TWO_COLORS",
        "SCREEN_THREE_COLORS"
    ])

    // Pad print table (1-3 colors)
    adminProductPage.initTableEditing("editable-prices-table-pen-pad", "PEN", [
        "PAD_ONE_COLOR",
        "PAD_TWO_COLORS",
        "PAD_THREE_COLORS"
    ])

    // Full color table (single column)
    adminProductPage.initTableEditing("editable-prices-table-pen-full-color", "PEN", [
        "FULL_COLOR"
    ])

    // Cliché prices (amount 0)
    adminProductPage.initTableEditing("editable-prices-table-pen-cliches", "PEN", [
        "CLICHE_ONE_COLOR",
        "CLICHE_TWO_COLORS",
        "CLICHE_THREE_COLORS"
    ])
})