import Utils from "../utils.js";
import { FetchHandler } from "../../services/controller.js";

class GenericFront {
    constructor(baseUrl = 'http://localhost:5172') {
        this.APIConsumer = new FetchHandler(baseUrl);
        this.utils = new Utils();
    }

    standarize(chain) {

    }

    popUp(message) {
        const $popUpContainer = document.createElement("div");
        $popUpContainer.classList.add("pop-up");
        $popUpContainer.innerHTML = 
        `
            <p>${message}</p>
            <div>
                <button class="ok-btn" onclick="${clickHandler()}">Ok<button/>
            </div>
        `

        document.body.appendChild($popUpContainer);

        function clickHandler() {
            $popUpContainer.remove();
        }

        setTimeout(() => {
            if ($popUpContainer) {
                $popUpContainer.remove();
            }
        }, 1500)
    }

    addEvent(elementOrQSelector, type = 'click', CbEventListener = () => null, options = {}) {
        const $element = typeof elementOrQSelector === 'string' 
            ? document.querySelector(elementOrQSelector)
            : elementOrQSelector;

        if ($element instanceof HTMLElement) {
            $element.removeEventListener(type, CbEventListener, options);
            $element.addEventListener(type, CbEventListener, options);
        } else {
            console.error('Invalid element or selector:', elementOrQSelector);
        }
    }
}

class TableApiEvents extends GenericFront {
    constructor(backendAPIUrl) {
        super(backendAPIUrl);
    }

    async listRegisters(tableName) {
        const data = await this.APIConsumer.listDataAsync(tableName);
        return data;
    }

    async getRegisterByKey(tableName, pkColum, pk) {
        const data = await this.APIConsumer.getDataByKeyAsync(tableName, pkColum, pk);
        return data;
    }

    async postRegister(tableName, dataToPost) {
        const data = await this.APIConsumer.postDataAsync(tableName, dataToPost);
        return data;
    }

    async updateRegister(tableName, pkColum, pk, dataToUpdate) {
        const data = await this.APIConsumer.updateDataAsync(tableName, pkColum, pk, dataToUpdate);
        return data;
    }

    async deleteRegister(tableName, pkColum, pk) {
        const data = await this.APIConsumer.deleteDataAsync(tableName, pkColum, pk);
        return data;
    }
}

class GenericTable extends TableApiEvents {
    constructor(elementQSelectorObj, backendAPIUrl, table = null, tableName = "", tablePkColumn = "") {
        super(backendAPIUrl);

        this.postRegister = this.postRegister.bind(this);
        this.updateRegister = this.updateRegister.bind(this);
        this.handlePostSubmit = this.handlePostSubmit.bind(this);
        this.handlePutSubmit = this.handlePutSubmit.bind(this);

        this.table = table;
        this.tableName = tableName;
        this.tablePkColumn = tablePkColumn;
        this.elementQSelectorObj = elementQSelectorObj; // obj with all the QSelectors of each element (reference to each element)
        this.data = {}
        this.dataPage = {}
    }

    tableNavegation() {
        const tableNavBttns = document.querySelectorAll(
            this.elementQSelectorObj['tableNavQSelector'].trim() + " " + "button"
        );

        tableNavBttns.forEach($button => {
            this.addEvent($button, 'click', async (e) => {
                this.clearTable(null, true);

                const newTableName = e.target.getAttribute('table-name');
                this.setTableName(newTableName);

                const $table = this.table;
                $table.setAttribute('table-name', this.tableName);

                this.#clearPaginatorContaier();

                await this.tableSetUp();
            })
        })
    }

    generateForm() {
        const formList = document.querySelectorAll(this.elementQSelectorObj['formQSelectorAll']);
        const columns = Object.keys(this.dataPage[0]);
        formList.forEach(($form) => {
            for (let i = 0; i < columns.length; i++) {
                const $fmLabel = document.createElement("label");
                let fieldName = columns[i];
                $fmLabel.textContent = fieldName;
                $fmLabel.setAttribute("b-ga0mknigks", "")
                $fmLabel.setAttribute("for", `${fieldName}`)

                const $fmInput = document.createElement("input");
                $fmInput.setAttribute("b-ga0mknigks", "")
                $fmInput.setAttribute("id", `${fieldName}`)
                $fmInput.setAttribute("name", `${fieldName}`)

                $form.appendChild($fmLabel);
                $form.appendChild($fmInput);
            }
        })

        this.formSubmission(); // problem here, calling multiple times
    }

    generateHeader() {
        const $table = this.table;
        const $thead = $table.children[0];

        const $trFields = document.createElement("tr");
        $trFields.setAttribute("b-ga0mknigks", "")

        const columns = Object.keys(this.dataPage[0]);
        for (let i = 0; i < columns.length; i++) {
            const $field = document.createElement('th');
            const fieldName = columns[i];
            $field.setAttribute("b-ga0mknigks", "")
            $field.textContent = fieldName;

            $trFields.appendChild($field);
        }

        // Extra field
        const $manage = document.createElement('th')
        $manage.setAttribute("b-ga0mknigks", "")
        $manage.textContent = 'action'
        $trFields.appendChild($manage)

        $thead.appendChild($trFields);
    }

