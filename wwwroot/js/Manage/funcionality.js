import { GenericTable } from "/js/utils/Generic/GenericTable.js";

// Forms Elements set-up
const newRegisterForm = document.querySelector("div.form-container.create");
const updateRegisterForm = document.querySelector("div.form-container.update");
if(newRegisterForm) {
    newRegisterForm.addEventListener('click', (e) => {
        if (e.target === newRegisterForm) {
            newRegisterForm.classList.remove('js-display-create_box')
        }
    
        e.stopPropagation();
    });
}

const createBtn = document.getElementById("create-btn");
if (createBtn) {
    createBtn.addEventListener('click', () => {
        newRegisterForm.classList.add('js-display-create_box')
    });
}

if (updateRegisterForm) {
    updateRegisterForm.addEventListener('click', (e) => {
        if (e.target === updateRegisterForm) {
            updateRegisterForm.classList.remove('js-display-update_box')
        }
    
        e.stopPropagation();
    });
}

// table qSelectorInitializer
const $currentTable = document.querySelector('table#registers-table');
const qSelectorInitializer = {
    tableNavQSelector: "div.table-pages",
    formParentQSelector: "div.form-container",
    formQSelectorAll: "form#form",
    paginator: {
        prevBtnQSelector: "div.pag button.prev",
        paginatorQSelector: "div.pag",
        pagesContainerQSelector: "div.pages-container",
        nextBtnQSelector: "div.pag button.next",
    },
    gobalListeners: {
        listBtnQSelector: "button#list-btn",
        searchBtnQSelector: "button#search-btn",
        searchInputQselector: "input#search-r-input",
        updateBtnQSelectorAll: "button#update-btn",
        deleteBtnQSelectorAll: "button#delete-btn",
        updateClickEvent: handleUpdateBttnClickEvent,
    }
}

const tableManager = new GenericTable('http://localhost:5172', qSelectorInitializer);
tableManager.tableSetUp($currentTable); // first initialization
tableManager.formSubmission(); // Set-up forms interactions
tableManager.tableNavegation(); // Set-up table navegator
tableManager.setGlobalListeners();

function handleUpdateBttnClickEvent() {
    const updateRegisterForm = document.querySelector("div.form-container.update"); // update form
    updateRegisterForm.classList.add('js-display-update_box');
}
