import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HttpUtilProvider } from '../providers/http-util';

import { SafeHtmlPipe } from '../pipes/safe-html/safe-html'

import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { EventPage } from '../pages/event/event';
import { ApplyPage } from '../pages/apply/apply';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ClassDetailPage } from '../pages/class-detail/class-detail';
import { ApplySuccessPage } from '../pages/apply-success/apply-success';
import { OrgSelectPage } from '../pages/org-select/org-select'
import { PersonalInfoPage } from '../pages/personal-info/personal-info'
import { MajorSelectPage } from '../pages/major-select/major-select'
import { MyClassListPage } from '../pages/my-class-list/my-class-list'
import { MyClassDetailPage } from '../pages/my-class-detail/my-class-detail'
import { PayCodePage } from '../pages/pay-code/pay-code'
import { PayCodePage2 } from '../pages/pay-code2/pay-code2'
import { AboutPage } from '../pages/about/about'
import { PaymentPage } from '../pages/payment/payment'
import { SettingPage } from '../pages/setting/setting'
import { SigninListPage } from '../pages/signin-list/signin-list'
import { ContractPage } from '../pages/contract/contract'
import { SchoolPickerPage } from '../pages/school-picker/school-picker'

import { AppUpdate } from '@ionic-native/app-update';
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { DatePicker } from '@ionic-native/date-picker'
import { InAppBrowser } from '@ionic-native/in-app-browser'
import { ECertPage } from '../pages/e-cert/e-cert';
import { TermsAlertPage } from '../pages/terms-alert/terms-alert';

@NgModule({
  declarations: [
    MyApp,
    EventPage,
    ApplyPage,
    ProfilePage,
    HomePage,
    TabsPage,
    ClassDetailPage,
    ApplySuccessPage,
    LoginPage,
    RegisterPage,
    OrgSelectPage,
    PersonalInfoPage,
    MajorSelectPage,
    MyClassListPage,
    MyClassDetailPage,
    PayCodePage,
    PayCodePage2,
    AboutPage,
    PaymentPage,
    SettingPage,
    SigninListPage,
    ContractPage,
    SchoolPickerPage,
    ECertPage,
    TermsAlertPage,

    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      swipeBackEnabled: true
    }),
    HttpModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EventPage,
    ApplyPage,
    ProfilePage,
    HomePage,
    TabsPage,
    ClassDetailPage,
    ApplySuccessPage,
    LoginPage,
    RegisterPage,
    OrgSelectPage,
    PersonalInfoPage,
    MajorSelectPage,
    MyClassListPage,
    MyClassDetailPage,
    PayCodePage,
    PayCodePage2,
    AboutPage,
    PaymentPage,
    SettingPage,
    SigninListPage,
    ContractPage,
    SchoolPickerPage,
    ECertPage,
    TermsAlertPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    HttpUtilProvider,
    DatePicker,
    InAppBrowser,
    AppUpdate
  ]
})
export class AppModule { }
