import moment from 'moment'

export default {
    returnTimeFromTimeArray, returnLocalTimeFromTimeArray, returnNotificationType,
    returnRole, checkString, findObjIndexById, convertSecond, returnGender
}

function returnTimeFromTimeArray(arr){
    return returnTime(arr, false)
}

function returnLocalTimeFromTimeArray(arr){
    return returnTime(arr, true)
}

function returnNotificationType(type){
    switch(type){
        case 0: 
            return 'YÊU CẦU TƯ VẤN'
        case 1: 
            return 'TƯ VẤN KHÁM BỆNH'
        case 2: 
            return 'TRẢ LỜI'
        case 3: 
            return 'GÁN QUYỀN QUẢN LÝ'
        case 4: 
            return 'CHẤP NHẬN QUẢN LÝ'
        case 5: 
            return 'TỪ CHỐI QUẢN LÝ'
        case 6: 
            return 'HỦY QUYỀN QUẢN LÝ'
        case 7: 
            return 'ĐẶT LỊCH GỬI CHỈ SỐ SỨC KHỎE'
        case 8: 
            return 'GỬI CHỈ SỐ SỨC KHỎE'
        case 9: 
            return 'CÓ LỊCH GỬI CHỈ SỐ SỨC KHỎE PHẢI NỘP'
        case 10: 
            return 'ĐÃ ĐƯỢC HỦY KÍCH HOẠT'
        case 11: 
            return 'TƯ VẤN DINH DƯỠNG'
    }
}

function returnRole(role){
    let result = '';
    switch(role){
        case 'PATIENT':
            result = 'BỆNH NHÂN';
            break;
        case 'PRACTITIONER':
            result = 'BÁC SĨ ĐA KHOA';
            break;
        case 'SPECIALIST':
            result = 'BÁC SĨ CHUYÊN KHOA';
            break;
        case 'DIETITIAN':
            result = 'BÁC SĨ DINH DƯỠNG';
            break;
        case 'COORDINATOR':
            result = 'ĐIỀU PHỐI VIÊN';
            break;
        default:
            result = '';
            break;
    }
    return result
}

function checkString(str){
    return (str != null & str != undefined) ? str : '_'
}

function findObjIndexById(arr, id){
    let result = -1;
    for(let i = 0; i < arr.length; i++){
        if(arr[i].id == id){
            result = i
        }
    }
    return result
}

function convertSecond(sec){
    let month = Math.floor(sec/ 18144000)
    let monthStr = (month == 0) ? '' : `${month} tháng `
    let week = Math.floor((sec % 18144000)/ 604800)
    let weekStr = (week == 0) ? '' : `${week} tuần `
    let day = Math.floor((sec % 18144000 % 604800) / 86400)
    let dayStr = (day == 0) ? '' : `${day} ngày `
    let hour = Math.floor((sec % 18144000 % 604800 % 86400) / 3600)
    let hourStr = (hour == 0) ? '' : `${hour} giờ `
    let result = monthStr + weekStr + dayStr + hourStr
    return result
}

function returnGender(number){
    switch(number){
        case 0: 
            return 'NAM'
        case 1:
            return 'NỮ'
        case 2:
            return 'KHÁC'
    }
}

function returnTime(arr, isLocal){
    try {
        let i = 0;
        let dayArr = []
        let timeArr = []
        while(i < arr.length){
            if(i < 3){
                dayArr.push(arr[i])
            }
            else {
                timeArr.push(arr[i])
            }
            i++
        }
        let timeString = `${dayArr.join('-')} ${timeArr.join(':')}`
        if(isLocal){
            return moment.utc(timeString).local().format('HH:mm:ss DD/MM/YYYY')
        }
        else {
            return moment(timeString).format('HH:mm:ss DD/MM/YYYY')
        }
    }
    catch(error){
        console.log(error)
        return "_"
    }
}
