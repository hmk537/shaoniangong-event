import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, App } from 'ionic-angular';
import { LoginPage } from '../login/login'

import { OrgSelectPage } from '../org-select/org-select'
/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public loadingCtrl: LoadingController, public appCtrl: App) {
  }

  callback = null

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
    this.callback = this.navParams.data.callback
  }

  ionViewWillUnload() {
    this.callback && this.callback()
  }

  goOrgSelect() {
    this.navCtrl.push(OrgSelectPage, {
      from: 'setting'
    })
  }
  async cancel() {
    this.alertCtrl.create({
      title: '提示',
      message: '是否确认注销？',
      buttons: [
        {
          text: '否',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: '是',
          handler: () => {
            doCancel.call(this)
          }
        }
      ]
    }).present();

    async function doCancel() {
      const loading = this.loadingCtrl.create({
        content: '正在注销...'
      })
      loading.present()
      this.alertCtrl.create({
        title: '提示',
        subTitle: '已注销',
        buttons: [{
          text: '确认', handler: () => {
            localStorage.userInfo = null
            const rootNav = this.appCtrl.getRootNav()
            rootNav.setPages([{
              page: LoginPage, params: {
                from: 'exit'
              }
            }])
          }
        }]
      }).present()
      loading.dismiss()
    }
  }

  get orgName() {
    const org = JSON.parse(localStorage.org)
    return org['name']
  }

}
