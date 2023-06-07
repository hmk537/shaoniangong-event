import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpUtilProvider } from '../../providers/http-util';
import CONSTANTS from '../../app/constants';
import QRCode from 'qrcode'

/**
 * Generated class for the ECertPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-e-cert',
  templateUrl: 'e-cert.html',
})
export class ECertPage {

  margin: number = 0
  logoMargin: number = 5
  logoCornerRadius: number = 4
  dotScale: number = 1
  logoSrc: string = ''
  text: string = ''
  studentName: string = ''
  orgName: string = ''
  year: number = 0
  term: string = ''
  classList: Array<any> = []
  termName: string = ''
  list: Array<any> = []
  userId: string = ''
  available: Boolean = false

  @ViewChild('qrCanvas') qrCanvasRef: ElementRef
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public httpUtil: HttpUtilProvider) {
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad ECertPage');
    const setting = JSON.parse(localStorage.initData).setting
    const org = JSON.parse(localStorage.org)
    const userInfo = JSON.parse(localStorage.userInfo)
    this.text = org.id === '2C9146A12760F52A01276124EFB90016' ? userInfo.userId : userInfo.optUser.cardNo
    this.userId = userInfo.humanId
    this.studentName = userInfo.studName
    this.orgName = org.name
    this.year = setting.year
    this.term = setting.term

    /* const loadingInstance = Loading.service({
      text: '加载中...'
    })
    http.post(CONSTANT.MYCLASSLIST , {
      userId: sessionStorage.studentId,
      year: this.year,
      term: this.term
    }, res => {
      // console.log(res)
      loadingInstance.close()
      this.classList.push(...res.data.rows)
    }) */
    const loading = this.loadingCtrl.create({
      content: '正在加载...'
    })
    loading.present()
    await this.queryList()
    loading.dismiss()
    this.queryTerms()
  }

  async queryList() {
    const res = await this.httpUtil.post(CONSTANTS['MY_CLASS_LIST'], {
      userId: this.userId,
      year: this.year,
      term: this.term
    })
    // console.log(res)
    this.classList.splice(this.list.length, 0, ...res['rows'])
    this.available = this.classList.filter(item => item.apply.status == 3).length > 0

    // 生成二维码
    const canvas = this.qrCanvasRef.nativeElement
    QRCode.toCanvas(canvas, this.text, {
      margin: 0,
      width: 200,
      color: {
        // dark: '#ccccccff',
        dark: this.available ? '#35b57cff' : '#999999ff',
        light: '#ffffffff'
      }
    }, function (error) {
      if (error) console.error(error)
      console.log('success!');
    })
  }

  async queryTerms() {
    const res = Object (await this.httpUtil.post(CONSTANTS['ORG_DICTIONARY'], {
      type: 'edu_term'
    }))
    // console.log(res)
    // console.log(this.term)
    const term = res.find(item => item.value === this.term)
    if (term) {
      this.termName = term.label
    }

    /* http.post(
      CONSTANT.ORGDICTLIST, {
      type: 'edu_term'
    },
      res => {
        const term = res.data.find(item => item.value === this.term)
        if (term) {
          this.termName = term.label
        }
      }
    ) */
  }

  /* get available() {
    return this.classList.filter(item => item.apply.status == 3).length > 0
  } */

}
