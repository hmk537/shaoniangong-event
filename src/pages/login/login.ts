import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController,ModalController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs'
import { RegisterPage } from '../register/register'
import { HttpUtilProvider } from '../../providers/http-util'
import CONSTANTS from '../../app/constants'
import { OrgSelectPage } from '../org-select/org-select'
import { TermsAlertPage } from '../../pages/terms-alert/terms-alert';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpUtil: HttpUtilProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController,private modalCtrl: ModalController) {
  }

  formData = {
    username: '',
    password: '',
    // username: '刘陈禹',
    // password: '15067118559',
    loginKind: 'student',
    orgId: localStorage.orgId
  }

  nameLabel = ''
  from = ''
  ready = false
  agreementChecked = false

  orgName = JSON.parse(localStorage.org)['name']

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    const settings = JSON.parse(localStorage.settings)
    this.nameLabel = parseInt(settings.idCardNeed) === 1 ? '请输入学员姓名或身份证' : '请输入学员姓名'
  }

  async ionViewDidEnter() {
    this.from = this.navParams.data.from || ''

    // debugger
    if (this.from !== 'exit') {
      if (localStorage.loginForm) {
        // 自动登录
        const loading = this.loadingCtrl.create({
          content: '登录中...'
        })
        loading.present()
        Object.assign(this.formData, JSON.parse(localStorage.loginForm))
        await this.requestLogin()
        loading.dismiss()
        const pages: any[] = [TabsPage]
        this.navCtrl.setPages(pages)
      } else {
        this.ready = true
      }
    } else {
      // 用户主动登出
      this.ready = true
      localStorage.removeItem('loginForm')
    }
    // console.log(this.from)
  }

  goOrgSelect() {
    this.navCtrl.push(OrgSelectPage, {
      from: 'login',
      callback: function () {
        this.orgName = JSON.parse(localStorage.org)['name']
      }.bind(this)
    })
  }

  openContract(){
    let termsAlert = this.modalCtrl.create(TermsAlertPage)
    termsAlert.present()
  }

  goRegister() {
    this.navCtrl.push(RegisterPage)
  }

  requestLogin() {
    // this.formData.orgId = localStorage.orgId
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.httpUtil.post(CONSTANTS['LOGIN'], this.formData)
        if (res['userId']) {
          localStorage.userInfo = JSON.stringify(res)
          const studentInfo = await this.httpUtil.post(CONSTANTS['GET_STUDENT_INFO'], {
            orgId: localStorage.orgId,
            userId: res['humanId']
          })

          localStorage.studentInfo = JSON.stringify(studentInfo)
        }

        // 自动登录信息
        localStorage.loginForm = JSON.stringify(this.formData)

        resolve(res)
      } catch (e) {
        reject(e)
      }
    })
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

  async doLogin() {
    if(!this.agreementChecked){
      this.alert('请先阅读并同意《隐私政策制度、用户信息保护制度》!')
      return
    }
    const loading = this.loadingCtrl.create({
      content: '登录中...'
    })
    loading.present()
    try {
      // const res = this.requestLogin()
      await this.requestLogin()
      this.alertCtrl.create({
        title: '提示',
        subTitle: '登录成功！',
        buttons: [{
          text: '确认', handler: () => {
            const pages: any[] = [TabsPage]
            this.navCtrl.setPages(pages)
          }
        }]
      }).present()
    } catch (e) {
      // console.error(e)
      this.alertCtrl.create({
        title: '提示',
        subTitle: e,
        buttons: [{
          text: '确认'
        }]
      }).present()
    } finally {
      loading.dismiss()
    }
    // this.navCtrl.push(TabsPage)
  }

}
