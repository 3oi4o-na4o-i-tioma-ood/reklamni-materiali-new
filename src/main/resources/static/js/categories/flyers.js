const flyersCategories = {
    getPageSize(orientation) {
        return orientation === "horizontal" ? 9 : 10
    },
    initSizeSelect() {
        const sizeSelect = document.getElementById("flyers-size-select")
        flyersCategories.sizeSelectInstance = NiceSelect.bind(sizeSelect, {placeholder: "Размер"})
        sizeSelect.addEventListener("change", e => {
            categoriesPage.init("FLIER_" + e.target.value, flyersCategories.getPageSize, false)
        })
    },
    init() {
        flyersCategories.initSizeSelect()
        categoriesPage.init("FLIER_10x15", flyersCategories.getPageSize, false)
    },
}

window.addEventListener("load", async () => {
    flyersCategories.init()
});
