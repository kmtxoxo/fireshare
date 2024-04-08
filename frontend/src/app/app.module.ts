import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {VotingComponent} from './voting/voting.component';
import {HomeComponent} from './home/home.component';
import {ChatComponent} from './chat/chat.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import { SoundcloudWidgetComponent } from './soundcloud-widget/soundcloud-widget.component';
import { AdminControlComponent } from './admin-control/admin-control.component';
@NgModule({
  declarations: [
    AppComponent,
    VotingComponent,
    HomeComponent,
    ChatComponent,
    SoundcloudWidgetComponent,
    AdminControlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
}
