const paperTypeTool = {
    _isInitialized: false,
    paperTypes: [
        // Акварело бяло/ слонова кост, металик светлосив, паус, перлен европ айвъри, традишън бял/слонова кост
        // {
        //     name: "Кабалт - 255гр./кв.м",
        //     preview: "previews/kobalt_03_800.jpg",
        //     thumb: "thumbs/kobalt_4_230.jpg"
        // },
        {
            id: 1,
            name: "Двустранно-хромов матов 300г/м2",
            preview: "previews/dvustranno_hromov.jpg",
            thumb: "thumbs/dvustranno_hromov.jpg"
        },
        {
            id: 2,
            name: "Акварело - бял - 250гр./кв.м.",
            preview: "previews/akvarelo_bial_800.jpg",
            thumb: "thumbs/akvarelo_bial_230.jpg"
        },
        {
            id: 3,
            name: "Акварело - слонова кост - 250гр./кв.м.",
            preview: "previews/akvarelo_slonova_kost_01_800.jpg",
            thumb: "thumbs/akvarelo_slonova_kost_1_230.jpg"
        },
        {
            id: 12,
            name: "Металик светлосив - 250гр./кв.м.",
            preview: "previews/metalik_svetlo_siv_03_800.jpg",
            thumb: "thumbs/metalik_svetlo_siv_3_230.jpg"
        },
        {
            id: 15,
            name: "Паус - 255гр./кв.м",
            preview: "previews/paus_800.jpg",
            thumb: "thumbs/paus_230.jpg"
        },
        {
            id: 16,
            name: "Перлен Европа айвъри - 255гр./кв.м",
            preview: "previews/perlen_evropa_aivuri_03_800.jpg",
            thumb: "thumbs/perlen_evropa_aivuri_3_230.jpg"
        },
        {
            id: 21,
            name: "Традишън - бял - 250гр./кв.м.",
            preview: "previews/tradishion_bial_800.jpg",
            thumb: "thumbs/tradishion_bial_230.jpg"
        },
        {
            id: 22,
            name: "Традишън - слонова кост - 250гр./кв.м.",
            preview: "previews/tradishion_slonova_kost_02_800.jpg",
            thumb: "thumbs/tradishion_slonova_kost_2_230.jpg"
        }
    ],
    selectPaperType(index) {
        const previewImage = document.getElementById("paper-type-preview")

        const container = document.getElementById("editor-tool-paper-types-buttons")
        
        const buttons = [...container.querySelectorAll("button")]
        
        for(const i in buttons) {
            if(Number(i) === index) {
                buttons[i].classList.add("selected")
            }
            else {
                buttons[i].classList.remove("selected")
            }
        }
        
        const paperType = paperTypeTool.paperTypes[index]

        const nameElement = document.getElementById("selected-paper-type-name")
        nameElement.innerText = paperType.name

        previewImage.src = "/images/editor/tools/paper_type/" + paperType.preview

        designRepo.setPaperTypeId(paperType.id)
    },
    createButtons() {
        return paperTypeTool.paperTypes.map((props, index) => {
            const button = document.createElement("button")
            const preview = document.createElement("img")
            preview.src = "/images/editor/tools/paper_type/" + props.thumb
            button.append(preview)
            button.classList.add("paper-type-button")

            button.addEventListener("click", () => {
                paperTypeTool.selectPaperType(index)
            })

            return button
        })
    },
    update() {
        if(!this._isInitialized) {
            return
        }

        const paperTypeIndex = paperTypeTool.paperTypes.findIndex(paperType => paperType.id === designRepo.getPaperTypeId())
        console.log(paperTypeIndex)
        paperTypeTool.selectPaperType(paperTypeIndex === -1 ? 0 : paperTypeIndex)
    },
    init() {
        this._isInitialized = true

        const container = document.getElementById("editor-tool-paper-types-buttons")

        container.append(...paperTypeTool.createButtons())

        const paperTypePreview = document.getElementById("paper-type-preview")

        imageMagnifier.init(paperTypePreview)

    }
}