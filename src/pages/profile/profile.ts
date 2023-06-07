import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
import { PersonalInfoPage } from '../personal-info/personal-info'
import { MyClassListPage } from '../my-class-list/my-class-list'
import { AboutPage } from '../about/about'
import { SettingPage } from '../setting/setting'
import { SigninListPage } from '../signin-list/signin-list'
import { LoginPage } from '../login/login'
import { ECertPage } from '../e-cert/e-cert';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public appCtrl: App, public navCtrl: NavController, public navParams: NavParams) {
  }

  studentName: ''
  orgName: ''

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.studentName = JSON.parse(localStorage.userInfo)['studName']
  }

  ionViewDidEnter() {
    this.orgName = JSON.parse(localStorage.org)['name']
  }

  goSetting() {
    this.appCtrl.getRootNav().push(SettingPage, {
      callback: function () {
        this.orgName = JSON.parse(localStorage.org)['name']
      }.bind(this)
    })
  }

  exit() {
    localStorage.userInfo = null
    const rootNav = this.appCtrl.getRootNav()
    // rootNav.push(LoginPage)
    // rootNav.remove(0, rootNav.getViews().length - 1)
    rootNav.setPages([{
      page: LoginPage, params: {
        from: 'exit'
      }
    }])
  }

  goPage(pageName) {
    switch (pageName) {
      case 'myClass':
        this.appCtrl.getRootNav().push(MyClassListPage)
        break
      case 'personalInfo':
        this.appCtrl.getRootNav().push(PersonalInfoPage)
        break
      case 'about':
        this.appCtrl.getRootNav().push(AboutPage)
        break
      case 'signinList':
        this.appCtrl.getRootNav().push(SigninListPage)
        break
      case 'e-cert':
        this.appCtrl.getRootNav().push(ECertPage)
        break
    }
  }

}
