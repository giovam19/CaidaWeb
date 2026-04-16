export const common = {
    BACK_URL_BASE: "http://localhost:3001",
    sendRequest: function(method, endpoint, data, auth = false, callback) {
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

        fetch(url, options)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data) callback(data);
            })
            .catch(err => new Error(err));
    },
    emptyOrRows: function(rows) {
        if (!rows) {
            return [];
        }
        return rows;
    }
}


