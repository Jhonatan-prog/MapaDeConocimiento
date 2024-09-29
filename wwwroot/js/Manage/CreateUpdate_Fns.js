// style manager
const DOM = document;

const newRegisterForm = DOM.querySelector("div.form-container.create");
const updateRegisterForm = DOM.querySelector("div.form-container.update");
newRegisterForm.addEventListener('click', (e) => {
    if (e.target === newRegisterForm) {
        newRegisterForm.classList.remove('js-display-create_box')
    }

    e.stopPropagation();
});

const createBtn = DOM.getElementById("create-btn");
createBtn.addEventListener('click', () => {
    newRegisterForm.classList.add('js-display-create_box')
});

updateRegisterForm.addEventListener('click', (e) => {
    if (e.target === updateRegisterForm) {
        updateRegisterForm.classList.remove('js-display-update_box')
    }

    e.stopPropagation();
});

const updateBtn = DOM.getElementById("update-btn");
updateBtn.addEventListener('click', () => {
    updateRegisterForm.classList.add('js-display-update_box')
});

