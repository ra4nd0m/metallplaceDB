import store from "@/store";
import config from "@/config";

class Agent{
    get(url){
        return this._request(url, 'GET')
    }
    post(url, data, withoutAuth){
        return this._request(url, 'POST', JSON.stringify(data), withoutAuth)
    }
    _request(url, method, body, withoutAuth) {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        if (!withoutAuth) {
            const token = store.getters.getToken
            headers.Authorization = `${token}`
        }

        return fetch(config.apiEndpoint + url, {method, headers, body}).then(response => response)

    }}

const agent = new Agent();

export default agent;


export const fetchWithAuth = async (url, options = {}) => {
    const headers = addAuthToken(options.headers || {})
    const response = await fetch(url, { ...options, headers })
    return response.json()
}