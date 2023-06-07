import moment from 'moment'
function dateFormat(timestamp, _fmt) {
    if (timestamp) {
        const fmt = _fmt || 'YYYY-MM-DD'
        return moment(timestamp).format(fmt)
    } else {
        return ''
    }
}

function now() {
    return (new Date()).getTime()
}

function getClassStatus(data) {
    const setting = JSON.parse(localStorage.initData)['setting'],
        currentTime = now()

    let canApply = false,
        canCollect = false,
        statusProperty = '',
        highlight = true

    // debugger
    if (data.bean.status == 3 && (data.bean.issueStatus == 1 || data.bean.issueStatus == 4)) {
        if (data.bean.recruitNum - data.bean.reserveNum > data.bean.applyUsedNum) {
            canApply = true;
            canCollect = true;
            statusProperty = "报名进行中";
        } else {
            canApply = false;
            canCollect = false;
            statusProperty = "名额已满";
            highlight = false
        }
    } else if (data.bean.status == 3 && data.bean.issueStatus == 2) {
        canApply = false;
        canCollect = false;
        if (data.bean.enrollType == 0) {
            statusProperty = "即报即得";
        } else if (data.bean.enrollType == 1) {
            statusProperty = "摇号中";
        } else if (data.bean.enrollType == 2) {
            statusProperty = "面试中";
        }
    } else if (data.bean.status == 3 && data.bean.issueStatus == 3) {
        canApply = false;
        canCollect = false;
        statusProperty = "报名已关闭";
    }
    if (setting.beginTime > currentTime) {
        canApply = false;
        canCollect = true;
        statusProperty = "报名未开始";
    }
    if (setting.endTime < currentTime) {
        canApply = false;
        canCollect = false;
        statusProperty = "报名已结束";
    }
    //是否已经到了预设的摇号时间
    if (setting.randomTime < currentTime) {
        //摇号的班级进入摇号时间后不得再报名
        if (data.bean.enrollType == 1) {
            canApply = false;
            canCollect = false;
            statusProperty = "摇号中";
        }
    }

    return { canApply, canCollect, statusProperty, highlight }
}

function identityCodeValid(num) {
    num = num.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。    
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        // alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
        // return false;
        return {
            pass: false,
            message: '输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。'
        }
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。  
    //下面分别分析出生日期和校验位  
    var len, re;
    len = num.length;
    var arrCh = null
    if (len == 15) {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);
        //检查生日日期是否正确  
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() - 1900 == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            // alert('身份证号码日期格式不正确！');
            // return false;
            return {
                pass: false,
                message: '身份证号码日期格式不正确！'
            }
        } else {
            //将15位身份证转成18位  
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。  
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            // return num;
            return { pass: true }
        }
    }
    if (len == 18) {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);
        //检查生日日期是否正确  
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay) {
            // alert('身份证号码日期格式不正确！');
            // return false;
            return {
                pass: false,
                message: '身份证号码日期格式不正确！'
            }
        } else {
            //检验18位身份证的校验码是否正确。  
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。  
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            for (i = 0; i < 17; i++) {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1)) {
                // alert('18位身份证的校验码不正确！应该为：' + valnum);
                // return false;
                return {
                    pass: false,
                    message: '18位身份证的校验码不正确！应该为：' + valnum
                }
            }
            // return num;
            return { pass: true }
        }
    }
    // return true;
    return { pass: true }
}

export default {
    dateFormat,
    now,
    getClassStatus,
    identityCodeValid
}