    generateRegisters(fullSearch = false) {
        const registerNodeList = fullSearch ? this.data : this.dataPage;

        for (const index in registerNodeList) { // 'n' iterations
            let register = registerNodeList[index];
            this.generateRegister(register);
        }

        this.setGlobalListeners();
    }

    generateRegister(register) { // 'registerObj' (register = obj -> {...}) each iteration is different
        const $table = this.table;
        const $tbody = $table.children[1];

        const $row = document.createElement("tr");
        $row.setAttribute("b-ga0mknigks", "")
        for (const fieldName in register) {
            const $field = document.createElement('td');
            $field.textContent = register[fieldName]; // Get value
            $row.appendChild($field);
        }

        // Buttons
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

        $row.appendChild($btnContainer);
        $tbody.appendChild($row);
    }

    async tableSetUp(DOMTable = null) {
        if (DOMTable) {
            this.table = DOMTable;
        }

        await this.setUpData();

        this.paginatorController();

        this.generateHeader();
        this.generateRegisters();
        this.generateForm();

        this.utils.addCustomAttributeIfMissing("div.table-container"); // solution to boostrap problem

        return this.table;
    }

    setGlobalListeners() {
        const gobalListenerObj = this.elementQSelectorObj['gobalListeners'];

        const listBtn = document.querySelector(gobalListenerObj['listBtnQSelector']);
        this.addEvent(listBtn, 'click', async () => {
            const query = await this.listRegisters(this.tableName);
            if (this.utils.isEqual(this.dataPage, query)) return;

            this.setDataPageQueried(query);

            this.clearTable();

            this.generateRegisters();
        });

        const searchBtn = document.querySelector(gobalListenerObj['searchBtnQSelector']);
        this.addEvent(searchBtn, 'click', async () => {
            const pk = document.querySelector(gobalListenerObj['searchInputQselector']).value;
            console.log(pk)
            const query = await this.getRegisterByKey(this.tableName, this.tablePkColumn, pk);
            if (this.utils.isEqual(this.dataPage, query)) return;

            this.setDataQueried(query);

            this.clearTable();

            this.generateRegisters(true);
        });

        const updateBtns = document.querySelectorAll(gobalListenerObj['updateBtnQSelectorAll']);
        updateBtns.forEach($updateBttn => {
            this.addEvent($updateBttn, 'click', gobalListenerObj['updateClickEvent']);
        });

        const deleteBtns = document.querySelectorAll(gobalListenerObj['deleteBtnQSelectorAll']);
        deleteBtns.forEach($deleteBttn => {
            this.addEvent($deleteBttn, 'click', async (e) => {
                const register = e.currentTarget.parentNode.parentNode.firstChild; // change way of tracking pk
                const pk = register.textContent;

                const success = await this.deleteRegister(this.tableName, this.tablePkColumn, pk);

                if (!success) {
                    return;
                }

                const registers = await this.listRegisters(this.tableName);

                this.setDataPageQueried(registers);

                this.clearTable();

                this.generateRegisters();
            });
        });
    }

    setTableName(newTableName) {
        this.tableName = newTableName;
    }

    setTablePkColumn(pkColumType) {
        this.tablePkColumn = pkColumType
    }

    setDataQueried(newData) {
        this.data = newData;
    }

    setDataPageQueried(newData) {
        this.dataPage = newData;
    } 

    async setUpData() {
        const tableName = this.table.getAttribute("table-name");
        this.setTableName(tableName);

        const data = await this.listRegisters(this.tableName);
        this.setTablePkColumn(Object.keys(data[0])[0])
        this.setDataQueried(data);
    }

    clearTable(tableQSelector = null, tableChange = false) {
        const $currentTable = document.querySelector(tableQSelector) 
            ? !tableQSelector 
            : this.table;
        const $thead = $currentTable.firstElementChild;
        const $tbody = $currentTable.lastElementChild;

        if (!$thead.children.length && !$tbody.children.length) return;

        if (tableChange) {
            $thead.firstElementChild.remove();
            const theadTr = $thead.children;
            for (let i = theadTr.length - 1; i >= 0; i--) {
                $tbody.removeChild(bodyTr[i]);
            }

            this.clearForm();
        }

        const bodyTr = $tbody.children;
        for (let i = bodyTr.length - 1; i >= 0; i--) {
            $tbody.removeChild(bodyTr[i]);
        }
    }

