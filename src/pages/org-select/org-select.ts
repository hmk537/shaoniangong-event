import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, App, Item } from 'ionic-angular';
import { HttpUtilProvider } from '../../providers/http-util'
import CONSTANTS from '../../app/constants'
import { LoginPage } from '../login/login'

/**
 * Generated class for the OrgSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-org-select',
  templateUrl: 'org-select.html',
})
export class OrgSelectPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpUtil: HttpUtilProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private appCtrl: App) {
  }

  selected = {
    provinceId: -1,
    cityId: -1,
    hideMore: true
  }

  loading: any = null

  from: string = ''
  callback = null

  areaTree = []

  async ionViewDidLoad() {
    console.log('ionViewDidLoad OrgSelectPage');

    this.from = this.navParams.data.from
    this.callback = this.navParams.data.callback

    this.showLoading()
    // await this.queryArea(null)
    await this.queryList()
    this.hideLoading()

    this.locate()
  }

  async queryList() {
    const res: any = await this.httpUtil.post(CONSTANTS['GET_ORG_TREE'], {
      subSystem: 1600
    }, false)
    res.forEach(province => {
      province.childArea.forEach(city => {
        const normalOrgCount = city.orgList.filter(org => org.nature == 1 || org.nature == 2).length
        const moreOrgCount = city.orgList.length - normalOrgCount
        city.hideMore = moreOrgCount > 0 && normalOrgCount > 0
      })
    })
    this.areaTree = res
    this.selected.provinceId = res[0].id
    this.selected.cityId = res[0]['childArea'][0].id
    console.log(res)
  }

  async selectOrg(org) {
    // localStorage.setItem('orgId', CONSTANTS['ORG_ID'])
    // test
    // org.id = '0000e860e1f816b74ec9a06a44f7f7d1758e'

    localStorage.orgId = org.id
    localStorage.org = JSON.stringify(org)

    const loading = this.loadingCtrl.create({
      content: '正在设置...'
    })
    loading.present()

    // 获取机构的一些设置（是否启用身份证等）
    localStorage.settings = JSON.stringify(await this.httpUtil.post(CONSTANTS['GET_SETTINGS'], { orgId: org.id }))
    // 获取机构初始化数据
    localStorage.initData = JSON.stringify((await this.httpUtil.post(CONSTANTS['GET_ORG_INIT_DATA'], { org: org.alias }))['initData'])
    // 获取学校列表
    localStorage.schoolList = JSON.stringify(await this.httpUtil.queryDict('edu_school', true))

    loading.dismiss()

    if (this.from === 'setting') {
      // this.navCtrl.pop()
      this.alertCtrl.create({
        title: '提示',
        subTitle: '机构设置成功!',
        buttons: [{
          text: '确认', handler: () => {
            localStorage.userInfo = null
            const rootNav = this.appCtrl.getRootNav()
            // rootNav.setPages([LoginPage])

            rootNav.setPages([{
              page: LoginPage, params: {
                from: 'exit'
              }
            }])
          }
        }]
      }).present()
    } else {
      this.navCtrl.push(LoginPage)
    }

    this.callback && this.callback()
  }

  getSelectOptions(type) {
    return {
      title: `请选择${type === 'province' ? '省份' : '城市'}`
    }
  }

  showLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: '正在加载...'
      })
      this.loading.present()
    }
  }

  hideLoading() {
    if (this.loading) {
      this.loading.dismiss()
      this.loading = null
    }
  }

  locate() {
    this.httpUtil.get(CONSTANTS['LOCATE_AMAP'], {
      key: 'f16d155dc9ad838e3e99b29b2dac3bb2'
    }).then((res) => {
      const cityCode = res['adcode'],
        cityName = res['city']
      let found = false
      this.areaTree.every(province => {
        // console.log(province.name)
        if (!found) {
          return province['childArea'].every(city => {
            // console.log(`${city.code} - ${cityCode}`)
            // if (city.code.startsWith(cityCode)) {
            if (city.name.indexOf(cityName) > -1 || cityName.indexOf(city.name) > -1) {
              found = true
              this.selected.provinceId = province.id
              this.selected.cityId = city.id
              return false
            } else {
              return true
            }
          })
        } else {
          return false
        }
      })
    })
  }

  showMore() {
    this.selected.hideMore = false
    /* const city = this.cityList.find(c => c.id === this.selected.cityId)
    if (city) {
      city.hideMore = false
      this.selected.hideMore = false
    } */
  }

  get cityList() {
    const province = this.areaTree.find(item => item.id == this.selected.provinceId)
    return province ? province.childArea : []
  }

  get orgList() {
    const city = this.cityList.find(item => item.id == this.selected.cityId)
    return city ? city.orgList : []
  }

  get selectedProvinceName() {
    const province = this.areaTree.find(p => p.id === this.selected.provinceId)
    return province ? province.name : '请选择'
  }

  get selectedCityName() {
    const city = this.cityList.find(c => c.id === this.selected.cityId)
    return city ? city.name : '请选择'
  }

}
