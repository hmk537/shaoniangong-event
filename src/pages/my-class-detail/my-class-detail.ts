import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { HttpUtilProvider } from '../../providers/http-util'
import CONSTANTS from '../../app/constants'
import utils from '../../common/utils'

import { PaymentPage } from '../payment/payment'

/**
 * Generated class for the MyClassDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-class-detail',
  templateUrl: 'my-class-detail.html',
})
export class MyClassDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public httpUtil: HttpUtilProvider, private alertCtrl: AlertController) {
  }

  applyInfo = null

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyClassDetailPage');
    // console.log(this.navParams.data)

    this.applyInfo = this.navParams.data.apply
    console.log(this.applyInfo)
  }

  async ionViewDidEnter() {
    console.log('did enter')
    const loading = this.loadingCtrl.create({
      content: '正在加载...'
    })
    loading.present()
    try {
      const res = await this.httpUtil.post(CONSTANTS['RESERVE_DETAIL'], {
        reserveNo: this.navParams.data.apply['reserveNo']
      })
      console.log(res)
      // 获取最新状态
      this.applyInfo.status = res['apply']['status']
      loading.dismiss()
    } catch (e) {
      loading.dismiss()
    }
  }

  getStatusName(id) {
    const status = CONSTANTS['STATUS_MAP'].find(obj => obj.code == id)
    return status ? status.name : ''
  }

  dateFormat(timestamp, _fmt) {
    return utils.dateFormat(timestamp, _fmt)
  }

  async pay() {
    this.navCtrl.push(PaymentPage, {
      paymentInfo: {
        area: this.applyInfo['caption']['area'],
        classCode: this.applyInfo['iclass']['code'],
        year: this.applyInfo['year'],
        term: this.applyInfo['caption']['term'],
        major: this.applyInfo['specialty']['name'],
        class: this.applyInfo['iclass']['name'],
        majorDegree: this.applyInfo['iclass']['degree'],
        totalFee: this.applyInfo['iclass']['totalFee'],

        reserveNo: this.applyInfo['reserveNo'],
        orgId: this.applyInfo['orgId'],
        deadLine: this.applyInfo['deadLine'],
        enrollType: this.applyInfo['status'] == 0
      },
      paymentSuccessCallback: function () {
        this.applyInfo.status = '3'
      }.bind(this)
    })
  }

  async cancel() {
    this.alertCtrl.create({
      title: '提示',
      message: '是否确认撤销？',
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
        content: '正在撤销...'
      })
      loading.present()
      const res = await this.httpUtil.post(CONSTANTS['CANCEL_APPLY'], {
        applyId: this.applyInfo['id'],
        userId: JSON.parse(localStorage.userInfo)['humanId']
      })
      if (res['successNum'] > 0) {
        loading.dismiss()
        this.alertCtrl.create({
          title: '提示',
          subTitle: '已撤销',
          buttons: [{
            text: '确认', handler: () => {
              this.navCtrl.pop()
            }
          }]
        }).present()
      } else {
        loading.dismiss()
      }
    }
  }

}