    formSubmission() {
        const formList = document.querySelectorAll(this.elementQSelectorObj['formQSelectorAll']);
        formList.forEach($form => {
            const type = $form.getAttribute("type").trim().toLowerCase(); // make more generic (change type)

            const handler = type === "post" ? this.handlePostSubmit :  this.handlePutSubmit;
            this.addEvent($form, 'submit', handler.bind(this));
        })
    }

    async handlePostSubmit(event) {
        event.preventDefault();

        const inputNodeList = document.querySelectorAll('[type="post"]' + " " + "input");
        const data = {}

        inputNodeList.forEach($input => {
            const fieldName = $input.getAttribute('name');
            if (fieldName === '__RequestVerificationToken'|| fieldName === null) return;
            data[fieldName] = $input.value;
        });

        const postResponse = await this.postRegister(this.tableName, data);

        if (!postResponse.ok) {
            const message = `An error ocurred while saving new register in ${this.tableName}.`
            this.popUp(message);
            return
        }

        const registers = await this.listRegisters(this.tableName);

        this.setDataQueried(registers);

        this.clearTable();

        this.generateRegisters(true);

        const message = `Register added successfully in ${this.tableName}.`
        this.popUp(message);
    }

    async handlePutSubmit(event) {
        event.preventDefault();

        const inputNodeList = document.querySelectorAll('[type="update"]' + " " + "input");
        const updatedData = {}

        let pk = null;
        inputNodeList.forEach($input => {
            const fieldName = $input.getAttribute('name');
            if (fieldName === this.tablePkColumn) {
                pk = $input.value;
                return;
            } else if (fieldName === '__RequestVerificationToken'|| fieldName === null) {
                return
            } else {
                updatedData[fieldName] = $input.value;
            };
        });

        const updateResponse = await this.updateRegister(this.tableName, this.tablePkColumn, pk, updatedData);

        if (!updateResponse.ok) {
            const message = `An error ocurred while updating register in ${this.tableName}.`
            this.popUp(message);
            return
        }

        const registers = await this.listRegisters(this.tableName);

        this.setDataQueried(registers);

        this.clearTable();

        this.generateRegisters(true);

        const message = `Register updated successfully in ${this.tableName}.`
        this.popUp(message);
    }

    clearForm() {
        const formList = document.querySelectorAll(this.elementQSelectorObj['formQSelectorAll']);
        formList.forEach($form => {
            const inputList = $form.querySelectorAll("input");
            for (let i = 0; i < inputList.length; i++) {
                if (!inputList[i].getAttribute('id')) continue;

                const label = inputList[i].previousElementSibling;
                $form.removeChild(label);
                $form.removeChild(inputList[i]);
            }
        })
    }

    paginatorController(tableLength = 2) {
        this.currentPaginatorPage = null;

        let dataStart = 0;
        let dataEnd = tableLength;

        const paginatorObj = this.elementQSelectorObj['paginator'];

        const $paginator = document.querySelector(paginatorObj['paginatorQSelector']);
        const range = this.data.length - 0;

        // Initial set-up
        if (!range) {
            $paginator.remove();
            return;
        };

        this.dataPage = this.data.slice(dataStart, dataEnd); // Default page

        let buttonQuantity = Math.ceil(range / tableLength);
        for (let i = 0; i < buttonQuantity; i++) {
            const $button = document.createElement("button");
            $button.classList = `list`;
            $button.setAttribute('page', i)
            $button.textContent = `${i + 1}`;

            if (i === 0) {
                $button.classList.add("focus");
                this.currentPaginatorPage = $button; // set first btn as default
            };

            this.addEvent($button, 'click', (e) => {
                this.currentPaginatorPage.classList.remove("focus");

                e.target.classList.add("focus");
                const currentPage = parseInt(this.currentPaginatorPage.getAttribute('page'), 10);
                const targetPage = parseInt(e.target.getAttribute('page'), 10);

                const difference = Math.abs(currentPage - targetPage);
                if (difference === 0) return;

                const jump = tableLength * difference;
                if (targetPage > currentPage) {
                    dataStart +=  jump;
                    dataEnd +=  jump;
                } else if (targetPage < currentPage) {
                    dataStart -= jump;
                    dataEnd -= jump;
                }

                this.currentPaginatorPage = $button;
                this.dataPage = this.data.slice(dataStart, dataEnd);

                this.clearTable();

                this.generateRegisters();
            })

            $paginator.querySelector(paginatorObj['pagesContainerQSelector']).appendChild($button);
        }

    }

    #clearPaginatorContaier() {
        const paginatorObj = this.elementQSelectorObj['paginator'];
        const $paginator = document.querySelector(paginatorObj['paginatorQSelector']);
        const $divBtnContainer = $paginator
            .querySelectorAll(
                paginatorObj['pagesContainerQSelector'].trim() + " " + "button"
            )

        $divBtnContainer.forEach($button => {
            $button.remove();
        });
    };
}

export { GenericTable, TableApiEvents, GenericFront };
