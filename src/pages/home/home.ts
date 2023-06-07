import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { MyClassListPage } from '../my-class-list/my-class-list'
import { ApplySuccessPage } from '../apply-success/apply-success'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public appCtrl: App, public navCtrl: NavController) {

  }

  ionViewDidEnter() {
  }

  goPage(pageName) {
    switch (pageName) {
      case 'myClass':
        this.appCtrl.getRootNav().push(MyClassListPage)
        /* this.appCtrl.getRootNav().push(ApplySuccessPage, {
          applyId: '0000c2afc6a96dcb414aa5f328a561b5d23e'
        }) */
    }
  }

}
