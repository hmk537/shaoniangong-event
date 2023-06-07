import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
import { HttpUtilProvider } from '../../providers/http-util'
import CONSTANTS from '../../app/constants'
import { PaymentPage } from '../payment/payment'
import { MyClassListPage } from '../my-class-list/my-class-list'
import utils from '../../common/utils'
/**
 * Generated class for the ApplySuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-apply-success',
  templateUrl: 'apply-success.html',
})
export class ApplySuccessPage {

  constructor(public appCtrl: App, public navCtrl: NavController, public navParams: NavParams, public httpUtil: HttpUtilProvider) {
  }

  applyInfo = null
  org = JSON.parse(localStorage.org)

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplySuccessPage');
    this.applyInfo = this.navParams.data
    console.log(this.applyInfo)

    // console.log(this.applyInfo['bean']['status'])
  }

  async payNow() {
    // this.navParams.data.applyId
    /* const res = await this.httpUtil.post(CONSTANTS['PAYMENT_ALIPAY'], {
      siteId: localStorage.orgId,
      applyId: this.navParams.data.applyId
    })
    console.log(res) */
    this.navCtrl.push(PaymentPage, {
      paymentInfo: {
        area: this.applyInfo['bean']['caption']['area'],
        classCode: this.applyInfo['bean']['code'],
        year: this.applyInfo['bean']['year'],
        term: this.applyInfo['bean']['caption']['term'],
        major: this.applyInfo['bean']['spelName'],
        class: this.applyInfo['bean']['name'],
        majorDegree: this.applyInfo['bean']['caption']['degree'],
        totalFee: this.applyInfo['bean']['totalFee'],

        reserveNo: this.applyInfo['bean']['reserveNo'],
        deadLine: this.applyInfo['bean']['deadLine'],
        orgId: this.applyInfo['bean']['orgId'],
        enrollType: this.applyInfo['bean']['enrollType']
      },
      paymentSuccessCallback: function () {
        this.navCtrl.popToRoot()
        this.navCtrl.push(MyClassListPage)

      }.bind(this)
    })
  }

  getLimitation(item) {
    let limitation = `学员年级段：${item.bean.caption.gradeMin} ～ ${item.bean.caption.gradeMax}`
    if (item.bean.isUseAge == 1) {
      limitation += `，学员出生介于：${utils.dateFormat(item.bean.ageMin, null)} ~ ${utils.dateFormat(item.bean.ageMax, null)}`
    }
    return limitation
  }

  dateFormat(timestamp, _fmt) {
    return utils.dateFormat(timestamp, _fmt)
  }

}
