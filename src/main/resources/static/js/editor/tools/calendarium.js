const calendariumTool = {
    async generateImages() {
        const container = document.querySelector("#editor-calendarium-tool #bg-options")

        const productDescription = editor.getCurrentProductDescription()
        const aspectRatio = editor.getRotatedWidth(productDescription) / editor.getRotatedHeight(productDescription);

        const imagesPaths = await API.getPocketCalendarBacks()

        console.log("imagesPaths: ", imagesPaths)

        const imagePathPrefix = "/images/dzobni_kalendari/backs/"
        // const imagesUrls = [
        //     "kalendarcheta_back_01.png",
        //     "kalendarcheta_back_02.png",
        //     "kalendarcheta_back_03.png",
        //     "kalendarcheta_back_04.png",
        //     "kalendarcheta_back_05.png",
        //     "kalendarcheta_back_06.png",
        //     "kalendarcheta_back_07.png",
        //     "kalendarcheta_back_08.png"
        // ].map(imageUrl => imagePathPrefix + imageUrl)

        const images = imagesPaths.map((imagePath) => {
            const button = document.createElement("button")
            const img = document.createElement("img")
            img.style.aspectRatio = aspectRatio
            img.src = API.getPocketCalendarBackUrl(imagePath)
            button.append(img)

            button.style.display = "block"

            button.addEventListener("click", () => {
                editor.setBg({
                    bgPath: imagePath
                })
            })

            return button
        })

        container.append(...images)
    },
    async init() {
        calendariumTool.generateImages()
    }
}