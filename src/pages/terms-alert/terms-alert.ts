import { Component } from '@angular/core';
import { App, NavController, Platform, ViewController } from 'ionic-angular';

@Component({
    selector: 'page-terms-alert',
    templateUrl: 'terms-alert.html'
})
export class TermsAlertPage {

    agreed: boolean = false
    constructor(
        public navCtrl: NavController,
        public appCtrl: App,
        public platform: Platform,
        public viewCtrl: ViewController
    ) {
        this.agreed = localStorage.privacyAgreed
    }

    accept() {
        localStorage.privacyAgreed = true
        this.viewCtrl.dismiss()
    }

    reject() {
        this.platform.exitApp()
    }

    back() {
        this.viewCtrl.dismiss()
    }
}
