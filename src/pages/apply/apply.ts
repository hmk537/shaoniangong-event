import moment from 'moment'
import { Component, ViewChild } from '@angular/core'
import { NavController, NavParams, App, ModalController, LoadingController, ViewController, InfiniteScroll, Content } from 'ionic-angular'
import { HttpUtilProvider } from '../../providers/http-util'
import { ClassDetailPage } from '../class-detail/class-detail'
import { MajorSelectPage } from '../major-select/major-select'
import { SettingPage } from '../setting/setting'
import CONSTANTS from '../../app/constants'
import utils from '../../common/utils'
// import CONSTANTS from '../../app/constants'

/**
 * Generated class for the ApplyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-apply',
  templateUrl: 'apply.html',
})
export class ApplyPage {

  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll
  @ViewChild(Content) content: Content
  constructor(public navCtrl: NavController, public navParams: NavParams, public appCtrl: App, public httpUtil: HttpUtilProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public viewCtrl: ViewController) {
  }

  areaList: any = []
  termList: any = []
  majorList: any = []
  timeList: any = []
  yearList: any = []

  query: object = {
    orgId: localStorage.orgId,
    year: -1,
    area: -1,
    term: -1,
    spelId: -1,
    weekDay: -1,
    pageNo: 1,
    pageSize: 10,
    userId: JSON.parse(localStorage.userInfo).humanId
  }

  total: number = 0
  list: object[] = []

  majorName: string = '专业'

  initialized: boolean = false

  filtersTriggerStatus = [0, 0, 0, 0, 0]

  setting = null

  async ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyPage');

    this.setting = JSON.parse(localStorage.initData)['setting']
    const loading = this.loadingCtrl.create({
      content: '正在加载...'
    })
    loading.present()

    this.areaList = await this.httpUtil.queryDict('edu_business_rea', true)
    this.termList = await this.httpUtil.queryDict('edu_term', true)
    this.timeList = await this.httpUtil.queryDict('sys_weekday')

    // this.areaList.unshift({ value: -1, label: '全部' })
    this.termList.unshift({ value: -1, label: '全部' })
    this.timeList.unshift({ value: -1, label: '全部' })

    const currentYear = new Date().getFullYear()
    this.yearList.push(
      ...[
        { label: currentYear - 1 + '年', value: currentYear - 1 },
        { label: currentYear + '年', value: currentYear },
        { label: currentYear + 1 + '年', value: currentYear + 1 }
      ]
    )

    // this.query['area'] = this.areaList[0]['value']
    // this.query['term'] = this.termList[0]['value']
    // console.log(this.setting)
    if (typeof this.setting.year !== 'undefined') {
      this.query['year'] = this.setting.year
    }
    if (typeof this.setting.term !== 'undefined') {
      this.query['term'] = this.setting.term
    }

    await this.queryClass()

    this.initialized = true

    loading.dismiss()
  }

  majorSelect() {
    const selectModal = this.modalCtrl.create(MajorSelectPage, { userId: 123 });
    selectModal.onDidDismiss(data => {
      console.log(data);
      this.query['spelId'] = data.id
      this.majorName = data.name

      this.resetQuery(2)
    });
    selectModal.present();
  }

  async resetQuery(filterIndex) {

    if (this.filtersTriggerStatus[filterIndex] === 0) {
      this.filtersTriggerStatus[filterIndex] = 1
    }

    console.log('RESET QUERY')
    let loading = null
    if (this.initialized) {
      loading = this.loadingCtrl.create({
        content: '正在加载...'
      })
      loading.present()
    }

    this.query['pageNo'] = 1
    this.total = 0
    this.list = []

    await this.queryClass(true)

    if (this.initialized && loading) {
      loading.dismiss()
    }

    this.content.scrollToTop(300)
    this.infiniteScroll.enable(this.list.length < this.total)
  }

  async loadMore(infiniteScroll) {
    console.log('LOAD MORE...')
    this.query['pageNo']++
    const loading = this.loadingCtrl.create({
      content: '正在加载...'
    })
    loading.present()
    await this.queryClass()
    loading.dismiss()

    infiniteScroll.complete()
    infiniteScroll.enable(this.list.length < this.total)
  }

  async queryClass(reset = false) {
    const isNetApply = this.setting.isNetApply
    if (!isNaN(isNetApply) && parseInt(isNetApply) === 1) {
      // 是否开启网上报名
      const query = Object.assign({}, this.query)
      for (let key in query) {
        if (parseInt(query[key]) === -1) {
          delete query[key]
        }
      }
      const res = await this.httpUtil.post(CONSTANTS['CLASS_LIST'], query)
      this.total = res['total']
  
      if (reset) {
        this.list = []
      }
  
      this.list.splice(this.list.length, 0, ...res['rows'])
    }
  }

  goDetail(id) {
    this.appCtrl.getRootNav().push(ClassDetailPage, {
      id
    })
  }

  dateFormat(timestamp, _fmt) {
    const fmt = _fmt || 'YYYY-MM-DD'
    return moment(timestamp).format(fmt)
  }

  getStatus(item) {
    const status = utils.getClassStatus(item)
    return status.statusProperty
  }

  goSetting() {
    this.appCtrl.getRootNav().push(SettingPage, {
      callback: function () {
        this.navCtrl.setRoot(this.navCtrl.getActive().component)
      }.bind(this)
    })
  }

  getLimitation(item) {
    let limitation = `学员年级段：${item.bean.caption.gradeMin} ～ ${item.bean.caption.gradeMax}`
    if (item.bean.isUseAge == 1) {
      limitation = `学员出生介于：${utils.dateFormat(item.bean.ageMin, null)} ~ ${utils.dateFormat(item.bean.ageMax, null)}`
    }
    return limitation
  }

  get areaName() {
    if (this.query['area'] == -1) {
      if (this.filtersTriggerStatus[0] === 0) {
        return '区域'
      } else {
        return '全部'
      }
    } else {
      const area = this.areaList.find(item => item.value === this.query['area'])
      if (area) {
        return area.label
      }
    }
  }

  get termName() {
    if (this.query['term'] == -1) {
      if (this.filtersTriggerStatus[2] === 0) {
        return '学期'
      } else {
        return '全部'
      }
    } else {
      const term = this.termList.find(item => item.value === this.query['term'])
      if (term) {
        return term.label
      }
    }
  }

  get timeName() {
    if (this.query['weekDay'] == -1) {
      if (this.filtersTriggerStatus[4] === 0) {
        return '时间段'
      } else {
        return '全部'
      }
    } else {
      const time = this.timeList.find(item => item.value === this.query['weekDay'])
      if (time) {
        return time.label
      }
    }
  }

  get yearName() {
    if (this.query['year'] == -1) {
      if (this.filtersTriggerStatus[1] === 0) {
        return '年份'
      } else {
        return '全部'
      }
    } else {
      const time = this.yearList.find(item => item.value == this.query['year'])
      if (time) {
        return time.label
      }
    }
  }
}
