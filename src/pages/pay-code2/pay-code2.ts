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
  selector: 'page-pay-code2',
  templateUrl: 'pay-code2.html',
})
export class PayCodePage2 {
  text: string = ''
  qrImg:string = ''
  orgId:string = localStorage.orgId
  @ViewChild('qrCanvas') qrCanvasRef: ElementRef
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public httpUtil: HttpUtilProvider, public alertCtrl: AlertController, public iab: InAppBrowser) {
    const initData = JSON.parse(localStorage.initData)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayCodePage2',this.navParams.data);
    this.getQr()
  }

  async getQr() {
    const res = await this.httpUtil.post(CONSTANTS['COMMON_PAY'], this.navParams.data)
    console.log(res['pat']);
    // 生成二维码
    if(localStorage.orgId == 'FEAB1A0CA40E4390E0430100007FAD58'){
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
    }else{
      this.qrImg = `http://${localStorage.getItem('host')?localStorage.getItem('host'):'bm.qsng.cn'}/zfzx` + res['pat']
    }
  }
}