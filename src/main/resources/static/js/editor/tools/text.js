const textTool = {
    predefinedColors: [
        'ffffff', 'c2c2c2', '959595', '626262', '000000', 'ddebb7', 'd0e07a', 'b7d433', '51682f', '7cc576', '39b44a', '1c7a3d', '6dcff6', '00bff3', '00adef', '0076a3', '003471', '2e348f', 'fff799', 'fff468', 'fff200', 'ffe88c', 'ffd600', 'e3b122', 'fdc689', 'fbaf5d', 'f7941d', 'f69679', 'f26c4f', 'ed1c24', 'f49ac1', 'f06ea9', 'ec008c', 'bc8cbf', 'a863a8', '92278f', 'a186be', '8560a8', '662d91', 'c69c6d', 'a57c52', '8c6239'
    ],
    // [
    //     "aealarabiya.ctg.z",
    //     "aealarabiya.z",
    //     "aefurat.ctg.z",
    //     "aefurat.z",
    //     "arial.ctg.z",
    //     "arial.z",
    //     "arialb.ctg.z",
    //     "arialb.z",
    //     "arialbi.ctg.z",
    //     "arialbi.z",
    //     "ariali.ctg.z",
    //     "ariali.z",
    //     "azbuka02.ctg.z",
    //     "azbuka02.z",
    //     "azbuka03_d.ctg.z",
    //     "azbuka03_d.z",
    //     "comic.ctg.z",
    //     "comic.z",
    //     "comicb.ctg.z",
    //     "comicb.z",
    //     "cour.ctg.z",
    //     "cour.z",
    //     "courb.ctg.z",
    //     "courb.z",
    //     "courbi.ctg.z",
    //     "courbi.z",
    //     "couri.ctg.z",
    //     "couri.z",
    //     "dejavusans.ctg.z",
    //     "dejavusans.z",
    //     "dejavusansb.ctg.z",
    //     "dejavusansb.z",
    //     "dejavusansbi.ctg.z",
    //     "dejavusansbi.z",
    //     "dejavusanscondensed.ctg.z",
    //     "dejavusanscondensed.z",
    //     "dejavusanscondensedb.ctg.z",
    //     "dejavusanscondensedb.z",
    //     "dejavusanscondensedbi.ctg.z",
    //     "dejavusanscondensedbi.z",
    //     "dejavusanscondensedi.ctg.z",
    //     "dejavusanscondensedi.z",
    //     "dejavusansextralight.ctg.z",
    //     "dejavusansextralight.z",
    //     "dejavusansi.ctg.z",
    //     "dejavusansi.z",
    //     "dejavusansmono.ctg.z",
    //     "dejavusansmono.z",
    //     "dejavusansmonob.ctg.z",
    //     "dejavusansmonob.z",
    //     "dejavusansmonobi.ctg.z",
    //     "dejavusansmonobi.z",
    //     "dejavusansmonoi.ctg.z",
    //     "dejavusansmonoi.z",
    //     "dejavuserif.ctg.z",
    //     "dejavuserif.z",
    //     "dejavuserifb.ctg.z",
    //     "dejavuserifb.z",
    //     "dejavuserifbi.ctg.z",
    //     "dejavuserifbi.z",
    //     "dejavuserifcondensed.ctg.z",
    //     "dejavuserifcondensed.z",
    //     "dejavuserifcondensedb.ctg.z",
    //     "dejavuserifcondensedb.z",
    //     "dejavuserifcondensedbi.ctg.z",
    //     "dejavuserifcondensedbi.z",
    //     "dejavuserifcondensedi.ctg.z",
    //     "dejavuserifcondensedi.z",
    //     "dejavuserifi.ctg.z",
    //     "dejavuserifi.z",
    //     "freemono.ctg.z",
    //     "freemono.z",
    //     "freemonob.ctg.z",
    //     "freemonob.z",
    //     "freemonobi.ctg.z",
    //     "freemonobi.z",
    //     "freemonoi.ctg.z",
    //     "freemonoi.z",
    //     "freesans.ctg.z",
    //     "freesans.z",
    //     "freesansb.ctg.z",
    //     "freesansb.z",
    //     "freesansbi.ctg.z",
    //     "freesansbi.z",
    //     "freesansi.ctg.z",
    //     "freesansi.z",
    //     "freeserif.ctg.z",
    //     "freeserif.z",
    //     "freeserifb.ctg.z",
    //     "freeserifb.z",
    //     "freeserifbi.ctg.z",
    //     "freeserifbi.z",
    //     "freeserifi.ctg.z",
    //     "freeserifi.z",
    //     "nk112.ctg.z",
    //     "nk112.z",
    //     "nk113.ctg.z",
    //     "nk113.z",
    //     "nk114.ctg.z",
    //     "nk114.z",
    //     "nk115.ctg.z",
    //     "nk115.z",
    //     "nk162.ctg.z",
    //     "nk162.z",
    //     "nk226.ctg.z",
    //     "nk226.z",
    //     "nk251.ctg.z",
    //     "nk251.z",
    //     "nk254.ctg.z",
    //     "nk254.z",
    //     "nk257.ctg.z",
    //     "nk257.z",
    //     "nk510.ctg.z",
    //     "nk510.z",
    //     "nk68.ctg.z",
    //     "nk68.z",
    //     "nk85.ctg.z",
    //     "nk85.z",
    //     "nk91.ctg.z",
    //     "nk91.z",
    //     "nk_mono.ctg.z",
    //     "nk_mono.z",
    //     "nkcirpp.ctg.z",
    //     "nkcirpp.z",
    //     "pdfacourier.z",
    //     "pdfacourierb.z",
    //     "pdfacourierbi.z",
    //     "pdfacourieri.z",
    //     "pdfahelvetica.z",
    //     "pdfahelveticab.z",
    //     "pdfahelveticabi.z",
    //     "pdfahelveticai.z",
    //     "pdfasymbol.z",
    //     "pdfatimes.z",
    //     "pdfatimesb.z",
    //     "pdfatimesbi.z",
    //     "pdfatimesi.z",
    //     "pdfazapfdingbats.z",
    //     "senka.ctg.z",
    //     "senka.z",
    //     "times.ctg.z",
    //     "times.z",
    //     "timesb.ctg.z",
    //     "timesb.z",
    //     "timesbi.ctg.z",
    //     "timesbi.z",
    //     "timesi.ctg.z",
    //     "timesi.z",
    //     "verdana.ctg.z",
    //     "verdana.z",
    //     "verdanab.ctg.z",
    //     "verdanab.z",
    //     "verdanabi.ctg.z",
    //     "verdanabi.z",
    //     "verdanai.ctg.z",
    //     "verdanai.z"
    // ]
    fontsOptions: [
        "Arial",
        "Azbuka",
        "Azbuka Decorative",
        "Comic Sans MS",
        "Courier New",
        "Kovanovic 68",
        "Kovanovic 85",
        "Kovanovic 91",
        "Kovanovic 112",
        "Kovanovic 113",
        "Kovanovic 114",
        "Kovanovic 115",
        "Kovanovic 162",
        "Kovanovic 226",
        "Kovanovic 251",
        "Kovanovic 254",
        "Kovanovic 257",
        "Kovanovic 510",
        "Old Cyrillic",
        "Monotype Corsiva",
        "Shadow",
        "Times New Roman",
        "Verdana"
    ],
    fontSizeSelectInstance: null,
    fontFamilySelectInstance: null,
    fontSizeUnitInMM: 0.35278,
    getTextEditor(elementId) {
        return document.getElementById("editor-text-tool-edit-" + elementId)
    },
    onDeleteElement(id) {
        editor.removeElement(id)
        textTool.getTextEditor(id).remove()
    },
    onAddElement() {
        const boundary = editor.getBoundaryInMM()

        const id = "textel-" + crypto.randomUUID()
        const newElement = {
            id,
            type: "text",
            text: "Текст",
            fontSize: 3.5,
            alignment: "LEFT",
            position: {
                x: boundary.left,
                y: boundary.top
            },
            size: {
                w: 40
            }
        }

        editor.setElements([
            ...editor.getElements(),
            newElement
        ])

        renderElements.renderTextElement(newElement)

        textTool.renderElements([
            newElement
        ])
    },
    getContainer() {
        return document.getElementById("editor-text-tool-elements")
    },
    updateElementText(id, text) {
        const element = document.getElementById("editor-text-tool-edit-" + id)
        const input = element.querySelector("input")

        const textElement = element.querySelector(".text")

        textElement.innerText = text
        input.value = text
    },
    createElement(elementProps) {
        const wrapper = document.createElement("div")
        wrapper.className = "text-editor-wrapper"

        wrapper.addEventListener("click", () => {
            if (editor.selectedElementId !== elementProps?.id) {
                editor.setSelectedElement(elementProps?.id, false)
            }
        })

        const input = document.createElement("input")
        input.value = elementProps.text
        input.addEventListener("input", (e) => {
            console.log("Input changed: ", e, elementProps)
            textDiv.innerText = e.target.value
            editor.updateElement(elementProps.id, {
                text: e.target.value
            })
        })

        // input.addEventListener("input")

        const textDiv = document.createElement("div")
        textDiv.classList.add("text")
        textDiv.innerText = elementProps.text

        function createIconButton(iconPath, className, onClick) {
            const button = document.createElement("button")
            const tickIcon = document.createElement("img")
            tickIcon.src = iconPath
            button.append(tickIcon)
            button.classList.add("button", className)
            button.addEventListener("click", onClick)

            return button
        }

        const approveButton = createIconButton("/images/common/tick.svg", "approve-button", e => {
            wrapper.classList.remove("edited")
            const textElement = editor.getSelectedElement()
            if(textElement.text?.length === 0) {
                textTool.onDeleteElement(textElement.id)
            }
            e.stopPropagation()
        })

        const editButton = createIconButton("/images/common/edit_green.svg", "edit-button", e => {
            editor.setSelectedElement(elementProps?.id, true)
            e.stopPropagation()
        })

        const deleteButton = createIconButton("/images/common/delete.svg", "delete-button", e => {
            textTool.onDeleteElement?.(elementProps?.id)
        })


        wrapper.append(input)
        wrapper.append(textDiv)
        wrapper.append(approveButton)
        wrapper.append(editButton)
        wrapper.append(deleteButton)
        wrapper.id = "editor-text-tool-edit-" + elementProps.id

        return wrapper
    },
    renderElements(elementsProps) {
        const container = textTool.getContainer()

        const elements = elementsProps.map(elementProps => textTool.createElement(elementProps))
        container.append(...elements)
    },
    clearElements() {
        const container = textTool.getContainer()
        container.innerText = ""
    },
    onElementSelected(id, edit) {
        console.log(id, edit);
        
        const textSection = document.getElementById("text-format-section")
        
        if(renderElements.selectedElements.length == 0){
            const texts = textTool.getContainer().querySelectorAll(".text-editor-wrapper")
            texts.forEach(el => el.classList.remove("selected", "edited"))
        }
        
        if (!id) {
            const texts = textTool.getContainer().querySelectorAll(".text-editor-wrapper")
            texts.forEach(el => el.classList.remove("selected", "edited"))
            
            textSection.classList.remove("active")
            return
        }

        textTool.updateFontSizeSelect()
        textTool.updateFontFamilySelect()
        textTool.updateFontSettings()
        textTool.updateTextAlignmentSettings()
        textTool.updateTextColor()
        
        textSection.classList.add("active")

        const textEditor = textTool.getTextEditor(id)

        textEditor.classList.add("selected")
        if (edit) {
            textEditor.classList.add("edited")
        }

        // Wait until the input shows
        // setTimeout(() => {
        //     const input = textEditor.querySelector("input")
        //     input.focus()
        // }, 0)
    },
    onSelectColor(color) {
        console.log(editor.selectedElementId);
        
        if(renderElements.selectedElements.length > 0){
            renderElements.selectedElements.forEach((el)=>{
                editor.updateElement(el.id, {
                    color
                })
            })
        }else{
            editor.updateElement(editor.selectedElementId, {
                color
            })
    
            textTool.updateTextColor()
        }
    },
    generateRecomendedColors() {
        return textTool.predefinedColors.map(color => {
            const button = document.createElement("button")

            button.addEventListener("click", () => {
                textTool.onSelectColor("#" + color)
            })

            button.classList.add("color-button")
            button.style.backgroundColor = "#" + color

            return button
        })
    },

    generateFontsSelect() {
        const container = document.getElementById("editor-select-font")

        for (const font of textTool.fontsOptions) {
            const option = document.createElement("option")
            option.value = font
            option.text = font
            option.innerText = font
            option.style.fontFamily = "'" + font + "'"

            container.append(option)
        }

        container.addEventListener("change", e => {
            if(renderElements.selectedElements.length > 0){
                renderElements.selectedElements.forEach((element) => {
                    editor.updateElement(element.id, {
                        fontFamily: e.target.value
                    })
                })
            }else{
                editor.updateElement(editor.selectedElementId, {
                    fontFamily: e.target.value
                })
            }
        })

        textTool.fontFamilySelectInstance = NiceSelect.bind(container, {placeholder: "Шрифт"})
    },
    _generateFontSizeOptions() {
        let firstSize = 1;
        switch(editor.currentProduct) {
            case "WORK_CALENDAR": {
                firstSize = 20;
                break;
            }
            default: {
                firstSize = 6
            }
        }

        return new Array(15).fill(0).map((_, i) => Math.round(firstSize * Math.pow(i / 4, 1.4)) + firstSize)
    },
    generateFontsSizeSelect() {
        const container = document.getElementById("editor-select-font-size")

        const fontSizeOptions = textTool._generateFontSizeOptions()

        for (const font of fontSizeOptions) {
            const option = document.createElement("option")
            option.value = font
            option.text = font
            option.innerText = font
            
            container.append(option)
        }
        
        container.addEventListener("change", e => {
            if(renderElements.selectedElements.length > 0){
                renderElements.selectedElements.forEach((element) => {
                    editor.updateElement(element.id, {
                        fontSize: Math.round(e.target.value * textTool.fontSizeUnitInMM * 100000) / 100000
                    })
                })
            }else{
                editor.updateElement(editor.selectedElementId, {
                    fontSize: Math.round(e.target.value * textTool.fontSizeUnitInMM * 100000) / 100000
                })
            }
        })
        
        textTool.fontSizeSelectInstance = NiceSelect.bind(container, {placeholder: "Размер"})
    },
    initTextAlignment() {
        const options = [
            "LEFT",
            "CENTER",
            "RIGHT"
        ]

        options.forEach(op => {
            const button = document.getElementById("button-text-align-" + op.toLowerCase())

            button.addEventListener("click", () => {
                options
                    .map(op => document.getElementById("button-text-align-" + op.toLowerCase()))
                    .forEach(button => button.classList.remove("active"))

                button.classList.add("active")

                if(renderElements.selectedElements.length > 0){
                    renderElements.selectedElements.forEach((element)=>{
                        editor.updateElement(element.id, {
                            alignment: op
                        })
                    })
                }else{
                    editor.updateElement(editor.selectedElementId, {
                        alignment: op
                    })
                }
            })
        })
    },
    initFontSettings() {
        function addToggleHandler(setting) {
            const button = document.getElementById("toggle-" + setting)

            button.addEventListener("click", () => {
                button.classList.toggle("active")
                const selectedElement = editor.getSelectedElement()
                if(renderElements.selectedElements.length > 0){
                    renderElements.selectedElements.forEach((element)=>{
                        editor.updateElement(element.id, { [setting]: !selectedElement[setting] })
                    })
                }else{
                    editor.updateElement(editor.selectedElementId, { [setting]: !selectedElement[setting] })
                }
            })
        }

        addToggleHandler("bold")
        addToggleHandler("italic")
        addToggleHandler("underline")
    },
    updateFontSettings() {
        const element = editor.getSelectedElement()

        function updateSetting(setting) {
            const button = document.getElementById("toggle-" + setting)

            if (element?.[setting])
                button.classList.add("active")
            else
                button.classList.remove("active")
        }

        updateSetting("bold")
        updateSetting("italic")
        updateSetting("underline")
    },
    updateTextColor() {
        const element = editor.getSelectedElement()
        const elementColor = element.color || "#000000"

        const recomendedColorsContainer = document.getElementById("recomended-colors")

        const buttons = [...recomendedColorsContainer.children]

        buttons.forEach((button, i) => {
            if ("#" + textTool.predefinedColors[i] === elementColor) {
                button.classList.add("selected")
            }
            else {
                button.classList.remove("selected")
            }
        })
    },
    updateFontSizeSelect() {
        const element = editor.getSelectedElement()

        const container = document.getElementById("editor-select-font-size")

        container.value = Math.round(element.fontSize / textTool.fontSizeUnitInMM)

        textTool.fontSizeSelectInstance?.update()
    },
    updateFontFamilySelect() {
        const element = editor.getSelectedElement()

        const container = document.getElementById("editor-select-font")

        container.value = Math.round(element.fontFamily)

        textTool.fontFamilySelectInstance?.update()
    },
    updateTextAlignmentSettings() {
        const element = editor.getSelectedElement()
        console.log(element);

        const options = [
            "left",
            "center",
            "right"
        ]

        options.forEach(op => {
            const button = document.getElementById("button-text-align-" + op)

            if(op?.toLowerCase() === element?.alignment?.toLowerCase()) {
                button.classList.add("active")
            }
            else {
                button.classList.remove("active")
            }
        })
    },
    init() {
        const addButton = document.getElementById("editor-text-tool-add-text-button")

        addButton.addEventListener("click", () => {
            textTool.onAddElement()
        })

        const recomendedColorsContainer = document.getElementById("recomended-colors")

        recomendedColorsContainer.append(...textTool.generateRecomendedColors())

        textTool.generateFontsSelect()
        textTool.generateFontsSizeSelect()

        textTool.initFontSettings()

        textTool.initTextAlignment()

        Coloris({
            // closeButton: true,
            // closeLabel: "Затвори",
            onChange: (color) => {
                console.log("Update color: ", color, "id: ", editor.selectedElementId)
                //Prevent the button label from changing
                const button = document.getElementById("more-colors-button")
                button.value = "Повече цветове"


                textTool.onSelectColor(color)
            }
        })


    }
}