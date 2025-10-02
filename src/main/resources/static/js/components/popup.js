const popup = {
    open(popupId) {
        const popup = document.getElementById(popupId)
        document.body.style.overflow = 'hidden'
        popup.classList.add("visible")
    },
    close(popupId) {
        const popup = document.getElementById(popupId)
        popup.classList.remove("visible");
        document.body.style.overflow = 'auto'
        if(popupId === 'cut-image-popup'){
            document.getElementById(`editor-image-tool`).style.zIndex = 'var(--z-index-content)';
        }
    },
    init(popupId) {
        const popupElement = document.getElementById(popupId)

        popupElement.querySelector(".content").addEventListener("click", e => {
            e.stopPropagation()
        })

        popupElement.addEventListener("click", () => {
            popup.close(popupId)
        })

        popupElement.querySelector(".close-button").addEventListener("click", () => {
            popup.close(popupId)
        })
    },
}