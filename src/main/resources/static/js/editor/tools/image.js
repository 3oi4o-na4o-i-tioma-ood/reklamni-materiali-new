const imageTool = {
    _selectedImageElementId: null,
    _imageCropTool: null,
    onAddImage(imageId) {
        // Temporary fix for image id generation
        const id = "imgel-" + Date.now() //crypto.randomUUID()
        const newElement = {
            id,
            type: "image",
            name: imageId,
            position: {
                x: 7,
                y: 7
            },
            size: {
                h: 40
            }
        }

        editor.setElements([
            ...editor.getElements(),
            newElement
        ])

        imageTool.renderImagesList(editor.getElements().filter(el => el.type === "image"))

        renderElements.renderImgElement(newElement, {
            maxInitialDimensionMM: 40
        })
    },
    async handleUploadedFiles(files) {
        if (files.length !== 1) {
            console.log("Must upload 1 file")
            return
        }

        const file = files[0]

        const imageId = await API.uploadEditorImage(file)

        imageTool.onAddImage(imageId)
    },
    setSelectedImage(id) {
        imageTool._selectedImageElementId = id

        const container = document.getElementById("image-tool-images-list")
        for(const element of container.children) {
            element.classList.remove("selected")
        }
        
        if (!id) {
            return
        }

        const imageDomId = imageTool._getImageItemId(id)
        console.trace("imageDomId: ", imageDomId)

        const imageItem = document.getElementById(imageDomId)

        if(imageItem) {
            imageItem.classList.add("selected")
        }

        // const actionsContainer = document.getElementById("image-actions")

        // if (!id) {
        //     actionsContainer.classList.remove("active")
        //     return
        // }

        // actionsContainer.classList.add("active")
    },
    _getSelectedImageName() {
        return editor.getElements().find(el => el.id === imageTool._selectedImageElementId)?.name
    },
    _onCutSave(imageId) {
        editor.removeElement(imageTool._selectedImageElementId)

        imageTool.onAddImage(imageId)
    },
    _getImageItemId(elementId) {
        return "editor-image-tool-edit-" + elementId
    },
    _onOpenImageCut(id) {
        imageTool.setSelectedImage(id)
        editor.setSelectedElement(id)

        const imageName = imageTool._getSelectedImageName()
        const imageUrl = API.getEditorImageUrl(imageName)

        console.log("Open image cut: ", imageName, imageUrl)

        imageTool._imageCropTool.open({
            imageName: imageName,
            imageSrc: imageUrl
        })
    },
    _renderImageItemCutButton(imageElementId) {
        const cutButton = document.createElement("button")
        cutButton.classList.add("icon-button")
        const cutIcon = document.createElement("img")
        cutIcon.src = "/images/editor/tools/cut_green.svg"
        cutIcon.alt = "cut"
        cutButton.append(cutIcon)
        cutButton.addEventListener("click", e => {
            e.stopPropagation()
            document.getElementById(`editor-image-tool`).style.zIndex = '1000';
            imageTool._onOpenImageCut(imageElementId)
        })

        return cutButton
    },
    _renderImageListItem(imageProps) {
        const container = document.createElement("li")
        container.id = imageTool._getImageItemId(imageProps.id)

        const image = document.createElement("img")
        image.src = API.getEditorImageUrl(imageProps.name)

        const cutButton = imageTool._renderImageItemCutButton(imageProps.id)

        container.addEventListener("click", e => {
            // Prevent canvas blur (elements unselecting)
            e.stopPropagation()

            imageTool.setSelectedImage(imageProps.id)
            editor.setSelectedElement(imageProps.id)
        })

        container.append(image, cutButton)

        return container
    },
    renderImagesList(images) {
        const container = document.getElementById("image-tool-images-list")
        const elements = images?.map(imageProps => imageTool._renderImageListItem(imageProps))

        container.innerText = null
        container.append(...elements)
    },
    init() {
        imageUpload.init("image-tool-upload-image", imageTool.handleUploadedFiles)

        imageTool._imageCropTool = newImageCropTool({
            popupId: "cut-image-popup",
            cropCanvasId: "crop-canvas",
            onSave: imageTool._onCutSave
        })
    }
}