window.addEventListener("load", () => {
    adminCategories.init("LIGHTER")

    // Set product type once
    adminProductPage.init("LIGHTER")

    // Screen print table (1-3 colors)
    adminProductPage.initTableEditing("editable-prices-table-lighter-screen", "LIGHTER", [
        "SCREEN_ONE_COLOR",
        "SCREEN_TWO_COLORS",
        "SCREEN_THREE_COLORS"
    ])

    // Pad print table (1-3 colors)
    adminProductPage.initTableEditing("editable-prices-table-lighter-pad", "LIGHTER", [
        "PAD_ONE_COLOR",
        "PAD_TWO_COLORS",
        "PAD_THREE_COLORS"
    ])

    // Full color table (single column)
    adminProductPage.initTableEditing("editable-prices-table-lighter-full-color", "LIGHTER", [
        "FULL_COLOR"
    ])

    // Cliché prices (amount 0)
    adminProductPage.initTableEditing("editable-prices-table-lighter-cliches", "LIGHTER", [
        "CLICHE_ONE_COLOR",
        "CLICHE_TWO_COLORS",
        "CLICHE_THREE_COLORS"
    ])

    adminModels.init("LIGHTER")

    colorButtonsModule.init()
    adminModels.initModelColorDeleteButtons()
    adminModels.initModelDeleteButtons()
})