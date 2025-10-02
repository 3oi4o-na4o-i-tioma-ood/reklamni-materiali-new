const login = {
  _openTab(isSignup) {
    const login_content = document.getElementById("login-form");
    const sign_up_content = document.getElementById("signup-form");

    const login_button = document.getElementById("login_profile");
    const sign_up_button = document.getElementById("sign_up_profile");

    if (isSignup) {
      login_content.style.display = "none";
      sign_up_content.style.display = "flex";

      login_button.classList.add("secondary")
      sign_up_button.classList.remove("secondary")
    }
    else {
      login_content.style.display = "flex";
      sign_up_content.style.display = "none";

      sign_up_button.classList.add("secondary")
      login_button.classList.remove("secondary")
    }

    login.setValidationError(null)
  },
  _openLogin() {
    login._openTab(false)
  },
  _openSignUp() {
    login._openTab(true)
  },
  setValidationError(text) {
    const containers = document.querySelectorAll(".error-container")

    containers.forEach(c => c.innerText = text)
  },
  validateForm(data, isSignup) {
    console.log(data.acceptTC)
    if (isSignup) {
      if (!data.email.match(/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/g)) {
        login.setValidationError("Невалиден имейл")
        return false
      }

      if (!data.phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g)) {
        login.setValidationError("Невалиден телефонен номер")
        return false
      }

      if (data.password?.length < 6) {
        login.setValidationError("Паролата трябва да е поне 6 символа")
        return false
      }

      if (data.password !== data.confirmPassword) {
        login.setValidationError("Повторете паролата си")
        return false
      }

      if (data.acceptTC !== "on") {
        login.setValidationError("Трябва да приемете правилата и условията")
        return false
      }
    }

    return true
  },
  async _login(submitData) {
    const {
      result,
      response
    } = await API.login(submitData)

    if (response.status === 401) {
      login.setValidationError("Грешно потребителско име или парола")
      return
    }

    const token = result.jwt
    if (token) {
      localStorage.setItem("JWT", token)

      window.history.back()
    }
  },
  async _signUp(submitData) {
    const resp = await API.signup(submitData)
    if (!resp.ok) {
      login.setValidationError("Грешка при регистрация")
      return
    }

    window.location.href = "/приключване-на-регистрацията"
  },
  initSubmitButtons() {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    function getSubmitData(submitEvent) {
      const formData = new FormData(submitEvent.target)
      const entries = [...formData.entries()]
      return entries.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
    }

    async function onSubmit(e, isSignup) {
      const data = getSubmitData(e)

      if (!login.validateForm(data, isSignup)) {
        return
      }

      if (isSignup) {
        login._signUp(data)
      }
      else {
        login._login(data)
      }
    }

    loginForm.addEventListener("submit", (e) => {
      onSubmit(e, false)
      return false
    })

    signupForm.addEventListener("submit", (e) => {
      onSubmit(e, true)
      return false
    })
  },
  init() {
    const login_button = document.getElementById("login_profile");
    const sign_up_button = document.getElementById("sign_up_profile");

    login_button.addEventListener("click", () => {
      login._openLogin()
    });

    sign_up_button.addEventListener("click", () => {
      login._openSignUp()
    });

    login._openLogin()
    login.initSubmitButtons()
  }
}

window.addEventListener("load", () => {
  login.init()
});
