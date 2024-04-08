import {Component, OnInit, ViewChild} from '@angular/core';
import {Track} from "../models/track";
import {WebsocketService} from "../service/websocket.service";
import {YoutubeComponent} from '../youtube/youtube.component';
import {SoundcloudComponent} from "../soundcloud/soundcloud.component";
import {Events} from "@ionic/angular";
import {MusicControls} from "@ionic-native/music-controls/ngx";
import {UploadedMediaComponent} from "../uploaded-media/uploaded-media.component";

declare var SC;

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

    @ViewChild(YoutubeComponent) youtubeComponent: YoutubeComponent;
    @ViewChild(SoundcloudComponent) soundcloudWidget: SoundcloudComponent;
    @ViewChild(UploadedMediaComponent) mp3Widget: UploadedMediaComponent;

    ioConnection: any;
    mostVotedTrack: Track;
    showSoundcloud: boolean = false;
    showYoutubePlayer: boolean = false;
    playing: boolean = false;
    uploaded: boolean = false;

    constructor(private socketService: WebsocketService, public events: Events, private musicControls: MusicControls) {
    }

    ngOnInit() {
        this.initIoConnection();
        if(window.hasOwnProperty("cordova")) {
            this.initMusicPlayerControls();
        }
    }

    listenOnTrackFinished(e: boolean) {
        if (e === true) {
            this.musicControls.updateIsPlaying(false);
            this.getMostVotedTrack();
        }
    }

    listenOnTrackPlaying(e: boolean) {
        this.playing = e;
        this.events.publish('track:status', this.playing);
        this.musicControls.updateIsPlaying(this.playing);
    }

    getMostVotedTrack() {
        this.socketService.getMostVotedTrack();
    }

    pausePlayTrack() {
        if (this.playing) {
            if (this.showSoundcloud) {
                this.soundcloudWidget.pauseTrack();
            }
            if (this.showYoutubePlayer) {
                this.youtubeComponent.pauseYoutubeVideo();
            }
            if (this.uploaded) {
                this.mp3Widget.pauseTrack();
            }
        } else {
            if (this.showSoundcloud) {
                this.soundcloudWidget.resumeTrack();
            }
            if (this.showYoutubePlayer) {
                this.youtubeComponent.playYoutubeVideo();
            }
            if (this.uploaded) {
                this.mp3Widget.resumeTrack();
            }
        }
    }


    private initIoConnection(): void {

        this.ioConnection = this.socketService.onMostVotedTrack().subscribe((track) => {
            console.log('received most Voted Track: ' + JSON.stringify(track));
            this.mostVotedTrack = track;
            this.updateMusicControlInfo();

            //Play with Soundcloudwidget if it's a soundcloud track
            if (this.mostVotedTrack.source.indexOf('soundcloud') >= 0) {
                this.uploaded = false;
                this.showYoutubePlayer = false;
                console.log('Trying to play Track with Soundcloud');
                if (this.showSoundcloud === true)
                    this.soundcloudWidget.playSoundcloudTrack(this.mostVotedTrack.source);
                else {
                    this.showSoundcloud = true;
                }
            } else if ((this.mostVotedTrack.source.indexOf('https://www.youtube.com/') >= 0
                || this.mostVotedTrack.source.indexOf('http://www.youtube.com/') >= 0
                || this.mostVotedTrack.source.indexOf('https://youtube.com/') >= 0
                || this.mostVotedTrack.source.indexOf('http://youtu.be/') >= 0
                || this.mostVotedTrack.source.indexOf('https://youtu.be/') >= 0
                || this.mostVotedTrack.source.indexOf('http://youtube.com/') >= 0
                || this.mostVotedTrack.source.indexOf('https://music.youtube.com/') >= 0)
            ) {
                this.uploaded = false;
                this.showSoundcloud = false;
                if (this.showYoutubePlayer === true) {
                    this.youtubeComponent.playYoutubeTrack(this.mostVotedTrack.source);
                }
                else {
                    this.showYoutubePlayer = true;
                }
            } else if (this.mostVotedTrack.source.indexOf('filepath::') >= 0) {
                this.showSoundcloud = false;
                this.showYoutubePlayer = false;
                if (this.uploaded === true){
                    this.mp3Widget.playTrack(this.mostVotedTrack)
                } else {
                    this.uploaded = true;
                }
            }
        });
    }

    updateMusicControlInfo() {
        console.log('Notification Playing status:'+this.playing);
        let TrackArtist = this.mostVotedTrack.artist;
        let TrackTitle = this.mostVotedTrack.title;
        if (TrackArtist === null || TrackArtist === undefined) {
            TrackArtist = '';
        }
        if (TrackTitle === null || TrackTitle === undefined) {
            TrackTitle = '';
        }
        this.musicControls.create({
            track: TrackTitle,		// optional, default : ''
            artist: TrackArtist,						// optional, default : ''
            isPlaying: this.playing,							// optional, default : true
            // hide previous/next/close buttons:
            hasPrev: false,		// show previous button, optional, default: true
            hasNext: true,		// show next button, optional, default: true
            hasClose: false,		// show close button, optional, default: false

            // Android only, optional
            // text displayed in the status bar when the notification (and the ticker) are updated

            //All icons default to their built-in android equivalents
            //The supplied drawable name, e.g. 'media_play', is the name of a drawable found under android/res/drawable* folders
            playIcon: 'media_play',
            pauseIcon: 'media_pause',
            prevIcon: 'media_prev',
            nextIcon: 'media_next',
            closeIcon: 'media_close',
            notificationIcon: 'notification'
        });
    }

    initMusicPlayerControls() {
        this.musicControls.subscribe().subscribe((action) => {

            const message = JSON.parse(action).message;
            switch (message) {
                case 'music-controls-next':
                    console.log('next pressed');
                        this.getMostVotedTrack();
                    break;
                case 'music-controls-pause':
                    console.log('Pause pressed');
                    if (this.playing === true) {
                        this.pausePlayTrack();
                        console.log('Notification Playing status:'+this.playing);
                    }
                    break;
                case 'music-controls-play':
                    console.log('Play pressed');
                    if (this.playing === false) {
                        this.pausePlayTrack();
                        console.log('Notification Playing status:'+this.playing);
                    }
                    break;
                default:
                    break;
            }
        });
        this.musicControls.listen(); // activates the observable above
    }
}
