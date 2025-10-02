const verifyEmail = {
    openVerificationSuccessPage() {
        const emailVerifiedSection = document.getElementById("email-verified-section")
        const verifyingEmailSection = document.getElementById("verifying-email-section")

        emailVerifiedSection.style.display = null
        verifyingEmailSection.style.display = "none"
    },
    setStatusMessage(message) {
        const messageContainer = document.getElementById("status-message")

        messageContainer.innerText = message
    },
    async init() {
        const emailVerifiedSection = document.getElementById("email-verified-section")

        emailVerifiedSection.style.display = "none"

        const token = auth.getToken()

        if(token) {
            verifyEmail.openVerificationSuccessPage()
        }
        else {
            const code = new URLSearchParams(window.location.search).get("code")
            
            const resp = await API.verifyEmail(code)

            
            if(!resp.jwt) {

                verifyEmail.setStatusMessage("Грешка при потвържденито на имейл. ")
                // TO DO: Show error
                return
            }
            
            verifyEmail.openVerificationSuccessPage()
            auth.setToken(resp.jwt)
        }
    }
}

window.addEventListener("load", () => {
    verifyEmail.init()
})