import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, Searchbar, Platform } from 'ionic-angular';
import { HttpUtilProvider } from '../../providers/http-util'

/**
 * Generated class for the SchoolPickerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-school-picker',
  templateUrl: 'school-picker.html',
})
export class SchoolPickerPage {

  list: any = []
  keyword: string = ''

  unregisterBackButtonAction: Function = null

  @ViewChild('searchbar') searchbar: Searchbar
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public httpUtil: HttpUtilProvider, public viewCtrl: ViewController, platform: Platform) {
    this.unregisterBackButtonAction = platform.registerBackButtonAction(() => {
      console.log('back pressed')
      this.setName('')
    }, 1)
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad SchoolPickerPage')
    this.keyword = this.navParams.get('keyword')
    if (localStorage.schoolList) {
      this.list = JSON.parse(localStorage.schoolList)
    } else {
      const loading = this.loadingCtrl.create({
        content: '正在加载...'
      })
      loading.present()
      const schoolList = await this.httpUtil.queryDict('edu_school', true)
      localStorage.schoolList = JSON.stringify(schoolList)
      this.list = schoolList
      loading.dismiss()
    }
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.searchbar.setFocus()
    }, 10)
  }

  getItems(ev) {
    // console.log(ev)
    this.keyword = ev.target.value
  }

  setName(name) {
    this.unregisterBackButtonAction && this.unregisterBackButtonAction()
    this.viewCtrl.dismiss({
      name
    })
  }

  get matchedList() {
    if (this.keyword) {
      const filteredList = this.list.filter(item => item.label.indexOf(this.keyword || '') > -1)
      if (this.list.findIndex(item => item.label === this.keyword.trim()) > -1) {
        return filteredList
      } else {
        return [{
          id: -1,
          label: this.keyword
        }].concat(filteredList)
      }
    } else {
      return this.list
    }
  }

}
