const backgroundCut = {
    _imageCropTool: null,
    openPopup(backgroundUrl) {
        console.log("openPopup")

        backgroundCut._imageCropTool.open({
            imageSrc: backgroundUrl,
            imageName: "bg"
        })
    },
    _onCutSave(imageId) {
        const fileUrl = API.getEditorImageUrl(imageId)

        editor.setBg({
            bgImageId: imageId
        })

        bgTool.setCurrentBackground(fileUrl)
        bgTool.openTab(0)
    },
    init() {
        const productDescription = editor.getCurrentProductDescription()
        const aspectRatio = productDescription.sizeMM.width / productDescription.sizeMM.height

        const maxWidth = (productDescription.sizeMM.height / 10 + 20) * aspectRatio
        const width = Math.min((productDescription.sizeMM.width / 10 + 20), maxWidth)
        const height = width / aspectRatio

        backgroundCut._imageCropTool = newImageCropTool({
            popupId: "cut-background-popup",
            cropCanvasId: "crop-background-canvas",
            onSave: backgroundCut._onCutSave,
            cropSize: {
                w: width,
                h: height
            }
        })
    }
}





function newImageCropTool({
    popupId,
    cropCanvasId,
    onSave,

    // {w: , h: }
    cropSize = null
}) {
    function createCropBoundary(croppedImageElement) {
        const imageRect = croppedImageElement.getBoundingClientRect()
        const initialBoundaryOffset = 3

        const cropBoundary = {
            id: "crop-boundary",
            position: {
                x: initialBoundaryOffset,
                y: initialBoundaryOffset
            },
            size: {
                w: imageRect.width / editor.canvasPxPerProductMM - initialBoundaryOffset * 2,
                h: imageRect.height / editor.canvasPxPerProductMM - initialBoundaryOffset * 2
            }
        }

        if (cropSize) {
            cropBoundary.size = cropSize
        }

        return cropBoundary
    }

    function onCroppedImageLoad(canvas, croppedImage) {
        const cropBoundary = createCropBoundary(croppedImage)

        imageCutTool._cropSelection = {
            x: cropBoundary.position.x * editor.canvasPxPerProductMM,
            y: cropBoundary.position.y * editor.canvasPxPerProductMM,
            width: cropBoundary.size.w * editor.canvasPxPerProductMM,
            height: cropBoundary.size.h * editor.canvasPxPerProductMM,
        }

        console.log("Create crop selection: ", imageCutTool._cropSelection)

        imageCutTool._renderElements.clear()

        const { element } = imageCutTool._renderElements.createBasicEditorElement(cropBoundary, { enableVerticalResize: true, fixedAspectRatio: !!cropSize })
        element.classList.add("selected")
        canvas.append(element)
    }

    function renderCroppedImage(imageSrc) {
        const croppedImage = document.querySelector(`#${popupId} #cropped-image`)
        croppedImage.src = imageSrc
        const canvas = document.querySelector(`#${popupId} .canvas`)
        canvas.querySelectorAll(".element").forEach(element => element.remove())

        croppedImage.addEventListener("load", () => {
            onCroppedImageLoad(canvas, croppedImage)
        })
    }

    const imageCutTool = {
        _renderElements: null,
        _cropSelection: {},
        _imageName: null,

        initCut() {
            const saveButton = document.querySelector(`#${popupId} #accept-crop-button`)

            saveButton.addEventListener("click", async () => {

                const croppedImage = document.querySelector(`#${popupId} #cropped-image`)

                const imageResponse = await fetch(croppedImage.src)
                const imageBlob = await imageResponse.blob()
                const imageFile = new File([imageBlob], imageCutTool._imageName)

                const imageRect = croppedImage.getBoundingClientRect()

                const scale = imageRect.width / croppedImage.naturalWidth

                const scaledCropSelection = {
                    x: imageCutTool._cropSelection.x / scale,
                    y: imageCutTool._cropSelection.y / scale,
                    width: imageCutTool._cropSelection.width / scale,
                    height: imageCutTool._cropSelection.height / scale,
                }

                const imageId = await API.uploadEditorImage(imageFile, scaledCropSelection)

                onSave(imageId)

                popup.close(popupId)
                document.getElementById(`editor-image-tool`).style.zIndex = 'var(--z-index-content)';
            })
        },
        onResize(id, dimensions) {
            if (id !== "crop-boundary") {
                return
            }

            
            imageCutTool._cropSelection = {
                ...imageCutTool._cropSelection,
                ...dimensions
            }

            console.log(dimensions, imageCutTool._cropSelection)
        },
        open({
            imageName,
            imageSrc
        }) {
            imageCutTool._imageName = imageName

            popup.open(popupId)
            renderCroppedImage(imageSrc)
        }
    }

    function init() {
        imageCutTool._renderElements = newRenderElements(cropCanvasId)
        imageCutTool._renderElements.resizeListeners.push(imageCutTool.onResize)
        imageCutTool._renderElements.moveListeners.push(imageCutTool.onResize)

        imageCutTool.initCut()
        popup.init(popupId)
    }

    init()

    return imageCutTool
}
