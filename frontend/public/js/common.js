export const common = {
    BACK_URL_BASE: "http://localhost:3001",
    sendRequest: async function(method, endpoint, data, auth = false) {
        const url = common.BACK_URL_BASE + endpoint;

        const headers = {
            'Content-Type': 'application/json'
        };

        if (auth) {
            const token = localStorage.getItem("token");
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        const options = {
            method: method,
            headers: headers
        };

        if (method !== 'GET' && data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            return await response.json();
        } catch (error) {
            return {code: 400, message: error};
        }
    },
    emptyOrRows: function(rows) {
        if (!rows) {
            return [];
        }
        return rows;
    }
}


