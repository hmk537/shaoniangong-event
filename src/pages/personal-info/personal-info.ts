import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { HttpUtilProvider } from '../../providers/http-util'
import { DatePicker } from '@ionic-native/date-picker'
import moment from 'moment'
import CONSTANTS from '../../app/constants'
import utils from '../../common/utils'
import { SchoolPickerPage } from '../school-picker/school-picker'

/**
 * Generated class for the PersonalInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-personal-info',
  templateUrl: 'personal-info.html',
})
export class PersonalInfoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpUtil: HttpUtilProvider, private datePicker: DatePicker, private alertCtrl: AlertController, private modalCtrl: ModalController) {
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
    birthday: '2000-01-01',
    carId1: '',
    carId2: ''
  }

  // 学校是否必填
  isSchoolRequired = false
  // 身份证是否必填
  idCardRequired = false
  // 身份证输入框是否只读
  idCardReadonly = false
  // 身份证是否通过验证
  idCardPassed = false
  // 是否启用车牌号
  isCarNoEnable = false
  // 是否启用手机号码二
  officePhoneEnabled = false
  idCardFailedReason = ''

  ionViewDidLoad() {
    // init
    const initData = JSON.parse(localStorage.initData)
    this.isSchoolRequired = initData['setting']['isSchoolRequired'] == 1
    this.idCardRequired = parseInt(JSON.parse(localStorage.settings)['idCardNeed']) === 1
    this.isCarNoEnable = typeof initData.setting.isCar !== 'undefined' && parseInt(initData.setting.isCar) === 1
    this.officePhoneEnabled = initData['setting']['isTwoPhone'] == 1

    console.log('ionViewDidLoad PersonalInfoPage');
    this.httpUtil.queryDict('edu_grade').then(res => {
      this.grades = res
      // this.formData.grade = this.grades[0].value
    })

    const studentInfo = JSON.parse(localStorage.studentInfo)
    Object.assign(this.formData, {
      name: studentInfo.name,
      mobile: studentInfo.mobile,
      officePhone: studentInfo.officePhone,
      school: studentInfo.school,
      cardNo: studentInfo.cardNo || '',
      grade: studentInfo.grade,
      sex: studentInfo.sex,
      carId1: studentInfo.carId1,
      carId2: studentInfo.carId2,
      birthday: moment(studentInfo.birthday).format('YYYY-MM-DD')
    })

    this.idCardReadonly = this.idCardRequired || (!this.idCardRequired && this.formData.cardNo.trim() !== '')

    /* this.httpUtil.post(CONSTANTS['GET_STUDENT_INFO'], {
      orgId: localStorage.orgId,
      userId: JSON.parse(localStorage.userInfo)['humanId']
    }) */
  }

  showDatePicker() {
    if (this.idCardRequired/*  || this.formData.cardNo.trim() === '' */) {
      return
    }
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => {
        console.log('Got date: ', date)
        this.formData.birthday = moment(date).format('YYYY-MM-DD')
      },
      err => console.log('Error occurred while getting date: ', err)
    )
  }

  setSex(sexCode) {
    if (this.idCardRequired/*  || this.formData.cardNo.trim() === '' */) {
      return
    }
    this.formData.sex = sexCode
  }

  submit() {
    if (this.idCardRequired && this.formData.cardNo.trim() === '') {
      this.alertCtrl.create({
        title: '提示',
        subTitle: '身份证号不能为空!',
        buttons: [{
          text: '确认', handler: () => {
          }
        }]
      }).present()
    } else if (this.officePhoneEnabled && !this.formData.officePhone) {
      this.alertCtrl.create({
        title: '提示',
        subTitle: '手机号码二不能为空!',
        buttons: [{
          text: '确认', handler: () => {
          }
        }]
      }).present()
    } else if (this.isSchoolRequired && this.formData.school.trim() === '') {
      this.alertCtrl.create({
        title: '提示',
        subTitle: '修改失败,缺少学校名称!',
        buttons: [{
          text: '确认', handler: () => {
          }
        }]
      }).present()
    } else {
      this.httpUtil.post(CONSTANTS['UPDATE_STUDENT_INFO'], Object.assign({
        userId: JSON.parse(localStorage.userInfo)['humanId']
      }, this.formData)).then(async res => {
        this.httpUtil.post(CONSTANTS['GET_STUDENT_INFO'], {
          orgId: localStorage.orgId,
          userId: JSON.parse(localStorage.userInfo)['humanId']
        }).then(studentInfo => {
          localStorage.studentInfo = JSON.stringify(studentInfo)
          this.alertCtrl.create({
            title: '提示',
            subTitle: '修改成功！',
            buttons: [{
              text: '确认', handler: () => {
                this.navCtrl.pop()
              }
            }]
          }).present()
        })
      }).catch(err => {
        // debugger
        this.alertCtrl.create({
          title: '提示',
          subTitle: err,
          buttons: [{
            text: '确认'
          }]
        }).present()
      })
    }
  }

  cardNumChange() {
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

  }

  showSchoolPicker() {
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
