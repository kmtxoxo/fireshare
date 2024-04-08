import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Track} from "../models/track";
declare var SC;
@Component({
    selector: 'app-soundcloud',
    templateUrl: './soundcloud.component.html',
    styleUrls: ['./soundcloud.component.scss']
})
export class SoundcloudComponent implements OnInit, AfterViewInit {

    constructor() {}

    @Input() mostVotedTrack: Track;
    @Output() talk: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() pauseEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    ngOnInit() {
    }

    ngAfterViewInit() {
        console.log('rendered SoundcloudWidget :)');
        this.initSoundcloudWidget();
        this.playSoundcloudTrack(this.mostVotedTrack.source);
    }

    onTrackPlaying(e: boolean) {
        this.pauseEvent.emit(e);
    }

    onTrackFinished() {
        console.log('Track finished');
        this.talk.emit(true);
    }

    initSoundcloudWidget() {
        let self = this;
        let widget = window['SC'].Widget('sc-widget');

        widget.bind(SC.Widget.Events.READY, function () {
            widget.bind(SC.Widget.Events.FINISH, function () {
                //play next track
                self.onTrackFinished();
            });
            widget.bind(SC.Widget.Events.PLAY, function () {
                //play next track
                self.onTrackPlaying(true);
            });
            widget.bind(SC.Widget.Events.PAUSE, function () {
                //play next track
                self.onTrackPlaying(false);
            });

            // set new volume level
            widget.setVolume(100);
            console.log('Player ist ready :)');
        });
    }

    callback: any = () => {
        console.log("done");
        let widget = window['SC'].Widget('sc-widget');
        widget.play();
    };

    playSoundcloudTrack(url) {
        //Play funktion from Soundcloud Widget
        console.log('playSoundcloudTrack function');
        let widget = window['SC'].Widget('sc-widget');
        widget.load(url, {'auto_play': false, 'callback': this.callback});
    }

    pauseTrack() {
        let widget = window['SC'].Widget('sc-widget');
        widget.pause();
    }

    resumeTrack() {
        let widget = window['SC'].Widget('sc-widget');
        widget.play();
    }
}
