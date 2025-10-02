const adminProductPage = {
    _productType: null,
    _columns: null,
    initTextEditingElement(element) {
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

        saveButton.addEventListener("click", () => {
            element.classList.remove("edited")

            const text = input.value

            const boldMatches = [...text.matchAll(/\*\*\*[^\*]*\*\*\*/g)]

            const html = boldMatches
                .sort((m1, m2) => m1.index - m2.index)
                .reduce((result, match, index) => result +
                    starsToStrong(match[0]) +
                    text.slice(match.index + match[0].length, boldMatches[index + 1]?.index),
                    text.slice(0, boldMatches[0]?.index))

            console.log(boldMatches
                .sort((m1, m2) => m1.index - m2.index), html)

            textContainer.innerHTML = html
        })

        cancelButton.addEventListener("click", () => {
            element.classList.remove("edited")
        })
    },
    initTableRowEditing(row) {
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

            console.log(cellsData)
            if(adminProductPage._columns) {

                const prices = cellsData.map((value, index) => ({
                    printType: adminProductPage._columns[index],
                    value: Number(value)
                }))

                await API.updatePrices(adminProductPage._productType, parseInt(cells[0].innerText), prices)
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
    initTableEditing(id) {
        const table = document.getElementById(id)
        const rows = table.querySelectorAll("tbody tr")

        for (const row of rows) {
            adminProductPage.initTableRowEditing(row)
        }

        // const addRowButton = document.getElementById("add-table-row-button")
        // addRowButton.addEventListener("click", () => {

        // })
    },
    init(productType, columns) {
        adminProductPage._productType = productType
        adminProductPage._columns = columns

        const textEditingElements = document.querySelectorAll(".text-editing")

        for (const element of textEditingElements) {
            adminProductPage.initTextEditingElement(element)
        }

        adminProductPage.initTableEditing("editable-prices-table")
    }
}