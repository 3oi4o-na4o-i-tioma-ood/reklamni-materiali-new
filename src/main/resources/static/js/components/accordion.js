const accordion = {
    initGroup(groupElement) {
        const accordions = groupElement.querySelectorAll(".accordion")

        const timer = { current: null }

        function collapseAll() {
            for (const accordion of accordions) {
                const isOpen = accordion.classList.contains("open")

                if(isOpen) {
                    accordion.classList.remove("open")
                    const content = accordion.querySelector(".content")

                    // Cannot make animation from "auto" to 0, thus setting the height
                    content.style.maxHeight = content.scrollHeight + "px"
                    setTimeout(() => {
                        content.style.maxHeight = 0
                    })
                }
            }
        }

        for (const accordion of accordions) {
            const summaryButton = accordion.querySelector("button")
            summaryButton.addEventListener("click", () => {
                if (timer.current) {
                    clearTimeout(timer.current)
                    timer.current = null
                }

                const isOpen = accordion.classList.contains("open")
                collapseAll()

                if (!isOpen) {
                    accordion.classList.add("open")
                    const content = accordion.querySelector(".content")
                    content.style.maxHeight = content.scrollHeight + "px"

                    timer.current = setTimeout(() => {
                        timer.current = null

                        content.style.maxHeight = "none"
                    }, 500)
                }
            })
        }
    },
    initSingle(accordionElement) {
        //accordionElement.classList.add()
    }
}