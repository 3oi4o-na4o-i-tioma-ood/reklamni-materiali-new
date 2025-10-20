const designRepo = {
    _savedEditorData: null,

    productSides: [
        {
            elements: [],
            bgUrl: null,
            bgPath: null,
            bgImageId: null
        },
        null
    ],
    selectedProductSide: 0,
    printType: null,
    effects: {},
    isFavorite: null,
    name: null,
    modelColorId: null,
    setPaperTypeId(id) {
        designRepo.effects.EFFECT_CARTON = id
    },
    getPaperTypeId() {
        return designRepo.effects.EFFECT_CARTON
    },
    getDesignData() {
        const formatedSides = designRepo.productSides.map(side => {
            if (!side) {
                return null
            }

            const { bgUrl, ...rest } = side

            rest.elements = side.elements?.map(({ backendId, ...element }) => {
                const normalized = {
                    ...element,
                    fieldName: element.id,
                    id: backendId
                }

                try {
                    if (normalized.type === "text") {
                        normalized.text = renderElements.computeWrappedText(normalized)
                    }
                } catch (e) {
                    console.warn("Failed to normalize wrapped text:", e)
                }

                return normalized
            })


            return rest
        })

        return {
            id: editorStorage.getDesignId(),
            productType: editor.currentProduct,
            front: formatedSides[0],
            back: formatedSides[1],
            printType: designRepo.printType,
            effects: designRepo.effects,
            isFavorite: designRepo.isFavorite,
            name: designRepo.name,
            modelColorId: designRepo.modelColorId
        }
    },
    async updateOrCreateDesign() {
        const savedDesignId = editorStorage.getDesignId()

        const design = designRepo.getDesignData()

        async function updateIds(designId) {
            const {
                result: design
            } = await API.getDesign(designId)
            function updateSide(original, saved) {
                if (!original || !saved) {
                    return null
                }

                return {
                    ...original,
                    ...saved,
                    elements: original?.elements?.map(el => ({
                        ...el,
                        backendId: saved?.elements?.find(createdElement => createdElement.fieldName === el.id)?.backendId || el?.backendId
                    }))
                }
            }

            designRepo.productSides = [
                updateSide(designRepo.productSides[0], design.front),
                updateSide(designRepo.productSides[1], design.back)
            ]
        }

        if (savedDesignId && savedDesignId !== "null" && savedDesignId !== "undefined") {
            await API.updateDesign({
                id: savedDesignId,
                ...design
            })
            await updateIds(savedDesignId)
            return savedDesignId
        }

        const { result: designId, response } = await API.createDesign({
            ...design,
            id: null
        })

        if (!response.ok) {
            return null
        }

        await updateIds(designId)
        editorStorage.setDesignId(designId)

        return designId
    },
    async initAutoSave() {
        // const currentData = editor.getEditorData()
        // if (JSON.stringify(designRepo._savedEditorData) !== JSON.stringify(currentData)) {
        //     await designRepo.updateOrCreateDesign()
        //     designRepo._savedEditorData = currentData
        // }
        if (!editorStorage.getDesignId()) {
            await designRepo.updateOrCreateDesign()
        }

        setInterval(async () => {
            const currentData = designRepo.getDesignData()
            //console.log(JSON.parse(JSON.stringify(designRepo._savedEditorData)), "\n\n", JSON.parse(JSON.stringify(currentData)))
            if (JSON.stringify(designRepo._savedEditorData) !== JSON.stringify(currentData)) {
                await designRepo.updateOrCreateDesign()
                designRepo._savedEditorData = JSON.parse(JSON.stringify(currentData))
            }
        }, 3000)
    },
    async loadSavedDesign() {
        const designId = editorStorage.getDesignId()

        if (!designId || designId === "null" || designId === "undefined") {
            return
        }

        const { result: design, response } = await API.getDesign(designId)
        if (!response.ok) {
            return
        }

        if (design.front) {
            design.front.bgUrl = editor.getImageUrl({
                ...design.front,
                modelColorId: design.modelColorId
            })
        }

        if (design.back) {
            design.back.bgUrl = editor.getImageUrl({
                ...design.back,
                modelColorId: design.modelColorId
            })
        }

        designRepo._savedEditorData = design
        designRepo.productSides = [
            design.front,
            design.back
        ]

        designRepo.effects = design.effects
        designRepo.isFavorite = design.isFavorite
        designRepo.name = design.name
        designRepo.modelColorId = design.modelColorId

        editor.selectSide(0)
    },
}