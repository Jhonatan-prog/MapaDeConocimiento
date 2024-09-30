class FetchHandler {
    constructor(baseUrl = "", tableName = "") {
        this.baseUrl = baseUrl;
        this.projectName = "mdc"
        this.tableName = tableName;
        this.queryResult = {} | null;
    }

    async fetchData(URI, initializer) {
        var badResponse = null;
        try {
            const response = await fetch(URI, initializer);

            if (!response.ok) {
                badResponse = response;
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            this.queryResult = data;

            return this.queryResult

        } catch (error) {
            console.error("Failed to fetch data:", error);
            return {
                "status": badResponse.status,
                "text": badResponse.statusText,
            }
        }
    }

    async listDataAsync(tName) {
        if (!this.tableName) {
            this.tableName = tName
        }

        try {
            const endpoint = `${this.baseUrl}/api/${this.projectName}/${this.tableName}`;
            response = await this.fetchData(endpoint, {
                method: "GET",
            })
    
            if (!response.ok) {
                throw Error(message=`Unable of fetching data bad response -> ${response.status}`)
            }
    
            const data = await response.json()
    
            this.queryResult = data.data
    
            return this.queryResult
        } catch (error) {
            return null;
        }
    }

    async getDataByKeyAsync(key) {
        const endpoint = "";

        return this.queryResult
    }

    async postDataAsync() {

    }

    constrcutor_validator() {
        pass
    }
}

export { FetchHandler };
