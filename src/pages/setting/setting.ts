import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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

  get orgName() {
    const org = JSON.parse(localStorage.org)
    return org['name']
  }

}
