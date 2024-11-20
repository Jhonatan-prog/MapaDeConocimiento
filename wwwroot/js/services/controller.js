import { Cookie } from "../utils/cookies.js";

class FetchHandler {
    constructor(baseUrl = "", tableName = "") {
        this.baseUrl = baseUrl;
        this.projectName = "mdc"
        this.tableName = tableName;
        this.queryResult = {};
        this.cookie = new Cookie();
    }

    async fetchData(URI, initializer = {}) {
        const token = this.cookie.getCookie("token");

        try {
            if (token) {
                initializer = {
                    ...initializer,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            }

            const response = await fetch(URI, initializer);

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            return response;

        } catch (error) {
            console.error("Failed to fetch data -> ", error);

            return {
                ok: false,
                status: error.status || 'Network Error',
                message: error.message || 'Unable to fetch data',
            }
        }
    }

    async listDataAsync(tName) {
        try {
            const endpoint = `${this.baseUrl}/api/${this.projectName}/${tName}`;
            const response = await this.fetchData(endpoint)
    
            if (!response.ok) {
                throw Error(`Unable of fetching data, bad response -> ${response.status}`)
            }

            const data = await response.json()

            this.queryResult = data

            return this.queryResult
        } catch (error) {
            return {
                status: error.status || 'Error',
                text: error.message || 'Failed to list data',
            };
        }
    }

    async getDataByKeyAsync(tName, pkColum, pk) {
        try {
            const endpoint = `${this.baseUrl}/api/${this.projectName}/${tName}/${pkColum}/${pk}`;
            // const endpoint = `${this.baseUrl}/api/${this.projectName}/${tName}/id/${pk}`
            const response = await this.fetchData(endpoint);
            if (!response.ok) {
                throw Error(`Unable of fetching data, bad response -> ${response.status}`)
            }

            const data = await response.json()

            this.queryResult = data

            return this.queryResult
        } catch (error) {
            return {
                status: error.status || 'Error',
                text: error.message || 'Failed to get data',
            };
        }
    }

    async postDataAsync(tName, dataObj) {
        try {
            const endpoint = `${this.baseUrl}/api/${this.projectName}/${tName}`;
            const response = await this.fetchData(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataObj),
            });

            if (!response.ok) {
                throw Error(`Unable of fetching data, bad response -> ${response.status}`)
            }

            return response;
        } catch (error) {
            return {
                status: error.status || 'Error',
                text: error.message || 'Failed to get data',
            };
        }
    }

    async updateDataAsync(tName, pkColum, pk, dataObj) {
        try {
            const endpoint = `${this.baseUrl}/api/${this.projectName}/${tName}/${pkColum}/${pk}`;
            const response = await this.fetchData(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataObj),
            });

            if (!response.ok) {
                throw Error(`Unable of fetching data, bad response -> ${response.status}`)
            }

            return response;
        } catch (error) {
            return {
                status: error.status || 'Error',
                text: error.message || 'Failed to get data',
            };
        }
    }

    async deleteDataAsync(tName, pkColum, pk) {
        try {
            const endpoint = `${this.baseUrl}/api/${this.projectName}/${tName}/${pkColum}/${pk}`;
            const response = await this.fetchData(endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`
                    Unable of fetching data, bad response -> 
                    status: ${response.status}, 
                    message: ${response.message}
                `)
            }

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async verifyCredentialsAsync(tName, bodyObj) {
        try {
            const endpoint = `${this.baseUrl}/api/${this.projectName}/${tName}/verificar-contrasena`;
            const response = await this.fetchData(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyObj),
            });

            if (!response.ok) {
                throw new Error(`
                    Unable of fetching data, bad response -> 
                    status: ${response.status}, 
                    message: ${response.message}
                `)
            }

            return true;

        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async loginAsync(bodyObj) {
        try {
            const endpoint = `${this.baseUrl}/api/auth/login`;
            const response = await this.fetchData(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyObj),
            });

            if (!response.ok) {
                throw new Error(`
                    Unable log user in, response -> 
                    status: ${response.status}, 
                    message: ${response.message}
                `)
            }

            const json = await response.json()

            return json;

        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async parameterizedQueryAsync(bodyObj) {
        try {
            const endpoint = `${this.baseUrl}/api/${this.projectName}/any/ejecutar-consulta-parametrizada`;
            const response = await this.fetchData(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyObj)
            });

            if (!response.ok) {
                throw Error(`Unable of fetching data, bad response -> status: ${response.status}, message: ${response.message}`)
            }

            return response;
        } catch {
            return {
                status: error.status || 'Error',
                text: error.message || 'Failed to get data',
            };
        }
    }

    constructor_validator() {}
}

export { FetchHandler };
