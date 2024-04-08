import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddTrackPage } from './add-track-page.component';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { UploadSelectorComponent } from '../upload-selector/upload-selector.component';
import { FileDisplayComponent } from '../file-display/file-display.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
      AngularFileUploaderModule,
    RouterModule.forChild([
        {
          path: '',
          component: AddTrackPage
        }
        ])
  ],
  declarations: [AddTrackPage, UploadSelectorComponent, FileDisplayComponent]
})
export class AddTrackPageModule {}
