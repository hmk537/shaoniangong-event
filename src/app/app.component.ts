import { Component } from '@angular/core';
import { App, Platform, ToastController, Toast, Select, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { AppUpdate } from '@ionic-native/app-update';

import { HttpUtilProvider } from '../providers/http-util'
import CONSTANTS from '../app/constants'

import { TabsPage } from '../pages/tabs/tabs';
import { OrgSelectPage } from '../pages/org-select/org-select'
import { LoginPage } from '../pages/login/login'
import { TermsAlertPage } from '../pages/terms-alert/terms-alert';

// import CONSTANTS from '../app/constants'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = !localStorage.orgId ? OrgSelectPage : (!sessionStorage.usreId ? LoginPage : TabsPage);

  counter: number = 0

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private httpUtil: HttpUtilProvider, private toastCtrl: ToastController, private appCtrl: App, modalCtrl: ModalController) {
    platform.ready().then(async () => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      // statusBar.overlaysWebView(true);

      // this.appUpdate.checkAppUpdate(CONSTANTS['CHECK_VERSION']).then(() => {
      //   console.log('Update available')
      // }).catch(e => {
      //   console.error(e)
      // })

      statusBar.backgroundColorByHexString('#05a2e9');
      splashScreen.hide();

      if (localStorage.org) {
        // 刷新机构设置
        const setting = JSON.parse(localStorage.org)
        localStorage.initData = JSON.stringify((await this.httpUtil.post(CONSTANTS['GET_ORG_INIT_DATA'], { org: setting.alias }))['initData'])
        localStorage.settings = JSON.stringify(await this.httpUtil.post(CONSTANTS['GET_SETTINGS'], { orgId: setting.id }))
      }

      // 双击返回退出app
      platform.registerBackButtonAction(() => {
        console.log('back button pressed')
        // const activeNav = this.appCtrl.getRootNav().getActive()
        // alert(`BACK TAPPED! CAN GO BACK: ${this.appCtrl.getRootNav().canGoBack()}`)

        if (!this.appCtrl.getRootNav().canGoBack()) {
          if (this.counter == 0) {
            this.counter++;
            this.presentToast();
            setTimeout(() => { this.counter = 0 }, 3000)
          } else {
            // console.log("exitapp");
            platform.exitApp();
          }
        } else {
          this.appCtrl.getRootNav().pop()
        }

      }, 0)

      if (!localStorage.privacyAgreed) {
        let termsAlert = modalCtrl.create(TermsAlertPage)
        termsAlert.onDidDismiss(data => {
          if (!localStorage.privacyAgreed) {
            platform.exitApp()
          }
        })
        termsAlert.present()
      }
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: '再按一次返回退出',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}
