import { GenericTable } from "/js/utils/Generic/Frontend.js";

// Forms Elements set-up
const newRegisterForm = document.querySelector("div.form-container.create");
const updateRegisterForm = document.querySelector("div.form-container.update");
newRegisterForm.addEventListener('click', (e) => {
    if (e.target === newRegisterForm) {
        newRegisterForm.classList.remove('js-display-create_box')
    }

    e.stopPropagation();
});

const createBtn = document.getElementById("create-btn");
createBtn.addEventListener('click', () => {
    newRegisterForm.classList.add('js-display-create_box')
});

updateRegisterForm.addEventListener('click', (e) => {
    if (e.target === updateRegisterForm) {
        updateRegisterForm.classList.remove('js-display-update_box')
    }

    e.stopPropagation();
});

// table set-up
const $currentTable = document.querySelector('table#registers-table');
const qSelectorInitializer = {
    tableNavQSelector: "div.table-pages",
    formQSelectorAll: "form#form",
    gobalListeners: { // actions
        listBtnQSelector: "button#list-btn",
        searchBtnQSelector: "button#search-btn",
        searchInputQselector: "input#search-r-input",
        updateBtnQSelectorAll: "button#update-btn",
        deleteBtnQSelectorAll: "button#delete-btn",
        updateClickEvent: handleUpdateBttnClickEvent,
    }
}

const tableManager = new GenericTable(qSelectorInitializer);
tableManager.tableSetUp($currentTable);
tableManager.tableNavegation();

function handleUpdateBttnClickEvent() {
    const updateRegisterForm = document.querySelector("div.form-container.update"); // update form
    updateRegisterForm.classList.add('js-display-update_box');
}
