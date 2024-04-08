import {NgModule} from '@angular/core';
import { AdminComponent } from './admin/admin.component';
import { SoundcloudComponent } from './soundcloud/soundcloud.component';
import {CommonModule } from '@angular/common';
import  {YoutubeComponent} from './youtube/youtube.component';
import { UploadedMediaComponent } from './uploaded-media/uploaded-media.component';

@NgModule({
    declarations: [AdminComponent, SoundcloudComponent, YoutubeComponent, UploadedMediaComponent],
    imports: [CommonModule],
    exports: [AdminComponent, SoundcloudComponent, YoutubeComponent],
})
export class ComponentModule {}
