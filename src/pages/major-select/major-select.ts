import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { HttpUtilProvider } from '../../providers/http-util'
import CONSTANTS from '../../app/constants'

/**
 * Generated class for the MajorSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-major-select',
  templateUrl: 'major-select.html',
})
export class MajorSelectPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpUtil: HttpUtilProvider, public loadingCtrl: LoadingController, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MajorSelectPage');
    this.loadTreeBranch(null)

    // console.log(this.navParams.data.userId)
  }

  majorTree: object[] = []

  async toggleBranchExpand(parentId) {
    if (parseInt(parentId) !== -1) {
      const major = this.majorTree.find(m => m['id'] === parentId)
      if (!major['expanded']) {
        await this.loadTreeBranch(parentId)
        major['expanded'] = true
      } else {
        major['expanded'] = false
      }
    } else {
      this.selectMajor({
        id: -1,
        name: '全部'
      })
    }
  }

  async loadTreeBranch(parentId) {
    const loading = this.loadingCtrl.create({
      content: '正在加载...'
    })
    loading.present()
    const url = CONSTANTS['MAJOR_LIST'],
      req = {
        orgId: localStorage.orgId
      }
    if (!parentId) {
      req['type'] = 0
      this.majorTree = <object[]>await this.httpUtil.post(url, req)
      this.majorTree.unshift({ id: -1, name: '全部' })
    } else {
      const parentMajor = this.majorTree.find(m => m['id'] === parentId)
      if (typeof parentMajor['children'] === 'undefined') {
        Object.assign(req, {
          type: 1,
          parentId: parentId
        })
        parentMajor['children'] = <object[]>await this.httpUtil.post(url, req)
      }
    }
    loading.dismiss()
  }

  selectMajor(major) {
    this.viewCtrl.dismiss({
      id: major.id,
      name: major.name
    })
  }

}
