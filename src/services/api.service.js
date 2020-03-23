import axios from 'axios'
import qs from 'qs'

export default {
    getApi
}

async function getApi(url, param){
    try {
        let config = {
            method: 'get',
            url: url,
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
