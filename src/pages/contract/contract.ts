import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import CONSTANTS from '../../app/constants'
import { HttpUtilProvider } from '../../providers/http-util'

/**
 * Generated class for the ContractPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-contract',
  templateUrl: 'contract.html',
})
export class ContractPage {

  contract: string = JSON.parse(localStorage.initData)['orgSetting']['applyAgreements']

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpUtil: HttpUtilProvider) {
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad ContractPage');
  }

}
