import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { HttpUtilProvider } from '../../providers/http-util'
import CONSTANTS from '../../app/constants'
import utils from '../../common/utils'

/**
 * Generated class for the SigninListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

let baseReq = {}

@Component({
  selector: 'page-signin-list',
  templateUrl: 'signin-list.html',
})
export class SigninListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpUtil: HttpUtilProvider, private loadingCtrl: LoadingController) {
  }

  type = 1

  pageNo: number = 1
  total: number = 0

  list1: any[] = []
  list2: any[] = []

  ionViewDidEnter() {
    baseReq = {
      orgId: localStorage.orgId,
      userId: JSON.parse(localStorage.userInfo)['humanId']
    }
    this.loadList()
  }

  async loadList() {
    const loading = this.loadingCtrl.create({
      content: '正在加载...'
    })
    loading.present()
    if (this.type == 1) {
      const res = await this.httpUtil.post(CONSTANTS['SIGN_LIST_TODAY'], baseReq)
      console.log(res)
      debugger
      this.list1.splice(this.list1.length, 0, ...res['todaySignList'])
    } else {
      const res = await this.httpUtil.post(CONSTANTS['SIGN_LIST_STATISTICS'], Object.assign({ pageNo: this.pageNo }, baseReq))
      console.log(res)
      this.list2.splice(this.list2.length, 0, ...res['rows'])
      this.total = res['total']
    }

    loading.dismiss()
  }

  async loadMore(infiniteScroll) {
    console.log('LOAD MORE...')
    this.pageNo++
    await this.loadList()

    infiniteScroll.complete()
    infiniteScroll.enable(this.list2.length < this.total)
  }

  changeType() {
    if ((this.type == 1 && this.list1.length === 0) || (this.type == 2 && this.list2.length === 0)) {
      this.loadList()
    }
  }

  dateFormat(timestamp) {
    return utils.dateFormat(timestamp, 'YYYY-MM-DD HH:mm:ss')
  }

  get typeName() {
    return this.type == 1 ? '今日点到' : '点到统计'
  }

}
