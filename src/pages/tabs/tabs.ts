import { Component } from '@angular/core'
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home'
import { EventPage } from '../event/event'
import { ApplyPage } from '../apply/apply'
import { ProfilePage } from '../profile/profile'

import { LoginPage } from '../login/login'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  // tab1Root = ApplyPage;
  tab2Root = EventPage;
  tab3Root = ApplyPage;
  tab4Root = ProfilePage

  constructor(public navCtrl: NavController) {

  }

  ionViewDidEnter() {
    /* if (!sessionStorage.userId) {
      // 未登录，跳到登录页
      this.navCtrl.push(LoginPage)
    } */
  }
}
