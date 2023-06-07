// const host = 'http://bm.qsng.cn/eduplatform/';
// const host = 'http://192.168.1.102:8081/eduplatform/'
const host = 'http://bm.qsng.cn/eduapp/'
// const host = 'api/';
const APIs = {
    COMMON_DICTIONARY: 'api/public/sys/dict/list',
    ORG_DICTIONARY: 'api/public/sys/orgDict/list',
    AREA_LIST: 'api/public/sys/area/list',
    ORG_LIST: 'api/public/sys/info/getOrgList',
    MAJOR_LIST: 'api/public/bs/specialty/list',
    CLASS_LIST: 'api/public/ic/iclass/list',
    CLASS_DETAIL: 'api/public/ic/iclass/detail',
    APPLY_ONLINE: 'api/my/px/apply/applyOnline',
    // APPLY_ONLINE: 'api/public/ic/iclass/applyOnline',
    // MY_CLASS_LIST: 'api/my/px/apply/list',
    MY_CLASS_LIST: 'api/public/ic/iclass/myList',
    CANCEL_APPLY: 'api/public/ic/iclass/cancelInBatch',

    PAYMENT_ALIPAY: 'api/public/fund/zfzx/aliprepayjson',
    WECHAT_APP_PAY: '/api/public/fund/zfzx/wechatCodePayAPP',
    ALIPAY_APP_PAY: '/api/public/fund/zfzx/aliCodePayApp',

    GET_SETTINGS: 'api/public/sys/setting/getByOrgId',
    // GET_ORG_INIT_DATA: 'api/public/sys/info/getInitDataByOrg',
    GET_ORG_INIT_DATA: 'api/public/sys/info/getSettingByOrg',

    VALIDATE_ID_CARD: 'api/public/sys/optUser/validateIdCard', // {cardNo: 'xxx'}
    REGISTER: 'api/public/stu/student/register',
    LOGIN: 'api/public/sys/user/login',
    // 更新学生信息
    UPDATE_STUDENT_INFO: 'api/my/stu/student/update',
    // 获取学生信息
    GET_STUDENT_INFO: 'api/my/stu/student/detail',

    // 我的点到
    SIGN_LIST_TODAY: 'api/my/stu/student/todaySignList',
    SIGN_LIST_STATISTICS: 'api/my/stu/student/studSignIn',

    // 获取所有机构层级数据
    GET_ORG_TREE: 'api/public/sys/area/useList',

    // 机构报名协议
    GET_CONTRACT: 'api/public/sys/info/getSettingByOrg',

    RESERVE_DETAIL: 'api/public/px/apply/getDetailByReserveNo',

    // 获取订单信息
    COMMON_PAY:'api/public/fund/zfzx/commonPay',
};
const CONSTANTS = {}
for (let key in APIs) {
    CONSTANTS[key] = `${host}${APIs[key]}`
}

// 状态map
CONSTANTS['STATUS_MAP'] = [{
    code: 0,
    name: '预约中'
}, {
    code: 1,
    name: '可缴费'
}, {
    code: 2,
    name: '已代缴'
}, {
    code: 3,
    name: '已缴费'
}, {
    code: 4,
    name: '已退费'
}, {
    code: 5,
    name: '已失效'
}, {
    code: 6,
    name: '已撤销'
}]

CONSTANTS['HOST'] = host
CONSTANTS['version'] = '0.1'
CONSTANTS['CHECK_VERSION'] = 'https://tangong-app-update.oss-cn-hangzhou.aliyuncs.com/szsng/update.xml' // 检查app版本更新

// 校外教育
// CONSTANTS['ORG_ID'] = '00006c071e2f44c94627bb0eb6322101c478'
// CONSTANTS['ORG_NAME'] = 'xwjy'

// 宁波
CONSTANTS['ORG_ID'] = '2C9146A12760F52A01276124EFB90016'
// CONSTANTS['ORG_NAME'] = 'nb'

// CONSTANTS['ORG_ID'] = '00006e72043a7f7243629eb4e1904f42c53f'

// 定位地区
CONSTANTS['LOCATE_AMAP'] = 'http://restapi.amap.com/v3/ip'

export default CONSTANTS
