import axios from 'axios'

export default {
    getApi, postApi,  putApi, deleteApi, login,
}

function getApi(url, params){
    return callApi(url, 'GET', params)
}

function postApi(url, body){
    return callApi(url, 'POST', body)
}

function putApi(url, body){
    return callApi(url, 'PUT', body)
}

function deleteApi(url, body){
    return callApi(url, 'DELETE', body)
}


async function callApi(url, method, payload){
    let config = {
        method: method,
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('ac_uid'),
        },
    }
    if(payload != null && payload != undefined){
        if(method == 'GET'){
            config.params = payload;
        }
        else {
            config.data = payload;
        }
    }
    try {
        const result = await axios(config)
        return result
    }
    catch (error) {
        return error.response;
    }
}

async function login(url, body){
    let config = {
        method: 'POST',
        url: url,
        data: body,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Client-Type': 'abc'
        },
    }
    try {
        const result = await axios(config)
        return result
    }
    catch (error) {
        return error.response;
    }
}

