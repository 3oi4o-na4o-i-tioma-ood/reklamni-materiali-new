// Font size is in mm

const flyerMainTemplate = [
    {
        id: "company_name",
        size: {
            w: 85
        },
        position: {
            x: 8,
            y: 8
        },
        alignment: "CENTER"
    },
    {
        id: "moto",
        size: {
            w: 85
        },
        position: {
            x: 8,
            y: 23
        },
        alignment: "CENTER"
    },
    {
        id: "free_text",
        size: {
            w: 85
        },
        position: {
            x: 8,
            y: 32
        },
        alignment: "CENTER"
    }
]

const templates = {
    "BUSINESS_CARD": [
        [
            {
                alignment: "LEFT",
                id: "company_name",
                position: {
                    x: 7,
                    y: 7
                },
                size: {
                    w: 50
                }
            },
            {
                alignment: "LEFT",
                id: "moto",
                position: {
                    x: 7,
                    y: 12.5
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "name",
                position: {
                    x: 7,
                    y: 17.75
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "role",
                position: {
                    x: 7,
                    y: 22.5
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "address1",
                position: {
                    x: 7,
                    y: 28
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "address2",
                position: {
                    x: 7,
                    y: 31
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "phone_1",
                position: {
                    x: 7,
                    y: 34
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "phone_2",
                position: {
                    x: 7,
                    y: 37
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "email",
                position: {
                    x: 7,
                    y: 40
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "web",
                position: {
                    x: 7,
                    y: 43
                },
                size: {
                    w: 40
                }
            }
        ],
        [
            {
                alignment: "CENTER",
                id: "company_name",
                position: {
                    x: 7,
                    y: 7
                },
                size: {
                    w: 80
                }
            },
            {
                alignment: "CENTER",
                id: "moto",
                position: {
                    x: 7,
                    y: 12.5
                },
                size: {
                    w: 80
                }
            },
            {
                alignment: "CENTER",
                id: "name",
                position: {
                    x: 7,
                    y: 17.75
                },
                size: {
                    w: 80
                }
            },
            {
                alignment: "CENTER",
                id: "role",
                position: {
                    x: 7,
                    y: 22.5
                },
                size: {
                    w: 80
                }
            },
            {
                alignment: "CENTER",
                id: "address1",
                position: {
                    x: 7,
                    y: 28
                },
                size: {
                    w: 80
                }
            },
            {
                alignment: "CENTER",
                id: "address2",
                position: {
                    x: 7,
                    y: 31
                },
                size: {
                    w: 80
                }
            },
            {
                alignment: "CENTER",
                id: "phone_1",
                position: {
                    x: 7,
                    y: 34
                },
                size: {
                    w: 80
                }
            },
            {
                alignment: "CENTER",
                id: "phone_2",
                position: {
                    x: 7,
                    y: 37
                },
                size: {
                    w: 80
                }
            },
            {
                alignment: "CENTER",
                id: "email",
                position: {
                    x: 7,
                    y: 40
                },
                size: {
                    w: 80
                }
            },
            {
                alignment: "CENTER",
                id: "web",
                position: {
                    x: 7,
                    y: 43
                },
                size: {
                    w: 80
                }
            }
        ],
        [
            {
                alignment: "RIGHT",
                id: "company_name",
                position: {
                    x: 37,
                    y: 7
                },
                size: {
                    w: 50
                }
            },
            {
                alignment: "RIGHT",
                id: "moto",
                position: {
                    x: 47,
                    y: 12.5
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "name",
                position: {
                    x: 47,
                    y: 17.75
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "role",
                position: {
                    x: 47,
                    y: 22.5
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "address1",
                position: {
                    x: 47,
                    y: 28
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "address2",
                position: {
                    x: 47,
                    y: 31
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "phone_1",
                position: {
                    x: 47,
                    y: 34
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "phone_2",
                position: {
                    x: 47,
                    y: 37
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "email",
                position: {
                    x: 47,
                    y: 40
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "web",
                position: {
                    x: 47,
                    y: 43
                },
                size: {
                    w: 40
                }
            }
        ],
        [
            {
                alignment: "CENTER",
                id: "company_name",
                position: {
                    x: 7,
                    y: 23
                },
                size: {
                    w: 80
                }
            },
            {
                alignment: "CENTER",
                id: "moto",
                position: {
                    x: 7,
                    y: 29
                },
                size: {
                    w: 80
                }
            },
            {
                alignment: "LEFT",
                id: "name",
                position: {
                    x: 7,
                    y: 7
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "role",
                position: {
                    x: 7,
                    y: 12
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "address1",
                position: {
                    x: 7,
                    y: 40
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "address2",
                position: {
                    x: 7,
                    y: 43
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "phone_1",
                position: {
                    x: 47,
                    y: 40
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "phone_2",
                position: {
                    x: 47,
                    y: 43
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "email",
                position: {
                    x: 47,
                    y: 7
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "web",
                position: {
                    x: 47,
                    y: 10
                },
                size: {
                    w: 40
                }
            }
        ],
        [
            {
                alignment: "LEFT",
                id: "company_name",
                position: {
                    x: 7,
                    y: 25
                },
                size: {
                    w: 50
                }
            },
            {
                alignment: "LEFT",
                id: "moto",
                position: {
                    x: 7,
                    y: 31
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "name",
                position: {
                    x: 7,
                    y: 38
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "role",
                position: {
                    x: 7,
                    y: 43
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "address1",
                position: {
                    x: 47,
                    y: 7
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "address2",
                position: {
                    x: 47,
                    y: 10
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "phone_1",
                position: {
                    x: 47,
                    y: 13
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "phone_2",
                position: {
                    x: 47,
                    y: 16
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "email",
                position: {
                    x: 47,
                    y: 19
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "web",
                position: {
                    x: 47,
                    y: 22
                },
                size: {
                    w: 40
                }
            }
        ],
        [
            {
                alignment: "RIGHT",
                id: "company_name",
                position: {
                    x: 37,
                    y: 25
                },
                size: {
                    w: 50
                }
            },
            {
                alignment: "RIGHT",
                id: "moto",
                position: {
                    x: 47,
                    y: 31
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "name",
                position: {
                    x: 47,
                    y: 38
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "RIGHT",
                id: "role",
                position: {
                    x: 47,
                    y: 43
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "address1",
                position: {
                    x: 7,
                    y: 7
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "address2",
                position: {
                    x: 7,
                    y: 10
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "phone_1",
                position: {
                    x: 7,
                    y: 13
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "phone_2",
                position: {
                    x: 7,
                    y: 16
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "email",
                position: {
                    x: 7,
                    y: 19
                },
                size: {
                    w: 40
                }
            },
            {
                alignment: "LEFT",
                id: "web",
                position: {
                    x: 7,
                    y: 22
                },
                size: {
                    w: 40
                }
            }
        ]
    ],
    "POCKET_CALENDAR": [
        [
            {
                id: "company_name",
                size: {
                    w: 79
                },
                position: {
                    x: 7,
                    y: 20
                },
                alignment: "CENTER"
            },
            {
                id: "moto",
                size: {
                    w: 79
                },
                position: {
                    x: 7,
                    y: 26
                },
                alignment: "CENTER"
            },
            {
                id: "web",
                size: {
                    w: 79
                },
                position: {
                    x: 7,
                    y: 45
                },
                alignment: "CENTER"
            },
            {
                id: "year",
                size: {
                    w: 79
                },
                position: {
                    x: 7,
                    y: 7
                },
                alignment: "RIGHT"
            }
        ],
        [
            {
                id: "company_name",
                size: {
                    w: 79
                },
                position: {
                    x: 7,
                    y: 7
                },
                alignment: "LEFT"
            },
            {
                id: "moto",
                size: {
                    w: 79
                },
                position: {
                    x: 7,
                    y: 12.5
                },
                alignment: "LEFT"
            },
            {
                id: "web",
                size: {
                    w: 79
                },
                position: {
                    x: 7,
                    y: 17.75
                },
                alignment: "LEFT"
            },
            {
                id: "year",
                size: {
                    w: 79
                },
                position: {
                    x: 7,
                    y: 40.5
                },
                alignment: "RIGHT"
            }
        ],
        [
            {
                id: "company_name",
                size: {
                    w: 79
                },
                position: {
                    x: 7,
                    y: 7
                },
                alignment: "CENTER"
            },
            {
                id: "moto",
                size: {
                    w: 79
                },
                position: {
                    x: 7,
                    y: 12.5
                },
                alignment: "CENTER"
            },
            {
                id: "web",
                size: {
                    w: 79
                },
                position: {
                    x: 7,
                    y: 17.75
                },
                alignment: "CENTER"
            },
            {
                id: "year",
                size: {
                    w: 79
                },
                position: {
                    x: 7,
                    y: 40.5
                },
                alignment: "CENTER"
            }
        ]
    ],
    "FLIER_10x15": [
        flyerMainTemplate
    ],
    "FLIER_10x20": [
        flyerMainTemplate
    ],
    WORK_CALENDAR: [
        [
            {
                id: "company_name",
                size: {
                    w: 318
                },
                position: {
                    x: 8,
                    y: 8
                },
                alignment: "CENTER"
            },
            {
                id: "moto",
                size: {
                    w: 318
                },
                position: {
                    x: 8,
                    y: 23
                },
                alignment: "CENTER"
            },
            {
                id: "address1",
                size: {
                    w: 150
                },
                position: {
                    x: 8,
                    y: 210
                },
                alignment: "LEFT"
            },
            {
                id: "address2",
                size: {
                    w: 150
                },
                position: {
                    x: 8,
                    y: 217
                },
                alignment: "LEFT"
            },
            {
                id: "phone_1",
                size: {
                    w: 150
                },
                position: {
                    x: 175,
                    y: 196
                },
                alignment: "RIGHT"
            },
            {
                id: "phone_2",
                size: {
                    w: 150
                },
                position: {
                    x: 175,
                    y: 203
                },
                alignment: "RIGHT"
            },
            {
                id: "email",
                size: {
                    w: 150
                },
                position: {
                    x: 175,
                    y: 210
                },
                alignment: "RIGHT"
            },
            {
                id: "web",
                size: {
                    w: 150
                },
                position: {
                    x: 175,
                    y: 217
                },
                alignment: "RIGHT"
            }
        ]
    ],
    PEN: [
        [
            {
                id: "company_name",
                size: {
                    w: 89
                },
                position: {
                    x: 30,
                    y: 14
                },
                alignment: "CENTER"
            },
            {
                id: "contacts",
                size: {
                    w: 89
                },
                position: {
                    x: 30,
                    y: 18
                },
                alignment: "CENTER"
            }
        ]
    ],
    LIGHTER: [
        [
            {
                id: "company_name",
                size: {
                    w: 47
                },
                position: {
                    x: 22,
                    y: 10
                },
                alignment: "CENTER"
            },
            {
                id: "contacts",
                size: {
                    w: 47
                },
                position: {
                    x: 22,
                    y: 14
                },
                alignment: "CENTER"
            },
            {
                id: "web",
                size: {
                    w: 47
                },
                position: {
                    x: 22,
                    y: 18
                },
                alignment: "CENTER"
            }
        ]
    ]
}

const backTemplates = {
    POCKET_CALENDAR: [
        [
            {
                id: "company_name",
                size: {
                    w: 81
                },
                position: {
                    x: 6,
                    y: 28.5
                },
                alignment: "CENTER"
            },
            {
                id: "moto",
                size: {
                    w: 81
                },
                position: {
                    x: 6,
                    y: 32
                },
                alignment: "CENTER"
            },
            {
                id: "address1",
                size: {
                    w: 30
                },
                position: {
                    x: 6,
                    y: 35
                },
                alignment: "LEFT"
            },
            {
                id: "address2",
                size: {
                    w: 30
                },
                position: {
                    x: 6,
                    y: 37
                },
                alignment: "LEFT"
            },
            {
                id: "phone",
                size: {
                    w: 30
                },
                position: {
                    x: 57,
                    y: 35
                },
                alignment: "RIGHT"
            },
            {
                id: "email",
                size: {
                    w: 30
                },
                position: {
                    x: 57,
                    y: 37
                },
                alignment: "RIGHT"
            }
        ],
        [
            {
                id: "company_name",
                size: {
                    w: 30
                },
                position: {
                    x: 6,
                    y: 28.5
                },
                alignment: "LEFT"
            },
            {
                id: "moto",
                size: {
                    w: 30
                },
                position: {
                    x: 6,
                    y: 32
                },
                alignment: "LEFT"
            },
            {
                id: "address1",
                size: {
                    w: 30
                },
                position: {
                    x: 57,
                    y: 28.5
                },
                alignment: "RIGHT"
            },
            {
                id: "address2",
                size: {
                    w: 30
                },
                position: {
                    x: 57,
                    y: 30.5
                },
                alignment: "RIGHT"
            },
            {
                id: "phone",
                size: {
                    w: 30
                },
                position: {
                    x: 57,
                    y: 32.5
                },
                alignment: "RIGHT"
            },
            {
                id: "email",
                size: {
                    w: 30
                },
                position: {
                    x: 57,
                    y: 34.5
                },
                alignment: "RIGHT"
            }
        ],
        [
            {
                id: "company_name",
                size: {
                    w: 30
                },
                position: {
                    x: 57,
                    y: 28.5
                },
                alignment: "RIGHT"
            },
            {
                id: "moto",
                size: {
                    w: 30
                },
                position: {
                    x: 57,
                    y: 32
                },
                alignment: "RIGHT"
            },
            {
                id: "address1",
                size: {
                    w: 30
                },
                position: {
                    x: 6,
                    y: 28.5
                },
                alignment: "LEFT"
            },
            {
                id: "address2",
                size: {
                    w: 30
                },
                position: {
                    x: 6,
                    y: 30.5
                },
                alignment: "LEFT"
            },
            {
                id: "phone",
                size: {
                    w: 30
                },
                position: {
                    x: 6,
                    y: 32.5
                },
                alignment: "LEFT"
            },
            {
                id: "email",
                size: {
                    w: 30
                },
                position: {
                    x: 6,
                    y: 34.5
                },
                alignment: "LEFT"
            }
        ]
    ]
}

const templatesTool = {
    getButtons(isBackSide = false) {
        const container = document.getElementById(isBackSide ? "editor-back-templates-container" : "editor-templates-container")

        const buttons = container.getElementsByTagName("button")

        return [...buttons]
    },
    selectActive(index, isBackSide = false) {

        const buttons = templatesTool.getButtons(isBackSide)

        for (const i in buttons) {
            const button = buttons[i]

            if (Number(i) === Number(index)) {
                button.classList.add("active")
            }
            else {
                button.classList.remove("active")
            }
        }
    },
    updateElements(elements, activeTemplate) {
        return elements.map(element => {
            const templateElement = activeTemplate.find(templateEl => templateEl.id === element.id)

            if (!templateElement) {
                return element
            }

            return {
                ...element,
                ...templateElement
            }
        })
    },
    initButtons(product, isBackSide = false) {
        const buttons = templatesTool.getButtons(isBackSide)

        for (const i in buttons) {
            const index = Number(i)
            const button = buttons[index]

            button.addEventListener("click", () => {
                templatesTool.selectActive(index, isBackSide)

                const template = isBackSide ? backTemplates[product][index] : templates[product][index]

                const updatedElements = this.updateElements(editor.getElements(), template)

                editor.setElements(updatedElements)

                renderElements.rerenderElements(updatedElements, editor.canvasPxPerProductMM)

            })
        }
    },
    setSelectedSide(selectedSide) {
        
        const container = document.getElementById("editor-templates-container")
        const backContainer = document.getElementById("editor-back-templates-container")

        if(!backContainer) {
            return
        }

        if(selectedSide === 1) {
            container.style.display = "none"
            backContainer.style.display = null
        }
        else {
            container.style.display = null
            backContainer.style.display = "none"
        }
    },
    init(product) {
        templatesTool.initButtons(product, false)
        if(backTemplates[product]) {
            templatesTool.initButtons(product, true)
        }
    }
}