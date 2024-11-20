import Utils from "../utils.js";
import { FetchHandler } from "../../services/controller.js";

/**
 * Class representing a generic front-end handler for API interactions.
 */
class GenericFront {
    /**
     * Creates an instance of GenericFront.
     * @param {string} [baseUrl='http://localhost:5172'] - The base URL for API requests.
     */
    constructor(baseUrl = 'http://localhost:5172', elementQSelectorObj = {}) {
        this.elementQSelectorObj = elementQSelectorObj; // obj with all the QSelectors of each element (reference to each element in DOM)
        this.APIConsumer = new FetchHandler(baseUrl);
        this.utils = new Utils();
    }

    /**
     * Standardizes a string by trimming whitespace.
     * @param {string} string - The string to be standardized.
     * @returns {string} The standardized string.
     */
    standarize(string) {
        string = string.trim()
        let standarizedString = string.charAt(0).toUpperCase();
        for (let i = 1; i < string.length; i++) {
            let ch = string[i];

            if (['_', '-'].includes(ch)) {
                standarizedString += " ";
                continue
            } else if (['/', '*', '+'].includes(ch)) {
                standarizedString += "";
                continue
            }

            standarizedString += ch
        }

        return standarizedString;
    }

    /**
     * Handles the error response from an API request.
     * @param {Response} response - The response object from the fetch request.
     * @returns {boolean} True if the response is OK, otherwise false.
     */
    handleError(response, message = `An error occurred while updating the register in ${this.tableName}`) {
        if (!response.ok) {
            this.popUp(message);
            return false;
        }

        return true;
    }

    /**
     * Displays a popup message on the screen.
     * @param {string} message - The message to be displayed in the popup.
     */
    popUp(message) {
        const $popUpContainer = document.createElement("div");
        $popUpContainer.classList.add("pop-up");
        $popUpContainer.setAttribute('b-ga0mknigks', '')
        $popUpContainer.innerHTML = 
        `
            <p>${message}</p>
            <hr/>
            <button class="close-btn" onclick="clickHandler()">close</button>
        `
        const $closeBtn = $popUpContainer.querySelector('button');
        $closeBtn.onclick = clickHandler

        function clickHandler() {
            $popUpContainer.remove();
        }

        document.body.appendChild($popUpContainer);

        setTimeout(() => {
            if ($popUpContainer) {
                $popUpContainer.remove();
            }
        }, 3000)
    }

    /**
     * Adds an event listener to a specified element.
     * @param {HTMLElement|string} elementOrQSelector - The element or CSS selector for the element to attach the event to.
     * @param {string} [type='click'] - The type of event to listen for (e.g., 'click', 'submit').
     * @param {Function} [CbEventListener=() => null] - The callback function to execute when the event occurs.
     * @param {AddEventListenerOptions} [options={}] - Options for the event listener.
     */
    addEvent(elementOrQSelector, type = 'click', CbEventListener = () => null, options = {}) {
        const $element = typeof elementOrQSelector === 'string' 
            ? document.querySelector(elementOrQSelector)
            : elementOrQSelector;

        if (!$element) {
            $element = document.createElement('div');
        }

        if ($element instanceof HTMLElement) {
            $element.removeEventListener(type, CbEventListener, options);
            $element.addEventListener(type, CbEventListener, options);
        } else {
            console.error('Invalid element or selector:', elementOrQSelector);
        }
    }
}

class TableApiEvents extends GenericFront {
    constructor(backendAPIUrl, elementQSelectorObj) {
        super(backendAPIUrl, elementQSelectorObj);
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
        const response = await this.APIConsumer.postDataAsync(tableName, dataToPost);
        return response;
    }

    async updateRegister(tableName, pkColum, pk, dataToUpdate) {
        const data = await this.APIConsumer.updateDataAsync(tableName, pkColum, pk, dataToUpdate);
        return data;
    }

    async deleteRegister(tableName, pkColum, pk) {
        const data = await this.APIConsumer.deleteDataAsync(tableName, pkColum, pk);
        return data;
    }

    async verifyCredentials(tableName, credentials) {
        const isValid = await this.APIConsumer.verifyCredentialsAsync(tableName, credentials);
        return isValid;
    }

    async authenticate(credentials) {
        const jsonToken = await this.APIConsumer.loginAsync(credentials);
        return jsonToken["token"];
    }

    async parameterizedQuery(bodyObj) {
        const data = await this.APIConsumer.parameterizedQueryAsync(bodyObj);
        return data;
    }

    async getUserRole(id) {
        const userRole = [];

        const SQLScript = {
            "consulta": `
                IF EXISTS (SELECT 1 FROM rol_usuario WHERE fkemail = @Email)
                SELECT r.nombre
                FROM usuario u
                JOIN rol_usuario ru ON u.email = ru.fkemail
                JOIN rol r ON ru.fkidrol = r.id
                WHERE u.email = @Email;
            `,
            "parametros": {
                'Email': id,
            }
        }

        const response = await this.parameterizedQuery(SQLScript);
        if (!response.ok) {
            return null
        }

        const role = await response.json()
        for (let i = 0; i < role.length; i++) {
            userRole.push(role[i]['nombre'])
        }

        return userRole
    }
}

export { GenericFront, TableApiEvents};
