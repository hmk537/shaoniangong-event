import { Component } from '@angular/core';
import { NavController, NavParams, App, LoadingController, AlertController } from 'ionic-angular';
import { HttpUtilProvider } from '../../providers/http-util'
import CONSTANTS from '../../app/constants'
import utils from '../../common/utils'

import { ApplySuccessPage } from '../apply-success/apply-success';
import { MyClassListPage } from '../my-class-list/my-class-list'
import { ContractPage } from '../contract/contract'

/**
 * Generated class for the ClassDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-class-detail',
  templateUrl: 'class-detail.html',
})
export class ClassDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public appCtrl: App, public httpUtil: HttpUtilProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    console.log(navParams.data.id)
  }

  detail: object = null

  canApply = true
  statusProperty = ''
  statusHighlight = true

  agreementChecked = false

  async ionViewDidLoad() {
    console.log('ionViewDidLoad ClassDetailPage');
    const loading = this.loadingCtrl.create({
      content: '正在加载...'
    })
    loading.present()

    try {
      this.detail = await this.httpUtil.post(CONSTANTS['CLASS_DETAIL'], { id: this.navParams.data.id })
      console.log(this.detail)
      // this.processStatus()

      const status = utils.getClassStatus(this.detail)
      this.canApply = status.canApply
      this.statusProperty = status.statusProperty
      this.statusHighlight = status.highlight

      loading.dismiss()
    } catch (e) {
      this.alertCtrl.create({
        title: '提示',
        subTitle: e,
        buttons: [{
          text: '确认', handler: () => {
            loading.dismiss()
            this.navCtrl.pop()
          }
        }]
      }).present()
    }
  }

  async applyNow(classId) {
    // this.navCtrl.popToRoot()
    // this.navCtrl.push(MyClassListPage)

    if (!this.agreementChecked) {
      this.alertCtrl.create({
        title: '提示',
        subTitle: '请勾选同意协议！',
        buttons: [{
          text: '确认', handler: () => {
            // loading.dismiss()
          }
        }]
      }).present()
      return
    }

    if (this.canApply) {
      const loading = this.loadingCtrl.create({
        content: '正在报名...'
      })
      loading.present()
      try {
        const setId = JSON.parse(localStorage.initData)['setting']['id'],
          userId = JSON.parse(localStorage.userInfo)['humanId'],
          orgId = localStorage.orgId

        const res = await this.httpUtil.post(CONSTANTS['APPLY_ONLINE'], { classId, setId, userId, orgId, applyType: 3 })
        loading.dismiss()
        console.log(res)
        if (res['reserveNo']) {
          this.detail['bean']['reserveNo'] = res['reserveNo']
          this.detail['bean']['deadLine'] = res['deadLine']
          this.detail['bean']['status'] = res['status']
          this.navCtrl.push(ApplySuccessPage, this.detail)
        } else {
          throw null
        }
      } catch (e) {
        const msg = typeof e === 'string' ? e : '出错啦！'
        this.alertCtrl.create({
          title: '提示',
          subTitle: msg,
          buttons: [{
            text: '确认', handler: () => {
              loading.dismiss()
            }
          }]
        }).present()
      }
    }
  }

  openContract() {
    this.navCtrl.push(ContractPage)
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

  getStatusName(id) {
    const status = CONSTANTS['STATUS_MAP'].find(obj => obj.code == id)
    return status ? status.name : ''
  }

}
