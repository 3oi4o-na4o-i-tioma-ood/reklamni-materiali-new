const profilePage = {
    _initExitButton() {
        const exitButton = document.getElementById("exit-button")

        exitButton.addEventListener("click", () => {
            auth.clearToken()
            window.location.href = "/"
        })
    },
    init() {
        const menuUsername = document.getElementById("menu-username")

        const jwt = auth.getToken();
        const jwtParsed = auth.parseToken(jwt)
        console.log(jwtParsed)
        const username = jwtParsed.name + " " + jwtParsed.surname
        menuUsername.innerText = username

        const userIcon = document.getElementById("menu-user-icon")
        userIcon.innerText = username.charAt(0)

        profilePage._initExitButton()
    }
}

window.addEventListener("load", () => {
    profilePage.init()
})