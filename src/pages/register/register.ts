import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { HttpUtilProvider } from '../../providers/http-util'
import CONSTANTS from '../../app/constants'
import { DatePicker } from '@ionic-native/date-picker'
import moment from 'moment'
import utils from '../../common/utils'
import { SchoolPickerPage } from '../school-picker/school-picker'

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpUtil: HttpUtilProvider,
    public alertCtrl: AlertController,
    private datePicker: DatePicker,
    private modalCtrl: ModalController
  ) {
  }

  sexes = [{ name: '男', code: 0 }, { name: '女', code: 1 }]
  grades: any = []

  formData = {
    orgId: localStorage.orgId,
    name: '',
    mobile: '',
    officePhone: '',
    school: '',
    cardNo: '',
    grade: -1,
    sex: 0,
    birthday: '2000-01-01'
  }

  // 学校是否必填
  isSchoolRequired = JSON.parse(localStorage.initData)['setting']['isSchoolRequired'] == 1
  // 身份证是否必填
  idCardRequired = parseInt(JSON.parse(localStorage.settings)['idCardNeed']) === 1
  // 是否启用手机号码二
  officePhoneEnabled = JSON.parse(localStorage.initData)['setting']['isTwoPhone'] == 1
  // 身份证是否通过验证
  idCardPassed = false
  idCardFailedReason = ''

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');

    this.httpUtil.queryDict('edu_grade').then(res => {
      this.grades = res
      // this.formData.grade = this.grades[0].value
    })
  }

  setSex(sexCode) {
    if (!this.idCardRequired) {
      this.formData.sex = sexCode
    }
  }

  showDatePicker() {
    if (!this.idCardRequired) {
      this.datePicker.show({
        date: new Date(),
        mode: 'date',
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
        okText: '确定',
        cancelText: '取消',
        doneButtonLabel: '确定',
        cancelButtonLabel: '取消'
      }).then(
        date => {
          console.log('Got date: ', date)
          this.formData.birthday = moment(date).format('YYYY-MM-DD')
        },
        err => console.log('Error occurred while getting date: ', err)
      )
    }
  }

  async submit() {
    // let passed = true

    const phoneNumRegex = /^1[34578]\d{9}$/
    let msg = ''

    if (this.formData.name.trim() === '') {
      this.alert('用户名不能为空!')
      return
    }

    if (this.formData.mobile.toString().trim() === '') {
      this.alert('手机号码不能为空!')
      return
    }

    if (this.idCardRequired) {
      // 机构身份证必填
      if (this.formData.cardNo.trim() === '') {
        this.alert('身份证号不能为空!')
        return
      }
    }

    if (!phoneNumRegex.test(this.formData.mobile.toString().trim())) {
      this.alert('手机号格式不正确')
      return
    }

    if (this.officePhoneEnabled) {
      if (this.formData.officePhone.toString().trim() === '') {
        this.alert('手机号码二不能为空')
        return
      }
    }

    // （不管身份证是否必填）用户填写了身份证
    if (this.formData.cardNo.trim() !== '') {
      if (!this.idCardPassed) {
        this.alertCtrl.create({
          title: '提示',
          subTitle: this.idCardFailedReason || '身份证号格式不正确!',
          buttons: [{
            text: '确认', handler: () => {
            }
          }]
        }).present()
        return
      }/*  else if (!checkIdDuplicate.call(this, this.formData.cardNo.trim())) {
        this.alertCtrl.create({
          title: '提示',
          subTitle: '身份证号码重复！',
          buttons: [{
            text: '确认', handler: () => {
            }
          }]
        }).present()
        return
      } */
    }

    if (this.formData.grade === -1) {
      this.alertCtrl.create({
        title: '提示',
        subTitle: '请选择年级!',
        buttons: [{
          text: '确认', handler: () => {
          }
        }]
      }).present()
      return
    }

    if (this.isSchoolRequired && this.formData.school.trim() === '') {
      this.alertCtrl.create({
        title: '提示',
        subTitle: '缺少学校名称!',
        buttons: [{
          text: '确认', handler: () => {
          }
        }]
      }).present()
      return
    }

    if (this.formData.grade === -1) {
      this.alertCtrl.create({
        title: '提示',
        subTitle: '请选择年级!',
        buttons: [{
          text: '确认', handler: () => {
          }
        }]
      }).present()
      return
    }

    // alert('注册');
    this.httpUtil.post(CONSTANTS['REGISTER'], this.formData).then(res => {
      this.alertCtrl.create({
        title: '提示',
        subTitle: '注册成功！',
        buttons: [{
          text: '确认', handler: () => {
            this.navCtrl.pop()
          }
        }]
      }).present()
    }).catch(err => {
      this.alertCtrl.create({
        title: '提示',
        subTitle: err,
        buttons: [{
          text: '确认'
        }]
      }).present()
    })

    async function checkIdDuplicate(cardNo) {
      const res = await this.httpUtil.post(CONSTANTS['VALIDATE_ID_CARD'], { cardNo })
      console.log(res)
      return res.isValid
    }
  }

  alert(msg) {
    this.alertCtrl.create({
      title: '提示',
      subTitle: msg,
      buttons: [{
        text: '确认', handler: () => {
        }
      }]
    }).present()
  }

  cardNumChange() {
    /* const idCardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
      idCardNum = this.formData.cardNo
    if (idCardReg.test(this.formData.cardNo)) {
      this.idCardPassed = true
      if (this.idCardRequired) {
        // console.log(this.formData.cardNo)
        this.formData.birthday = `${idCardNum.substr(6, 4)}-${idCardNum.substr(10, 2)}-${idCardNum.substr(12, 2)}`
        this.formData.sex = parseInt(idCardNum.substr(16, 1)) % 2 === 0 ? 1 : 0
      }
    } else {
      this.idCardPassed = false
    } */

    const idCardNum = this.formData.cardNo,
      idTestResult = utils.identityCodeValid(idCardNum.toString())

    if (idTestResult.pass) {
      this.idCardPassed = true
      this.idCardFailedReason = ''
      if (this.idCardRequired) {
        this.formData.birthday = `${idCardNum.substr(6, 4)}-${idCardNum.substr(10, 2)}-${idCardNum.substr(12, 2)}`
        this.formData.sex = parseInt(idCardNum.substr(16, 1)) % 2 === 0 ? 1 : 0
      }
    } else {
      this.idCardPassed = false
      this.idCardFailedReason = idTestResult['message']
    }
    console.log(this.idCardPassed)

  }

  showSchoolPicker() {
    console.log('triggered')
    const selectModal = this.modalCtrl.create(SchoolPickerPage, { keyword: this.formData.school || '' });
    selectModal.onDidDismiss(data => {
      if (data.name) {
        this.formData.school = data.name
      }
    })
    selectModal.present()
  }

  get currentGradeLabel() {
    const grade = this.grades.find(g => g.value === this.formData.grade)
    if (grade) {
      return grade.label
    } else {
      return '请选择'
    }
  }
}
