const adminProductPage = {
    _productType: null,
    _columns: null,
    initTextEditingElement(element, onValueChange) {
        const editButton = element.querySelector("#row-edit-button")
        const cancelButton = element.querySelector("#row-cancel-button")
        const saveButton = element.querySelector("#row-save-button")
        const textContainer = element.querySelector(".text")
        const input = element.querySelector("input")

        editButton.addEventListener("click", () => {
            element.classList.add("edited")

            const html = textContainer.innerHTML
                .trim()
                .replaceAll(/\s+/g, " ")
            const formatted = html.replaceAll(/<strong>|<\/strong>/g, "***")

            input.value = formatted
        })

        function starsToStrong(string) {
            return "<strong>" + string.slice(3, -3) + "</strong>"
        }

        function formatToHTML(text) {
            const boldMatches = [...text.matchAll(/\*\*\*[^\*]*\*\*\*/g)]

            const html = boldMatches
                .sort((m1, m2) => m1.index - m2.index)
                .reduce((result, match, index) => result +
                    starsToStrong(match[0]) +
                    text.slice(match.index + match[0].length, boldMatches[index + 1]?.index),
                    text.slice(0, boldMatches[0]?.index))

            return html
        }


        saveButton.addEventListener("click", () => {
            const html = formatToHTML(input.value)

            onValueChange(html)
            textContainer.innerHTML = html

            element.classList.remove("edited")
        })

        cancelButton.addEventListener("click", () => {
            element.classList.remove("edited")
        })
    },
    initTableRowEditing(row, productType) {
        const cells = [...row.children].slice(0, -4)

        const editButton = row.querySelector("#row-edit-button")
        const deleteButton = row.querySelector("#row-delete-button")
        const saveButton = row.querySelector("#row-save-button")
        const cancelButton = row.querySelector("#row-cancel-button")

        cells.forEach((cell) => {
            if (cell.querySelector("input") || !cell.classList.contains("editable-cell")) {
                return
            }

            const input = document.createElement("input")
            cell.append(input)
        })

        editButton.addEventListener("click", () => {
            row.classList.add("edited")

            cells.forEach(cell => {
                const input = cell.querySelector("input")
                const content = cell.querySelector(".cell-content")

                if (cell.classList.contains("editable-cell") && input) {
                    input.value = content.innerText
                }
            })
        })

        saveButton.addEventListener("click", async () => {
            const cellsData = []

            cells.forEach(cell => {
                const input = cell.querySelector("input")
                const content = cell.querySelector(".cell-content")

                if (cell.classList.contains("editable-cell")) {
                    cellsData.push(input.value)
                    content.innerText = input.value
                }

            })

            console.log(cellsData, adminProductPage._columns)
            if (adminProductPage._columns) {

                const prices = cellsData.map((value, index) => ({
                    printType: adminProductPage._columns[index],
                    value: Number(value.replaceAll(",", "."))
                }))

                await API.updatePrices(productType, parseInt(cells[0].innerText), prices)
            }

            row.classList.remove("edited")
        })

        cancelButton.addEventListener("click", () => {
            row.classList.remove("edited")
        })

        deleteButton.addEventListener("click", () => {
            // TO DO: delete request
        })

    },
    initTableEditing(id, productType) {
        if(!productType) {
            console.error("Product type is required")
            return
        }

        const table = document.getElementById(id)
        if(!table) {
            console.error(`Table with id ${id} not found`)
            return
        }

        const rows = table.querySelectorAll("tbody tr")

        for (const row of rows) {
            adminProductPage.initTableRowEditing(row, productType)
        }

        // const addRowButton = document.getElementById("add-table-row-button")
        // addRowButton.addEventListener("click", () => {

        // })
    },
    initNotesEditing(note) {
        const noteTypeSelect = document.getElementById("note-type-select")
        const priceInput = document.getElementById("price-input")

        noteTypeSelect.addEventListener("change", () => {
            note.noteType = noteTypeSelect.value
        })
    },
    onTextElementValueChange(value, id) {
        console.log(id)
        if (["FAST_PRODUCTION", "EXPRESS_PRODUCTION", "LAMINATION", "ROUNDED_CORNERS", "EFFECT_CARTON", "FLYER_10x15_LAMINATION_MAT", "FLYER_10x15_LAMINATION_GLOSSY", "FLYER_10x20_LAMINATION_MAT", "FLYER_10x20_LAMINATION_GLOSSY"].includes(id)) {
            let productType = adminProductPage._productType;
            
            if(adminProductPage._productType === "FLYER_BOTH_SIZES" && id.startsWith("FLYER_")) {
                productType = "FLIER_"+ id.split("_")[1];
                const prefixLength = "FLYER_10x15_".length;
                id = id.slice(prefixLength);
            }
            
            API.updateNotePrice({
                productType: productType,
                noteType: id,
                price: Number(value)
            })
            return
        }

        if ([
            "BUSINESS_CARD_PRICES_NOTE",
            "FLYER_PRICES_NOTE",
            "PEN_PRICES_NOTE",
            "LIGHTER_PRICES_NOTE",
            "WORK_CALENDAR_PRICES_NOTE",
            "POCKET_CALENDAR_PRICES_NOTE",
            "FLYER_PRICES_NOTE",

            "BUSINESS_CARD_PROMOTION_CONDITION_1",
            "BUSINESS_CARD_PROMOTION_REWARD_1",
            "BUSINESS_CARD_PROMOTION_CONDITION_2",
            "BUSINESS_CARD_PROMOTION_REWARD_2",
            "BUSINESS_CARD_PROMOTION_CONDITION_3",
            "BUSINESS_CARD_PROMOTION_REWARD_3",
            "BUSINESS_CARD_PROMOTION_CONDITION_4",

            "POCKET_CALENDAR_PROMOTION_CONDITION_1",
            "POCKET_CALENDAR_PROMOTION_REWARD_1",
            "POCKET_CALENDAR_PROMOTION_CONDITION_2",
            "POCKET_CALENDAR_PROMOTION_CONDITION_3",
            "POCKET_CALENDAR_PROMOTION_CONDITION_4",
            "POCKET_CALENDAR_PROMOTION_CONDITION_5",

            "WORK_CALENDAR_PROMOTION_CONDITION_1",
            "WORK_CALENDAR_PROMOTION_CONDITION_2",
            "WORK_CALENDAR_PROMOTION_REWARD_2",
            "WORK_CALENDAR_PROMOTION_CONDITION_3",
            "WORK_CALENDAR_PROMOTION_REWARD_3",
            "WORK_CALENDAR_PROMOTION_CONDITION_4",
            "WORK_CALENDAR_PROMOTION_REWARD_4_1",
            "WORK_CALENDAR_PROMOTION_REWARD_4_2"
        ].includes(id)) {
            API.updateTextPiece(id, value)
            return
        }
    },
    init(productType, columns) {
        adminProductPage._productType = productType
        adminProductPage._columns = columns

        const textEditingElements = document.querySelectorAll(".text-editing")
        console.log(textEditingElements)

        for (const element of textEditingElements) {
            adminProductPage.initTextEditingElement(element, value => adminProductPage.onTextElementValueChange(value, element.id))
        }
    }
}