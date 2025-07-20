import axios from 'axios';

class HTTPClient {
    static async get(url, options = {}) {
        try {
            const response = await axios.get(url, options);
            return response.data;
        } catch (error) {
            HTTPClient.handleError(error);
        }
    }

    static async post(url, data, options = {}) {
        try {
            const response = await axios.post(url, data, options);
            return response.data;
        } catch (error) {
            HTTPClient.handleError(error);
        }
    }

    static async put(url, data, options = {}) {
        try {
            const response = await axios.put(url, data, options);
            return response.data;
        } catch (error) {
            HTTPClient.handleError(error);
        }
    }

    static async delete(url, options = {}) {
        try {
            const response = await axios.delete(url, options);
            return response.data;
        } catch (error) {
            HTTPClient.handleError(error);
        }
    }

    static handleError(error) {
        if (error.response) {
            console.error('Response error:', error.response.data);
            throw new Error(error.response.data.message || 'An error occurred');
        } else if (error.request) {
            console.error('Request error:', error.request);
            throw new Error('No response received from the server');
        } else {
            console.error('Error:', error.message);
            throw new Error('Error occurred while making the request');
        }
    }
}

export default HTTPClient;
