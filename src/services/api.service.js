import axios from 'axios'
// import qs from 'qs'

export default {
    getApi, postApi, login
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
        // alert(error)
        console.log(error.response)
    }
}

async function postApi(url, data){
    let config = {
        method: 'post',
        url: url,
        data: data
    }
    try {
        const result = await axios(config)
        return result
    }
    catch (error) {
        alert(error)
    }
}

async function login(url, params){
    let config = {
        method: 'post',
        url: url,
        params: params
    }
    try {
        const result = await axios(config)
        return result
    }
    catch (error) {
        // console.log(error.response)
        alert(error.response.data.message)
        // return error
    }
}
