import { GenericFront } from "./Frontend.js";

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

    async parameterizedQuery(bodyObj) {
        const data = await this.APIConsumer.parameterizedQueryAsync(bodyObj);
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
        this.elementQSelectorObj = elementQSelectorObj; // obj with all the QSelectors of each element (reference to each element in DOM)
        this.data = {}
        this.dataPage = {}

        // change logic (static)
        this.tableRelations = { // hardcoded
            proyecto: [
                'ac_proyecto', 'desarrolla', 
                'aliado_proyecto', 'aa_proyecto', 
                'ods_proyecto', 'proyecto_linea',
                /* 'palabras_clave', fix for this one*/ 'producto'
            ],
            producto: [
                'docente_producto'
            ],
            tipo_producto: [
                'producto'
            ]
        }
    }

    tableNavegation() {
        const tableNavBttns = document.querySelectorAll(
            this.elementQSelectorObj['tableNavQSelector'].trim() + " " + "button"
        );

        tableNavBttns.forEach($button => {
            this.addEvent($button, 'click', async (e) => {
                const newTableName = e.target.getAttribute('table-name');
                if (newTableName === this.tableName) return

                this.clearTable(null, true);
                this.setTableName(newTableName);

                const $table = this.table;
                $table.setAttribute('table-name', this.tableName);

                await this.tableSetUp();
            })
        })
    }

    generateForm() {
        const formList = document.querySelectorAll(this.elementQSelectorObj['formQSelectorAll']);
        const columns = Object.keys(this.dataPage[0] /* first Obj as reference */ );
        formList.forEach(($form) => {
            const formType = $form.getAttribute("type");
            if (formType === 'update') {
                const $pkInput = document.createElement("input");
                $pkInput.classList.add("hidden-pk");
                $pkInput.setAttribute("type", "hidden");
                $pkInput.setAttribute("pk-column", columns[0]);

                $form.appendChild($pkInput);
            }

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
    }

    generateHeader() {
        const $table = this.table;
        const $thead = $table.children[0];

        const $trFields = document.createElement("tr");
        $trFields.setAttribute("b-ga0mknigks", "")

        const columns = Object.keys(this.dataPage[0]);
        for (let i = 0; i < columns.length; i++) {
            const $field = document.createElement('th');
            const fieldName = this.standarize(columns[i]);
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
        $row.setAttribute("data-pk-value", register[this.tablePkColumn]);

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
            <div class="updt_del_buttons">
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
            </div>
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
            this.paginatorController();

            this.generateRegisters();
        });

        const searchBtn = document.querySelector(gobalListenerObj['searchBtnQSelector']); // full search (add onchange)
        this.addEvent(searchBtn, 'click', async () => {
            const pk = document.querySelector(gobalListenerObj['searchInputQselector']).value;

            const query = 
                this.utils.filterObject(this.data, this.tablePkColumn, {
                    objList: this.dataPage, 
                    field: this.tablePkColumn, 
                    reference: !isNaN(pk) ? parseInt(pk, 10) : pk
                });

            if (!query) { // improve
                const $container = document.createElement('div');
                $container.textContent = 'The data you are looking for was not found.'

                this.table.after($container)
                return void(0);
            }

            if (this.utils.isEqual(this.dataPage, query)) return;

            this.setDataPageQueried(query);

            this.clearTable();

            if (Object.keys(query).length === 1) {
                this.generateRegister(query[0]);
                this.setGlobalListeners(); // setting up event listeners multiple times
                return void (0);
            }

            this.generateRegisters();
        });

        const updateBtns = document.querySelectorAll(gobalListenerObj['updateBtnQSelectorAll']);
        updateBtns.forEach($updateBttn => {
            this.addEvent($updateBttn, 'click', async (e) => {
                const $register = e.target.closest('tr');
                const pkValue = $register.getAttribute('data-pk-value')

                const pk = !isNaN(pkValue)
                    ? parseInt(pkValue, 10) 
                    : pkValue;


                const $hiddenInput = document.querySelector('input.hidden-pk');
                $hiddenInput.setAttribute("pk-value", pk)

                const currentRegister =
                    this.utils.filterObject({
                        objList: this.dataPage, 
                        field: this.tablePkColumn, 
                        reference: pk
                    })[0];
                const columns = Object.keys(currentRegister);

                const $updateForm = document.querySelector('[type="update"]'); // harcoded -> type="update"
                let count = 0;
                $updateForm.querySelectorAll('input')
                    .forEach(($input) => {
                        const ignore = ['__RequestVerificationToken', null];
                        if (
                            ignore.includes($input.getAttribute('name')) 
                            || $input.getAttribute('type') === 'submit'
                        ) return;

                        $input.value = currentRegister[columns[count]]

                        count += 1
                    })
            });
            this.addEvent($updateBttn, 'click', gobalListenerObj['updateClickEvent']);
        });

        const deleteBtns = document.querySelectorAll(gobalListenerObj['deleteBtnQSelectorAll']);
        deleteBtns.forEach($deleteBttn => {
            this.addEvent($deleteBttn, 'click', async (e) => {
                const $register = e.target.closest('tr');
                const pkValue = $register.getAttribute('data-pk-value');
                const pk = !isNaN(pkValue)
                    ? parseInt(pkValue, 10) 
                    : pkValue;

                // remove relations
                if (Object.keys(this.tableRelations).includes(this.tableName)) {
                    const tableRelation = this.tableRelations[this.tableName];
                    for (let i = 0; i < tableRelation.length; i++) {
                        const table = tableRelation[i];
                        const column = this.tableName;
    
                        const SQLScript = {
                            "consulta": `
                                IF EXISTS (SELECT 1 FROM ${table} WHERE ${column} = @Codigo)
                                BEGIN
                                    DELETE FROM ${table} 
                                    WHERE ${column} = @Codigo 
                                END
    
                                SELECT * FROM proyecto;
                            `,
                            "parametros": {
                                'Codigo': pk
                            }
                        }
    
                        await this.parameterizedQuery(SQLScript);
                    }
                }

                // remove target
                const ok = await this.deleteRegister(this.tableName, this.tablePkColumn, pk);

                if (!ok) {
                    return;
                }
                
                const deleteObjParams = {
                    field: this.tablePkColumn, 
                    reference: pk,
                    getDetails: true
                }

                const objRegisterFD = this.utils.filterObject({  objList: this.data, ...deleteObjParams });
                const objRegisterFDP = this.utils.filterObject({  objList: this.dataPage, ...deleteObjParams });

                $register.remove();

                delete this.data[objRegisterFD['index']];
                delete this.dataPage[objRegisterFDP['index']];

                if (Object.keys(this.dataPage).length === 0) {
                    this.paginatorController();
                }
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
        const pkName = Object.keys(data[0])[0];
        // not working with full db
        const excludedFks = ["docente", "area_conocimiento", "aliado", "area_aplicacion", "ods", "linea_investigacion"];

        excludedFks.includes(pkName.trim()) || pkName.trim() === 'palabras_clave'
            ? this.setTablePkColumn(Object.keys(data[0])[1])
            : this.setTablePkColumn(Object.keys(data[0])[0]);

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
        const register = {}

        inputNodeList.forEach($input => {
            const fieldName = $input.getAttribute('name');
            if (fieldName === '__RequestVerificationToken'|| fieldName === null) return;
            register[fieldName] = $input.value;
        });

        const postResponse = await this.postRegister(this.tableName, register);

        if (!postResponse.ok) {
            const message = `An error ocurred while saving new register in ${this.tableName}.`
            this.popUp(message);
            return
        }

        const tableSize = this.data.length;
        this.data[tableSize] = register

        const message = `Register added successfully into ${this.standarize(this.tableName)}.`
        this.popUp(message);

        if (Object.keys(this.dataPage).length < this.paginatorMaxLength) {
            this.dataPage = { ...this.dataPage, register };
            this.generateRegister(register);

            return void 0;
        }

        this.paginatorController();
    }

    async handlePutSubmit(event) {
        event.preventDefault();

        const inputNodeList = document.querySelectorAll('[type="update"]' + " " + "input");
        const updatedData = {}

        const $hiddenInput = document.querySelector('input.hidden-pk');
        const pk = $hiddenInput.getAttribute('pk-value');

        inputNodeList.forEach($input => {
            const fieldName = $input.getAttribute('name');
            if (fieldName === '__RequestVerificationToken'|| fieldName === null) {
                return
            }
            updatedData[fieldName] = $input.value;
        });

        const updateResponse = await this.updateRegister(this.tableName, this.tablePkColumn, pk, updatedData);

        if (!updateResponse.ok) {
            const message = `An error ocurred while updating register in ${this.tableName}.`
            this.popUp(message);
            return
        }

        const objParams = {
            field: this.tablePkColumn, 
            reference: pk,
            getDetails: true
        }

        // organize
        const objRegisterFD = this.utils.filterObject({  objList: this.data, ...objParams });
        const objRegisterFDP = this.utils.filterObject({  objList: this.dataPage, ...objParams });

        this.data[objRegisterFD['index']] = updatedData;
        this.dataPage[objRegisterFDP['index']] = updatedData;

        this.clearTable();

        this.generateRegisters();

        const formParentQSelector = this.elementQSelectorObj['formParentQSelector'];
        if (formParentQSelector) {
            const $formParent = document.querySelector(formParentQSelector + " " + "js-display-update_box");
            console.log($formParent)
            // $formNodes.forEach($form => {
            //     console.log($form)
            //     $form.classList.remove('js-display-update_box')
            //     console.log($form)
            // })
        }

        const message = `Register updated successfully in ${this.standarize(this.tableName)}.`
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

    paginatorController(tableLength = 3) {
        this.#clearPaginatorContaier();
        this.paginatorMaxLength = tableLength;
        this.currentPaginatorPage = null;

        let dataStart = 0;
        let dataEnd = this.paginatorMaxLength;

        const paginatorObj = this.elementQSelectorObj['paginator'];

        const $paginator = document.querySelector(paginatorObj['paginatorQSelector']);
        const range = this.data.length - 0;

        // Initial set-up
        if (!range) {
            $paginator.remove();
            return;
        };

        const handleSlicedData = () => {
            this.dataPage = this.data.slice(dataStart, dataEnd);

            this.clearTable();

            this.generateRegisters();
        }

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
                handleSlicedData();
            })

            const [ pevBtn, nextBtn ] = [
                $paginator.querySelector(paginatorObj['prevBtnQSelector']),
                $paginator.querySelector(paginatorObj['nextBtnQSelector'])
            ]

            this.addEvent(pevBtn, 'click', () => {
                dataStart -= tableLength;
                dataEnd -= tableLength;
                handleSlicedData();
            });

            this.addEvent(nextBtn, 'click', () => {
                dataStart += tableLength;
                dataEnd += tableLength;
                handleSlicedData();
            });

            $paginator.querySelector(paginatorObj['pagesContainerQSelector']).appendChild($button);
        }

        this.utils.addCustomAttributeIfMissing(paginatorObj['pagesContainerQSelector']); // solution to boostrap problem

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

export { TableApiEvents, GenericTable };
