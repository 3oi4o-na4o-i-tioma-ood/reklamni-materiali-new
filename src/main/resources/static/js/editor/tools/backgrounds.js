const bgTool = {
    _initialized: false,
    tabs: [
        "choose-bg-container",
        "upload-bg-container"
    ],
    tabOpen: 0,
    setCurrentBackground(url) {
        if(!bgTool._initialized) {
            return
        }

        const currentBgElement = document.getElementById("bg-tool-current-bg")

        currentBgElement.src = url || ""
        currentBgElement.style.visibility = url ? "visible" : "hidden"
    },
    openTab(index) {
        if(!bgTool._initialized) {
            return
        }
        
        bgTool.tabs.forEach((tabId, i) => {
            const tab = document.getElementById(tabId)

            if (i === index) {
                tab.classList.add("active")
            }
            else {
                tab.classList.remove("active")
            }
        })

        const tabsContainer = document.getElementById("background-tool-tabs")

        const tabs = [...tabsContainer.children]

        tabs.forEach((tab, i) => {
            if (index === i) {
                tab.classList.remove("secondary")
            }
            else {
                tab.classList.add("secondary")
            }
        })
    },
    async handleUploadedFiles(files) {
        if (files.length !== 1) {
            console.log("Must upload 1 file")
            return
        }

        const file = files[0]

        console.log(file)

        const url = URL.createObjectURL(file)

        backgroundCut.openPopup(url)
    },
    initTabs() {
        if(!bgTool._initialized) {
            return
        }

        const tabsContainer = document.getElementById("background-tool-tabs")

        const tabs = [...tabsContainer.children]

        tabs.forEach((tab, index) => {
            tab.addEventListener("click", () => {
                this.tabOpen = index

                bgTool.openTab(index)
            })
        })
    },
    imagesTotal: 0,
    getCategoryFromUrl() {
        if(!bgTool._initialized) {
            return
        }

        const urlParams = new URLSearchParams(window.location.search)
        const bg = urlParams.get("bg")
        if (!bg) {
            return {
                category: null,
                image: null
            }
        }

        const indexOfSlash = bg.endsWith("/") ? bg.slice(0, -1).lastIndexOf("/") : bg.lastIndexOf("/")

        const category = bg.slice(0, indexOfSlash)

        return {
            category,
            image: bg
        }
    },

    generateImages(count) {
        if(!bgTool._initialized) {
            return
        }

        const container = document.getElementById("bg-options")

        const productDescription = editor.getCurrentProductDescription()
        aspectRatio = productDescription.sizeMM.width / productDescription.sizeMM.height

        const images = new Array(count).fill(null).map(() => {
            const button = document.createElement("button")
            const img = document.createElement("img")
            img.style.aspectRatio = aspectRatio
            button.append(img)
            return button
        })

        container.append(...images)
    },
    async updateImages(category, page) {
        if(!bgTool._initialized) {
            return
        }

        const pictures = await API.getPictures(editor.currentProduct, page, 4, category)
        bgTool.imagesTotal = pictures.total

        const container = document.getElementById("bg-options")

        const buttonElements = [...container.children]

        buttonElements.forEach((button, i) => {
            if (pictures.images.length <= i) {
                button.style.display = "none"
                return
            }

            button.style.display = "block"

            button.addEventListener("click", () => {
                editor.setBg({
                    bgPath: pictures.images[i]
                })
            })

            const image = button.querySelector("img")

            image.src = API.getImageUrl(editor.currentProduct, pictures.images[i])
        })
    },
    async init({ allowUpload }) {
        bgTool._initialized = true
        const productDescription = editor.getCurrentProductDescription()

        const currentBgElement = document.getElementById("bg-tool-current-bg")

        currentBgElement.style.aspectRatio = productDescription.sizeMM.width / productDescription.sizeMM.height

        if (allowUpload) {
            imageUpload.init("bg-tool-upload-bg", bgTool.handleUploadedFiles)
            bgTool.initTabs()
            bgTool.openTab(0)

            backgroundCut.init()
        }


        const { category } = bgTool.getCategoryFromUrl()
        bgTool.generateImages(4)
        await bgTool.updateImages(category, 0)

        console.log("Got total images. Rendering pagination: ", bgTool.imagesTotal)

        pagination.generateButtons(Math.ceil(bgTool.imagesTotal / 4), "backgrounds-pagination", (page) => {
            bgTool.updateImages(category, page)
        })

    }
}