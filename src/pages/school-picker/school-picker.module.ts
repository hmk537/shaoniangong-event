import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SchoolPickerPage } from './school-picker';

@NgModule({
  declarations: [
    SchoolPickerPage,
  ],
  imports: [
    IonicPageModule.forChild(SchoolPickerPage),
  ],
})
export class SchoolPickerPageModule {}
