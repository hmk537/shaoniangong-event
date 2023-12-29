import {
  Component
} from '@angular/core';
import {
  NavController,
  NavParams,
  LoadingController,
  AlertController
} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser'
import {
  HttpUtilProvider
} from '../../providers/http-util'
import CONSTANTS from '../../app/constants'
import utils from '../../common/utils'
import { PayCodePage } from '../pay-code/pay-code'
import { PayCodePage2 } from '../pay-code2/pay-code2'
declare var cordova: any
// declare let Wechat: any
/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public httpUtil: HttpUtilProvider, public alertCtrl: AlertController, public iab: InAppBrowser) {
    const initData = JSON.parse(localStorage.initData)
    this.alipayEnable = initData['setting']['alipayFees'] == 1
    this.wechatpayEnable = initData['setting']['wechatFees'] == 1
  }

  paymentInfo = null
  paymentSuccessCallback = null
  queryInfo = null

  alipayEnable = false
  wechatpayEnable = false

  paymentTriggered = false // 是否触发支付跳转

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
    const paymentInfo = this.navParams.data.paymentInfo
    if (paymentInfo) {
      this.paymentInfo = paymentInfo
    }

    this.paymentInfo = this.navParams.data.paymentInfo || {}
    this.paymentSuccessCallback = this.navParams.data.paymentSuccessCallback

    console.log(this.paymentInfo)
    this.getQuery()
  }

  async pay(channel) {
    /* this.navCtrl.pop()
    this.paymentSuccessCallback() */

    /* const loading = this.loadingCtrl.create({
      content: '正在加载...'
    })
    loading.present() */
    if (channel === 'wechat') {
      /*try {
        const res = await this.httpUtil.post(CONSTANTS['WECHAT_APP_PAY'], {
          reserveNo: this.paymentInfo['reserveNo'],
          orgId: this.paymentInfo['orgId']
        })
        const params = {
          // appid: res['appId'],
          // appid: 'wx10f127f9edd5e26a',
          partnerid: res['partnerid'],
          prepayid: res['prepayid'],
          noncestr: res['nonceStr'],
          timestamp: res['timeStamp'],
          // timestamp: '1557099704',
          sign: res['sign']
        }
        console.log(params)
        Wechat.sendPaymentRequest(params, () => {
          this.navCtrl.pop()
          this.paymentSuccessCallback()
          loading.dismiss()
        }, error => {
          console.log(error)
          loading.dismiss()
        })
      } catch (e) {
        loading.dismiss()
      }*/
    } else if (channel === 'alipay') {
      /* try {
        const res = await this.httpUtil.post(CONSTANTS['ALIPAY_APP_PAY'], {
          reserveNo: this.paymentInfo['reserveNo'],
          orgId: this.paymentInfo['orgId']
        })
        console.log(res)
        cordova.plugins.alipay.payment(String(res), (result) => {
          // 支付成功
          console.log(result)
          // 成功
          this.navCtrl.pop()
          this.paymentSuccessCallback()
          loading.dismiss()
        }, (error) => {
          // 支付失败
          console.log("支付失败" + error.resultStatus);
          console.log(error)
          loading.dismiss()
        });
      } catch (e) {
        loading.dismiss()
      } */

      this.paymentTriggered = true
      const redirectUrl = `https://ds.alipay.com/?scheme=${encodeURIComponent(`alipays://platformapi/startapp?appId=2018020902165761&page=pages/payment/alipay&query=${encodeURIComponent(`reserveNo=${this.paymentInfo['reserveNo']}&orgId=${this.paymentInfo['orgId']}`)}`)}`
      console.log(redirectUrl)
      // window.open(redirectUrl, '_system', 'location=yes')
      this.iab.create(redirectUrl, '_system', 'location=yes')
    }
  }
  goPayCode(){
    this.navCtrl.push(PayCodePage,{
      reserveNo:this.paymentInfo.reserveNo,
      userName:this.queryInfo.student.name,
      userId:this.queryInfo.student.mobile,
      payType:'57',
      returnUrl:`https://www.qsnedu.com/eduback/api/public/fund/zfzx/payNotify/class/${this.queryInfo.pay.paySerial}`
    })
  }
  goPayCode2(){
    this.navCtrl.push(PayCodePage2,{
      reserveNo:this.paymentInfo.reserveNo,
      userName:this.queryInfo.student.name,
      userId:this.queryInfo.student.mobile,
      payType:'57',
      returnUrl:`https://www.qsnedu.com/eduback/api/public/fund/zfzx/payNotify/class/${this.queryInfo.pay.paySerial}`
    })
  }
  async getQuery(){
    const res = await this.httpUtil.post(CONSTANTS['RESERVE_DETAIL'], {
      reserveNo: this.paymentInfo['reserveNo']
    })
    this.queryInfo = res
  }

  async checkPayment () {
    const loading = this.loadingCtrl.create({
      content: '正在加载...'
    })
    loading.present()
    const res = await this.httpUtil.post(CONSTANTS['RESERVE_DETAIL'], {
      reserveNo: this.paymentInfo['reserveNo']
    })
    loading.dismiss()
    if (res['apply']['status'] == '3') {
      this.navCtrl.pop()
      this.paymentSuccessCallback()
    } else {
      this.alertCtrl.create({
        title: '提示',
        subTitle: '支付未完成',
        buttons: [{
          text: '确认', handler: () => {
            this.paymentTriggered = false
          }
        }]
      }).present()
    }
  }

  dateFormat(timestamp, _fmt) {
    return utils.dateFormat(timestamp, _fmt)
  }

}