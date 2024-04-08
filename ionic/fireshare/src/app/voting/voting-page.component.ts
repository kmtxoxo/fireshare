import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {WebsocketService} from "../service/websocket.service";
import {Track} from "../models/track";
import {AdminComponent} from "../admin/admin.component";
import {Events} from "@ionic/angular";

@Component({
    selector: 'app-voting',
    templateUrl: 'voting-page.component.html',
    styleUrls: ['voting-page.component.scss']
})
export class VotingPage implements OnInit {

    @ViewChild(AdminComponent) adminComponent: AdminComponent;
    ioConnection: any;
    inputTrack: Track;
    tracks: Track[] = [];
    roomnumber: number;
    username: string;
    mode: 'simple' | 'host' = 'simple';
    currentlyPlaying: Track;

    playing: boolean = false;

    constructor(private router: Router, private socketService: WebsocketService,public events: Events,private zone:NgZone) {
        console.log('voting constructor');
        this.events.subscribe('host:updated', (host) => {
            this.mode = this.socketService.getUserModeString();
            console.log('Usermode updated'+this.mode+"."+host);
        });
        this.events.subscribe('track:status', (status) => {
            if(status){
                console.log('Track Subscription: playing');
            }
            else {
                console.log('Track Subscription: paused');
            }
            this.zone.run(() => {
            this.playing = status;});
        });
    }

    ngOnInit(): void {

        this.inputTrack = new Track();
        this.inputTrack.usersVoted = [];
        this.initIoConnection();
        this.initTracklist();
        this.roomnumber = this.socketService.getRoom().roomnumber;
        this.username = this.socketService.getUser().name;
        this.mode = this.socketService.getUserModeString();
    }

    //Footer Player Controls
    play() {
        this.adminComponent.pausePlayTrack();
    }

    next() {
        this.adminComponent.getMostVotedTrack();
    }


    initTracklist() {
        this.socketService.getTracklist();
    }

    onVoteTrackClicked(trackSource) {
        this.socketService.votetrack(trackSource);
    }

    onUnvoteTrackClicked(trackSource) {
        this.socketService.unvotetrack(trackSource);
    }

    private initIoConnection(): void {

        this.ioConnection = this.socketService.onTrackUpdate().subscribe((data) => {
            this.tracks = [];

            for (const track of data.tracks) {
                this.tracks.push(new Track(track));
            }
            this.currentlyPlaying = data.currentlyPlaying;
            if (this.currentlyPlaying !== null)
                console.log('hier:' + this.currentlyPlaying['title']);
        });
    }

    ionViewDidEnter() {
        console.log('visited Voting Page');
        this.events.publish('tab:visited', 'Voting - Room: '+this.roomnumber);
    }
}
