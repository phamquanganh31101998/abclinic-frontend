import axios from 'axios'
// import qs from 'qs'

export default {
    getApi, postApi, login, postApiParams, deleteApi, putApi
}

async function getApi(url, params){
    try {
        let config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('ac_uid'),
            },
        }
        if (params != null && params != undefined){
            config.params = params
        }
        const result = await axios.get(url, config)
        return result
    }
    catch (error) {
        return error.response;
    }
}

async function putApi(url, body, params){
    let config = {
        method: 'put',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('ac_uid'),
        },
    }
    if (body){
        config.data = body
    }
    if (params != null && params != undefined){
        config.params = params
    }
    try {
        const result = await axios(config)
        return result
    }
    catch (error) {
        return error.response;
    }
}

async function postApi(url, body){
    let config = {
        method: 'post',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('ac_uid'),
        },
    }
    if(body){
        config.data = body
    }
    try {
        const result = await axios(config)
        return result
    }
    catch (error) {
        return error.response;
    }
}

async function postApiParams(url, params){
    let config = {
        method: 'post',
        url: url,
        params: params,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('ac_uid'),
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

async function deleteApi(url, body){
    let config = {
        method: 'delete',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('ac_uid'),
        },
    }
    if(body){
        config.data = body
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
        method: 'post',
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