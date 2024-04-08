import {Component, OnInit} from '@angular/core';
import {Track} from "../models/track";
import {HttpClient} from "@angular/common/http";
import {WebsocketService} from "../service/websocket.service";

declare var SC;

@Component({
  selector: 'app-admin-control',
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.css']
})
export class AdminControlComponent implements OnInit {

  ioConnection: any;
  mostVotedTrack: Track;
  showSoundcloud: boolean = false;

  constructor(private httpClient: HttpClient, private socketService: WebsocketService) {
  }

  ngOnInit() {
    this.initIoConnection();
  }

  listenSoundcloudWidgetRendered(e: boolean) {
    if (e === true) {
      console.log('Hey got an Answer from Soundcloud Widget');
      this.initSoundcloudWidget();
      this.playSoundcloudTrack(this.mostVotedTrack.source);
    }
  }

  initSoundcloudWidget() {

    //----Soundcloud Widget init
    // this.widget = window['SC'].Widget('sc-widget'); not working properly
    //if (this.widget != null) {
    var self = this;
    window['SC'].Widget('sc-widget').bind(SC.Widget.Events.READY, function () {
      window['SC'].Widget('sc-widget').bind(SC.Widget.Events.FINISH, function () {
        //play next track
        self.getMostVotedTrack();
      });

      // set new volume level
      window['SC'].Widget('sc-widget').setVolume(100);
      console.log('Player ist ready :)');
    });
    //}
  }

  getMostVotedTrack() {
    this.socketService.getMostVotedTrack();
  }

  private initIoConnection(): void {

    this.ioConnection = this.socketService.onMostVotedTrack().subscribe((track) => {
      console.log('received most Voted Track: ' + JSON.stringify(track));
      this.mostVotedTrack = track;

      //Play with Soundcloudwidget if it's a soundcloud track
      if (this.mostVotedTrack.source.indexOf('soundcloud') >= 0) {
        console.log('Trying to play Track with Soundcloud');
        if (this.showSoundcloud === true)
          this.playSoundcloudTrack(this.mostVotedTrack.source);
        else
          this.showSoundcloud = true;
      } else if (this.mostVotedTrack.source.indexOf('youtube') >= 0) {
        this.showSoundcloud = false;
      } else if (this.mostVotedTrack.source.indexOf('./filepath') >= 0) {
        this.showSoundcloud = false;
      }

    });
  }

  playSoundcloudTrack(url) {
    //Play funktion from Soundcloud Widget
    window['SC'].Widget('sc-widget').load(url, {'auto_play': true});
    // this.widget.play();
  }

}
