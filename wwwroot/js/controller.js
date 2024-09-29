class FetchHandler {
    constructor(baseUrl, tableName) {
        this.baseUrl = baseUrl;
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

    async getDataAsync() {
        const endpoint = `${this.baseUrl}/api/{...}/{...}`;

        return this.queryResult
    }

    async getDataByKeyAsync(key) {
        const endpoint = "";

        return this.queryResult
    }

    async postDataAsync() {

    }
}
