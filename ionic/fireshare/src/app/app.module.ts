import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { YoutubePlayerModule } from 'ngx-youtube-player';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentModule } from './component.module';
import {HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import {MusicControls} from "@ionic-native/music-controls/ngx";

@NgModule({
  declarations: [AppComponent,],
  exports: [],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ComponentModule,HttpClientModule, HttpClientJsonpModule, YoutubePlayerModule],
  providers: [
    StatusBar,
    SplashScreen,
    BackgroundMode,
    MusicControls,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
