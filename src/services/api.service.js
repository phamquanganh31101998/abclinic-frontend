import axios from 'axios'
import qs from 'qs'

export default {
    getApi, postApi
}

async function getApi(url, param){
    try {
        let config = {
            method: 'get',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json', 
            },
        }
        if (param != null && param != undefined){
            let _qs = qs.stringify(param)
            config.url = config.url + '?' + _qs
        }
        const result = await axios(config)
        return result
    }
    catch (error) {
        alert(error)
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
        return alert(error)
    }
}
