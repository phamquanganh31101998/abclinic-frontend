import axios from 'axios'
import qs from 'qs'
import config from '../config'

export default {
    getAllUser
}

async function getAllUser(uid){
    let param = {
        Authorization: uid
    }
    let _qs = qs.stringify(param)
    let url = `${config.miscUrl}/accounts?${_qs}`
    try {
        const result = await axios.get(url)
        return result
    }
    catch (error) {
        alert(error)
    }
}