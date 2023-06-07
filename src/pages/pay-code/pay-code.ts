import { Component, ElementRef, ViewChild } from '@angular/core';
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
import QRCode from 'qrcode'
declare var cordova: any

@Component({
  selector: 'page-pay-code',
  templateUrl: 'pay-code.html',
})
export class PayCodePage {
  text: string = ''
  @ViewChild('qrCanvas') qrCanvasRef: ElementRef
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public httpUtil: HttpUtilProvider, public alertCtrl: AlertController, public iab: InAppBrowser) {
    const initData = JSON.parse(localStorage.initData)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayCodePage',this.navParams.data);
    this.getQr()
  }

  async getQr() {
    const res = await this.httpUtil.post(CONSTANTS['COMMON_PAY'], this.navParams.data)
    console.log(res['pat']);
    // 生成二维码
    const canvas = this.qrCanvasRef.nativeElement
    QRCode.toCanvas(canvas, res['pat'], {
      margin: 0,
      width: 200,
      color: {
        dark: '000000ff',
        light: '#ffffffff'
      }
    }, function (error) {
      if (error) console.error(error)
      console.log('success!');
    })
  }
}