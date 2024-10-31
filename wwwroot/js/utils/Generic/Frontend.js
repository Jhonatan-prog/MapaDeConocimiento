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
    constructor(baseUrl = 'http://localhost:5172') {
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
    handleError(response) { // change handleError to handleResponse
        if (!response.ok) {
            const message = `An error occurred while updating the register in ${this.tableName}.`;
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
            <button class="ok-btn" onclick="${clickHandler()}">close</button>
        `

        document.body.appendChild($popUpContainer);

        function clickHandler() {
            $popUpContainer.remove();
        }

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

        if ($element instanceof HTMLElement) {
            $element.removeEventListener(type, CbEventListener, options);
            $element.addEventListener(type, CbEventListener, options);
        } else {
            console.error('Invalid element or selector:', elementOrQSelector);
        }
    }
}

export { GenericFront};
