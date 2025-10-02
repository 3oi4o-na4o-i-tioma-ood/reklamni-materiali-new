const saveToFavorite = {
    _popupId: "save-design-popup",
    openPopup() {
        // const input = document.getElementById("new-design-name");
        // const saveTypeSelect = document.getElementById("save-type-select");

        // if (designRepo.isFavorite) {
        //     saveTypeSelect.style.display = null
        //     input.style.display = "none";
        // }
        // else {
        //     saveTypeSelect.style.display = "none"
        //     input.style.display = null;
        // }

        if (designRepo.isFavorite && designRepo.name) {
            saveToFavorite._openSnackbar(`Дизайнът вече е запазен с име "${designRepo.name}"`, true)
            return
        }

        popup.open(saveToFavorite._popupId);
    },
    _initOpenPopupButton() {
        const openPopupButton = document.getElementById("save-design-button");

        openPopupButton.addEventListener("click", () => {
            const jwt = auth.getToken();
            if (jwt) {
                saveToFavorite.openPopup()
                return
            }

            saveToFavorite._openSnackbar("За да добавите дизайн в любими, влезте с Вашия акаунт", true)
        });
    },
    _openSnackbar(text, isWarning) {
        const snackbar = document.getElementById("save-design-snackbar");
        snackbar.innerText = text
        snackbar.classList.add("visible");
        if(isWarning) {
            snackbar.classList.add("warning");
        }
        else {
            snackbar.classList.remove("warning");
        }

        setTimeout(() => {
            snackbar.classList.remove("visible");
        }, 3000);
    },
    _setButtonState(isActive) {
        const openPopupButton = document.getElementById("save-design-button");
        const image = openPopupButton.querySelector("img")

        if(isActive) {
            openPopupButton.classList.add("active")
            image.src = "/images/editor/save_white.svg"
        }
        else {
            openPopupButton.classList.remove("active")
            image.src = "/images/editor/save.svg"
        }
    },
    init() {
        popup.init(saveToFavorite._popupId);

        // const form = document.getElementById("save-design-form");

        // form.addEventListener("change", (e) => {
        //     const formData = new FormData(form);
        //     console.log([...formData]);
        //     const saveType = formData.get("saveType");
        //     if (saveType) {
        //         input.style.display = saveType === "new" ? "block" : "none";
        //     }
        // });

        saveToFavorite._setButtonState(designRepo.isFavorite && !!designRepo.name)

        saveToFavorite._initOpenPopupButton()

        const saveButton = document.querySelector("#save-design-form #button-save")

        saveButton.addEventListener("click", (e) => {
            e.preventDefault()
            const nameInput = document.getElementById("new-design-name");

            designRepo.name = nameInput.value
            designRepo.isFavorite = true

            popup.close(saveToFavorite._popupId)

            saveToFavorite._openSnackbar(`Дизайнът е запазен с име "${designRepo.name}"`, false)

            saveToFavorite._setButtonState(true)
        })
    },
}