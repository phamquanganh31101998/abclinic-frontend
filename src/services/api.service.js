import axios from 'axios'
// import qs from 'qs'

export default {
    getApi, postApi, login, postApiParams, deleteApi, putApi
}

async function getApi(url, param){
    try {
        let config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('ac_uid'),
            },
        }
        if (param != null && param != undefined){
            config.params = param
        }
        const result = await axios.get(url, config)
        return result
    }
    catch (error) {
        return error.response;
    }
}

async function putApi(url, params){
    let config = {
        method: 'put',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('ac_uid'),
        },
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

async function postApi(url, data){
    let config = {
        method: 'post',
        url: url,
        data: data,
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

async function deleteApi(url, params){
    let config = {
        method: 'delete',
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

async function login(url, params){
    let config = {
        method: 'post',
        url: url,
        params: params,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
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