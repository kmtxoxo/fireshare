import {Component, OnInit, Input, Output, EventEmitter,} from '@angular/core';
import {Track} from '../models/track';
import {YoutubeService} from '../service/youtube.service';



@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss']
})
export class YoutubeComponent implements OnInit {

  @Input('mostVotedTrack') mostVotedTrack: Track;
  @Output() videoChangeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() pauseEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private youtubeService : YoutubeService) { }

  player: any;

  ngOnInit() {
    this.initYoutubePlayer(this.mostVotedTrack.source);
  }

  async initYoutubePlayer(url) {
      let interval = setInterval(() => {
        if ((typeof YT !== 'undefined') && YT && YT.Player) {
          this.player = new YT.Player('youtube', {
            // @ts-ignore
            height: '15%',
            // @ts-ignore
            width: '100%',
            html5: 0,
            videoId: this.youtubeService.getYoutubeID(url),
            playerVars: {
              controls: 2,
              showinfo: 0,
              autohide: 1,
              modestbranding: 1,
              },
            events: {
              onStateChange: (ev) => {
                this.onPlayerStateChange(ev);
              },
              onReady: () => {
                this.onPlayerReady();
              },
            }
          });
          clearInterval(interval);
        }
      }, 100);
  }

  onPlayerReady(){
    this.playYoutubeVideo();
  }

  playYoutubeVideo(){
    this.player.playVideo();
  }

  pauseYoutubeVideo() {
        this.player.pauseVideo();
  }

  onPlayerStateChange(event: any){
    switch (event.data) {
      case YT.PlayerState.UNSTARTED:
        console.log('unstarted');
        this.playYoutubeVideo();
        break;
      case YT.PlayerState.ENDED:
        console.log('ended');
        this.videoChangeEvent.emit(true);
        this.pauseEvent.emit(false);
        break;
      case YT.PlayerState.PLAYING:
        this.pauseEvent.emit(true);
        console.log('playing');
        break;
      case YT.PlayerState.PAUSED:
        this.pauseEvent.emit(false);
        console.log('paused');
        break;
      case YT.PlayerState.BUFFERING:
        console.log('buffering');
        break;
      case YT.PlayerState.CUED:
        console.log('video cued');
        break;
    }

  }

  async playYoutubeTrack(url){
    this.player.loadVideoById(this.youtubeService.getYoutubeID(url));
  }
}
