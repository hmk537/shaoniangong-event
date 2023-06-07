import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpUtilProvider } from '../../providers/http-util'
import CONSTANTS from '../../app/constants'
import utils from '../../common/utils'
import { MyClassDetailPage } from '../my-class-detail/my-class-detail'

/**
 * Generated class for the MyClassListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-class-list',
  templateUrl: 'my-class-list.html',
})
export class MyClassListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public httpUtil: HttpUtilProvider) {
  }

  list: object[] = []
  total: number = 0
  query: object = {
    orgId: localStorage.orgId,
    // status: [1, 2, 3, 6, 0],
    userId: JSON.parse(localStorage.userInfo)['humanId'],
    pageNo: 1,
    pageSize: 10
  }

  async ionViewDidEnter() {
    console.log('ionViewDidLoad MyClassListPage');

    this.list = []
    this.total = 0
    this.query['pageNo'] = 1

    const loading = this.loadingCtrl.create({
      content: '正在加载...'
    })
    loading.present()
    await this.queryList()
    loading.dismiss()
  }

  async queryList() {
    const res = await this.httpUtil.post(CONSTANTS['MY_CLASS_LIST'], this.query)
    this.total = res['total']
    this.list.splice(this.list.length, 0, ...res['rows'])
  }

  async loadMore(infiniteScroll) {
    console.log('LOAD MORE...')
    this.query['pageNo']++
    const loading = this.loadingCtrl.create({
      content: '正在加载...'
    })
    loading.present()
    await this.queryList()
    loading.dismiss()

    infiniteScroll.complete()
    infiniteScroll.enable(this.list.length < this.total)
  }

  getStatusName(id) {
    const status = CONSTANTS['STATUS_MAP'].find(obj => obj.code == id)
    return status ? status.name : ''
  }

  dateFormat(timestamp, _fmt) {
    return utils.dateFormat(timestamp, _fmt)
  }

  getStatus(item) {
    const status = utils.getClassStatus(item)
    return status.statusProperty
  }

  goDetail(item) {
    this.navCtrl.push(MyClassDetailPage, item)
  }

}
