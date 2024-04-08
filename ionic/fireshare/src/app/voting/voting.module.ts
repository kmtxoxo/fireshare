import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VotingPage } from './voting-page.component';

import {ComponentModule} from '../component.module';

@NgModule({
  imports: [
      ComponentModule,
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: VotingPage }])
  ],
  declarations: [VotingPage]
})
export class VotingPageModule {}
