const imageUpload = {
    onDrop(e, onUpload) {
        e.preventDefault()

        const files = e.dataTransfer.files

        onUpload(files)
    },
    onDragOver(e) {
        e.preventDefault()
    },
    onFileInputChange(e, onUpload) {
        console.log(e)
        const files = e.target.files
        onUpload(files)
    },
    init(id, onUpload) {
        const container = document.getElementById(id)
        const button = container.querySelector("button")
        const fileInput = container.querySelector("input")

        button.addEventListener("click", () => {
            fileInput.click()
        })

        container.addEventListener("dragover", imageUpload.onDragOver)
        container.addEventListener("drop", e => imageUpload.onDrop(e, onUpload))
        container.addEventListener("dragenter", () => container.classList.add("dragover"))
        container.addEventListener("dragleave", () => container.classList.remove("dragover"))

        fileInput.addEventListener("change", e => imageUpload.onFileInputChange(e, onUpload))
    },
}