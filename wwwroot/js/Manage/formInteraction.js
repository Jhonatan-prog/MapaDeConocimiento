import { FetchHandler } from "../services/controller.js";

const APIFetcher = new FetchHandler('http://localhost:5172/');

// Templates
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

// Queries
const listBtn = DOM.getElementById("list-btn");

listBtn.addEventListener('click', async (e) => {
    const currentTable = DOM.querySelector('registers-table');

    if (currentTable) {
        if (currentTable instanceof HTMLElement) {
            const tableName = currentTable.getAttribute('table-name');
            console.log(tableName); // Should output "proyecto"

            // Uncomment the following line when APIFetcher is defined
            // const registersList = await APIFetcher.listDataAsync(tableName);
            // console.log(registersList);
        } else {
            console.error('currentTable is not a valid HTMLElement:', currentTable);
        }
    } else {
        console.error('Table with ID "registers-table" not found');
    }
});

