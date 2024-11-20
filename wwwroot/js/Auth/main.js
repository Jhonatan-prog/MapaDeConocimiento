import { TableApiEvents } from "../utils/Generic/Frontend.js";
import { Cookie } from "../utils/cookies.js";

class AuthenticationHandler extends TableApiEvents {
    constructor(backendAPIUrl, elementQSelectorObj) {
        super(backendAPIUrl, elementQSelectorObj);

        this.cookie = new Cookie();
    }

    login($loginForm = null) {
        try {
            const $login = !$loginForm 
                ? document.querySelector(this.elementQSelectorObj["Form"]["LoginFormQSelector"])
                : $login

            if (!$login) {
                throw new Error("Form element was not found in DOM");
            }

            this.addEvent($login, 'submit', async (e) => {
                e.preventDefault();

                const userEmail = document.querySelector('input[name="email"]');
                const userPassword = document.querySelector('input[name="password"]');

                const credentialsObj = {
                    userField: "email",
                    passwordField: "contrasena",
                    userValue: userEmail.value, // default@gmail.com
                    passwordValue: userPassword.value // 123
                }

                const validCredentials = await this.verifyCredentials("usuario", credentialsObj)
                if (!validCredentials) {
                    this.handleError({"ok": validCredentials}, "The credentials are not valid.")
                    userEmail.addEventListener('click', () => {
                        userEmail.classList.remove("not-valid")
                        userPassword.classList.remove("not-valid")
                    })
                    userPassword.addEventListener('click', () => {
                        userPassword.classList.remove("not-valid")
                        userEmail.classList.remove("not-valid")
                    })

                    userEmail.classList.add("not-valid")
                    userPassword.classList.add("not-valid")

                    userPassword.value = "";

                    return void 0;
                }

                // login user
                const token = await this.authenticate({ Email: userEmail.value })
                this.cookie.setCookie("token", token, {
                    exdays: 2
                })

                window.location.replace("http://localhost:5172/index") // redirect to home page
            })
        } catch (error) {
            console.error(error)
        }
    }

    async signUp($signUpForm = null) {
        try {
            const $signUp = !$signUpForm 
                ? document.querySelector(this.elementQSelectorObj["Form"]["signUpFormQSelector"])
                : $signUpForm

            if (!$signUp) {
                throw new Error("Form element was not found in DOM");
            }

            this.addEvent($signUp, 'submit', async (e) => {
                e.preventDefault();

                const userEmail = document.querySelector('input[name="email"]');
                const userPassword = document.querySelector('input[name="password"]');
                const passwordConfirmation = document.querySelector('input[name="password-confirmation"]');

                // validateData
                // if not valid print data not valid

                const postResponse = await this.postRegister('usuario', {
                    email: userEmail.value,
                    contrasena: userPassword.value
                });

                if (!postResponse.ok) {
                    this.handleError({"ok": validCredentials}, "The credentials are not valid.")
                    userPassword.value = "";

                    return void 0;
                }

                window.location.replace("http://localhost:5172/login")
            })

        } catch (error) {
            console.error(error)
        }
    }

    validatePassword() {
        
    }

    realTimeDataValidation(data = {}) {

    }

    run() {
        const location = window.location.href;
        if (/sign-up/.test(location)) {
            this.signUp();
        } else if (/login/.test(location)) {
            this.login();
        }
    }
}

const $backBtn = document.querySelector("button.go-back")
$backBtn.addEventListener('click', () => {
    history.back();
})

const qAuthInitializer = {
    Form: {
        LoginFormQSelector: "form[name='login']",
        signUpFormQSelector: "form[name='sign-up']"
    }
}

const AuthHandler = new AuthenticationHandler('http://localhost:5172', qAuthInitializer);
AuthHandler.run()
