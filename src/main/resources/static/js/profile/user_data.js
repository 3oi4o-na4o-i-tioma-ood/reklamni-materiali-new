const userDataPage = {
  async _save(formData) {
    const loader = document.getElementById("loader");
    const text = document.getElementById("button_text");

    loader.style.display = "block";
    text.style.display = "none";
    console.log(formData);
    // {
    //     "name": "Artem",
    //     "surname": "Zankovskyi",
    //     "email": "",
    //     "phone": "0876845187",
    //     "addressCity": "Sofia",
    //     "addressStreet": "Solun 35",
    //     "addressNumber": "",
    //     "addressEntrance": "",
    //     "addressApartment": ""
    // }

    const {
      addressCity,
      addressStreet,
      addressNumber,
      addressEntrance,
      addressApartment,
      ...updatedFormData
    } = formData;

    updatedFormData.address = [
      addressCity,
      addressStreet,
      addressNumber,
      addressEntrance,
      addressApartment,
    ].join(" ");

    await API.updateUser(updatedFormData);
    await API.refreshJWT();

    loader.style.display = "none";
    text.style.display = "block";
    userDataPage._openSnackbar(`Вашите данни са запазени`, false);

    const submit_btn = document.getElementById("submit-btn");
    submit_btn.removeAttribute("disabled");
    submit_btn.classList.remove("disabled");
  },
  _initDeliveryData() {
    const submit_btn = document.getElementById("submit-btn");
    const form = document.getElementById("delivery-form");

    // const debouncedSave = createDebounce(userDataPage._save, 1000);
    const debouncedSave = createDebounce(userDataPage._save, 0);

    // submit_btn.addEventListener("click", () => {
    //   const formData = new FormData(form);
    //   debouncedSave(Object.fromEntries(formData));
    // });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submit_btn.setAttribute("disabled", "disabled");
      submit_btn.classList.add("disabled");

      const formData = new FormData(form);
      debouncedSave(Object.fromEntries(formData));
    });
  },
  _autoFillDeliveryData() {
    const name = document.getElementById("form-name");
    const surname = document.getElementById("form-surname");
    const email = document.getElementById("form-email");
    const phone = document.getElementById("form-phone");

    const addressCity = document.getElementById("form-address-city");
    const addressStreet = document.getElementById("form-address-street");
    const addressNumber = document.getElementById("form-address-number");
    const addressEntrance = document.getElementById("form-address-entrance");
    const addressApartment = document.getElementById("form-address-apartment");

    const user = auth.parseToken(auth.getToken());

    name.value = user.name;
    surname.value = user.surname;
    email.value = user.email;
    phone.value = user.phone;

    addressCity.value = user.addressCity || "";
    addressStreet.value = user.addressStreet || "";
    addressNumber.value = user.addressNumber || "";
    addressEntrance.value = user.addressEntrance || "";
    addressApartment.value = user.addressApartment || "";
  },

  _openSnackbar(text, isWarning) {
    const snackbar = document.getElementById("save-profie-snackbar");
    snackbar.innerText = text;
    snackbar.classList.add("visible");
    if (isWarning) {
      snackbar.classList.add("warning");
    } else {
      snackbar.classList.remove("warning");
    }

    setTimeout(() => {
      snackbar.classList.remove("visible");
    }, 3000);
  },

  init() {
    userDataPage._autoFillDeliveryData();
    userDataPage._initDeliveryData();
  },
};

window.addEventListener("load", () => {
  userDataPage.init();
});
