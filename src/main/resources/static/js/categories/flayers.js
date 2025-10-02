const flyersCategories = {
    initSizeSelect() {
        const sizeSelect = document.getElementById("flyers-size-select")
        flyersCategories.fontSizeSelectInstance = NiceSelect.bind(sizeSelect, {placeholder: "Размер"})
        sizeSelect.addEventListener("change", e => {
            categoriesPage.init("FLIER_" + e.target.value, 10, false)
        })
    },
    init() {
        flyersCategories.initSizeSelect()
        categoriesPage.init("FLIER_10x15", 10, false)
    },
}

window.addEventListener("load", async () => {
    flyersCategories.init()
});
