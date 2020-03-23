import axios from 'axios'
import qs from 'qs'
import config from '../config'

export default {
    signUp
}

async function signUp(data){
    let url = config.authUrl + '/sign_up'
    try {
        const result = await axios({
            method: 'post',
            url: url,
            data: data
        })
        return result
    }
    catch (error) {
        alert(error)
    }
}

