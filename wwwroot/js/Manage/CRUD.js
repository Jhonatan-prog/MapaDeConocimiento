// style manager
const DOM = document;

const formContainer = DOM.getElementById("form-background-blurred");
formContainer.addEventListener('click', (e) => {
    formContainer.classList.add('js-hidden')
    e.stopPropagation();
});

const createBtn = DOM.getElementById("create-btn");
createBtn.addEventListener('click', () => {
    formContainer.classList.remove('js-hidden')
});
