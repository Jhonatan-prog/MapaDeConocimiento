import { FetchHandler } from "../services/controller.js";

const APIFetcher = new FetchHandler('http://localhost:5172');

function addCustomAttributeIfMissing() {
    const allNodes = document.querySelectorAll('table#registers-table *');
    allNodes.forEach(node => {
        if (!node.hasAttribute('b-ga0mknigks')) {
            node.setAttribute('b-ga0mknigks', '');
        }
    });
}

// Templates/Events
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

// Queries
async function tableSetUp() {
    // Table set-up
    const $currentTable = DOM.querySelector('#registers-table');
    const tableName = $currentTable.getAttribute('table-name');
    
    const $thead = $currentTable.children[0];
    const $tbody = $currentTable.children[1];

    const registersList = await APIFetcher.listDataAsync(tableName);

    // element for thead
    const $trFields = document.createElement("tr");
    $trFields.setAttribute("b-ga0mknigks", "")
    // form
    const formList = document.querySelectorAll("#form");

    // Inserting fields
    for (let i = 0; i < Object.keys(registersList[0]).length; i++) { // just one iteration
        const $field = document.createElement('th');
        const fieldName = Object.keys(registersList[0])[i];
        $field.setAttribute("b-ga0mknigks", "")
        $field.textContent = fieldName;

        formList.forEach(($tableForm) => {
            const $fmLabel = document.createElement("label");
            $fmLabel.textContent = fieldName;
            $fmLabel.setAttribute("b-ga0mknigks", "")
            $fmLabel.setAttribute("for", `${fieldName}`)
    
            const $fmInput = document.createElement("input");
            $fmInput.setAttribute("b-ga0mknigks", "")
            $fmInput.setAttribute("id", `${fieldName}`)
            $fmInput.setAttribute("name", `${fieldName}`)

            $tableForm.appendChild($fmLabel);
            $tableForm.appendChild($fmInput);
        })

        $trFields.appendChild($field);

    }
    const $manage = document.createElement('th')
    $manage.setAttribute("b-ga0mknigks", "")
    $manage.textContent = 'manage'
    $trFields.appendChild($manage)

    $thead.appendChild($trFields);

    // List
    const listBtn = DOM.getElementById("list-btn");
    listBtn.addEventListener('click', async (e) => {
        if (!$currentTable) return console.error('Table with ID "registers-table" not found');

        console.log(tableName)
    
        if ($currentTable instanceof HTMLElement) {
            // Inserting rows
            for (const rgIndex in registersList) { // N iterations
                const $trRows = document.createElement("tr");
                $trRows.setAttribute("b-ga0mknigks", "")
    
                for (const fieldName in registersList[rgIndex]) {
                    const $row = document.createElement('td');
                    $row.textContent = registersList[rgIndex][fieldName]
    
                    $trRows.appendChild($row);
                }
    
                // Btn container
                const $btnContainer = document.createElement('td');
                $btnContainer.classList.add('updt_del_buttons');
                $btnContainer.setAttribute("b-ga0mknigks", "")
                $btnContainer.innerHTML = 
                `
                    <button b-ga0mknigks>
                        <img b-ga0mknigks 
                            src="http://localhost:5172/images/edit.png?v=Nk0M8wP0cUWE2c0L4pO9POeS_F183_Nf7peLeYckGhA" 
                            id="update-btn" 
                            alt="edit" 
                            asp-append-version="true">
                    </button>
                    <button b-ga0mknigks>
                        <img 
                            b-ga0mknigks 
                            src="http://localhost:5172/images/delete.png?v=jWBWN2RohiH7VI1suoVsW1KwMwJB2vFKALgw1_At2sY" 
                            id="delete-btn" 
                            alt="delete" 
                            asp-append-version="true">
                    </button>
                `
    
                $trRows.appendChild($btnContainer);
                $tbody.appendChild($trRows);
            }

            // UPDATE
            const updateBtns = DOM.querySelectorAll("#update-btn");
            updateBtns.forEach(updateBtn => {
                updateBtn.addEventListener('click', () => {
                    updateRegisterForm.classList.add('js-display-update_box')
                });
            });
        
            // DELETE
            const deleteBtns = DOM.querySelectorAll("#delete-btn");
            deleteBtns.forEach(deleteBtn => {
                deleteBtn.addEventListener('click', async (e) => {
                    const register = e.currentTarget.parentNode.parentNode.parentNode.firstChild
                    const id = register.textContent

                    await APIFetcher.deleteDataAsync(id, tableName)
                })
            });

            addCustomAttributeIfMissing();
        } else {
            console.error('currentTable is not a valid HTMLElement:', $currentTable);
        }
    }, { once: true });
    
    // GET
    const searchBtn = DOM.getElementById("search-btn");
    searchBtn.addEventListener('click', async () => {
        const id = DOM.getElementById("search-r-input").value;
        const registers = await APIFetcher.getDataByKeyAsync(id, tableName);
    
        // Inserting rows
        for (const rgIndex in registers) { // N iterations
            const $trRows = document.createElement("tr");
            $trRows.setAttribute("b-ga0mknigks", "")
    
            for (const fieldName in registers[rgIndex]) {
                const $row = document.createElement('td');
                $row.textContent = registers[rgIndex][fieldName]
    
                $trRows.appendChild($row);
            }
    
            // Btn container
            const $btnContainer = document.createElement('td');
            $btnContainer.classList.add('updt_del_buttons');
            $btnContainer.setAttribute("b-ga0mknigks", "")
            $btnContainer.innerHTML = 
            `
                <button b-ga0mknigks id="update-btn">
                    <img b-ga0mknigks 
                        src="http://localhost:5172/images/edit.png?v=Nk0M8wP0cUWE2c0L4pO9POeS_F183_Nf7peLeYckGhA" 
                        alt="edit" 
                        asp-append-version="true">
                </button>
                <button b-ga0mknigks id="delete-btn">
                    <img 
                        b-ga0mknigks 
                        src="http://localhost:5172/images/delete.png?v=jWBWN2RohiH7VI1suoVsW1KwMwJB2vFKALgw1_At2sY" 
                        alt="delete" 
                        asp-append-version="true">
                </button>
            `
    
            $trRows.appendChild($btnContainer);
            $tbody.appendChild($trRows);
        }
    
        
        addCustomAttributeIfMissing();
        // UPDATE
        const updateBtns = DOM.querySelectorAll("#update-btn");
        updateBtns.forEach(updateBtn => {
            updateBtn.addEventListener('click', () => {
                updateRegisterForm.classList.add('js-display-update_box')
            });
        });
    
        // DELETE
        const deleteBtns = DOM.querySelectorAll("#delete-btn");
        deleteBtns.forEach(deleteBtn => {
            deleteBtn.addEventListener('click', async (e) => {
                const register = e.currentTarget.parentNode.parentNode.firstChild
                const id = register.textContent
                await APIFetcher.deleteDataAsync(id, tableName)
            })
        });
    })

    // submitting
    formList.forEach($form => {
        const type = $form.getAttribute("type");
        
        if (type === "post") {
            $form.addEventListener('submit', async (e) => {
                e.preventDefault();
    
                const inputsObj = $form.querySelectorAll("div.create form#form input");
                const formData = {};
    
                inputsObj.forEach($input => {
                    const fieldName = $input.getAttribute('name');
                    if (fieldName === '__RequestVerificationToken'|| fieldName === null) return;
                    formData[fieldName] = $input.value;
                });

                const jsonResponse = await APIFetcher.postDataAsync(tableName, formData);
            });
        } else {
            $form.addEventListener('submit', async (e) => {
                e.preventDefault();
    
                const inputsObj = $form.querySelectorAll("div.update form#form input");
                const updatedData = {};

                let key = null;
    
                inputsObj.forEach($input => {
                    const fieldName = $input.getAttribute('name');
                    console.log(fieldName)
                    if (fieldName === "id") {
                        key = $input.value;
                        return;
                    } else if (fieldName === '__RequestVerificationToken'|| fieldName === null) {
                        return
                    } else {
                        updatedData[fieldName] = $input.value;
                    };
                });

                const jsonResponse = await APIFetcher.updateDataAsync(key, tableName, updatedData);
            });
        }
    });
}

const tablesNav = document.querySelectorAll("div.table-pages button");
tablesNav.forEach($button => {
    $button.addEventListener('click', (e) => {
        const table_name = e.target.getAttribute('table-name');
        const $currentTable = DOM.querySelector('#registers-table');
        $currentTable.setAttribute('table-name', table_name);

        tableSetUp();
    })
}) 
