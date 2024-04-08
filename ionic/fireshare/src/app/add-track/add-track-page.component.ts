import {Component, OnInit} from '@angular/core';
import {Track} from '../models/track';
import {Router} from '@angular/router';
import {WebsocketService} from '../service/websocket.service';
import {UploadService} from "../service/upload.service";
import {SoundcloudService} from "../service/soundcloud.service";
import {ShareIntentService} from "../service/share-intent.service";
import {Events} from "@ionic/angular";
import {ToastController} from "@ionic/angular";
import {YoutubeService} from '../service/youtube.service';
@Component({
    selector: 'app-addTrack',
    templateUrl: 'add-track-page.component.html',
    styleUrls: ['add-track-page.component.scss']
})
export class AddTrackPage implements OnInit {

    ioConnection: any;
    inputTrack: Track = new Track();
    tracks: Track[] = [];
    roomnumber: number;
    username: string;
    mode: 'url' | 'mp3' = 'url';
    soundcloudTrack: boolean = false;
    youtubeVideoID : string;

    tempVideos = [];
    fileToUpload: File = null;
    knownFiles: string[];

    constructor(private router: Router,
                private socketService: WebsocketService,
                private uploadService: UploadService,
                private thumbnailService: SoundcloudService,
                private shareIntentService: ShareIntentService,
                private toastCtrl: ToastController,
                private youtubeService: YoutubeService,
                public events: Events) {

        this.init();
        this.events.subscribe('track:importReceived', () => {
            this.inputTrack.source = this.shareIntentService.getSongUrl();
            this.addTrackInfo(this.inputTrack.source);
            console.log('Track received from Share Intent, added to URL input Field');
        });
    }

    ngOnInit(): void {
        this.initIoConnection();
        this.uploadService.getExisting().subscribe(suc => {
            this.knownFiles = suc
        }, err => {
            console.log(err);
            this.knownFiles = [];
        });
    }

    init() {
        this.inputTrack = new Track();
        this.inputTrack.usersVoted = [];
        this.fileToUpload = null;
        this.inputTrack.thumbnail = "http://dalelyles.com/musicmp3s/no_cover.jpg";
    }

    addTrackClicked() {
        if (this.inputTrack.source === undefined) {
            this.failedUploadToast("Please Enter an URL !");
        }
        else if (this.inputTrack.source.length > 0 && (this.inputTrack.source.indexOf('https://soundcloud.com/') != -1
            || this.inputTrack.source.indexOf('filepath::') != -1
            || this.inputTrack.source.indexOf('https://www.youtube.com/') != -1
            || this.inputTrack.source.indexOf('https://youtube.com/') != -1
            || this.inputTrack.source.indexOf('http://youtu.be/') != -1
            || this.inputTrack.source.indexOf('https://youtu.be/') != -1
            || this.inputTrack.source.indexOf('http://youtube.com/') != -1
            || this.inputTrack.source.indexOf('http://www.youtube.com/') != -1
            || this.inputTrack.source.indexOf('https://music.youtube.com/') != -1)
        ) {

            if (this.soundcloudTrack && this.mode === 'url') {
                this.setThumbnail(this.inputTrack);
            }
            else {
                this.socketService.addtrack(this.inputTrack);
                this.failedUploadToast("Track successful added !");
            }
        } else {
            this.failedUploadToast("Please Enter an valid URL !");
        }
    }

    addTrackInfo(url:string) {
        console.log('url added '+url);
        // console.log('url added');
        // let url = this.inputTrack.source;
        if (url.indexOf('https://soundcloud.com/') != -1) {
            const titleIndex = url.lastIndexOf('/');
            let title = url.substr(titleIndex + 1);
            url = url.substr(0, titleIndex);

            const IndexArtist = url.lastIndexOf('/') + 1;
            let artist = url.substr(IndexArtist);

            title = this.replaceAll(title, '-', ' ');
            artist = this.replaceAll(artist, '-', ' ');

            this.inputTrack.artist = artist;
            this.inputTrack.title = title;
            this.soundcloudTrack = true;
        }
        else if (url.length > 0 && ( this.inputTrack.source.indexOf('https://www.youtube.com/') != -1
            || this.inputTrack.source.indexOf('https://youtube.com/') != -1
            || this.inputTrack.source.indexOf('http://youtu.be/') != -1
            || this.inputTrack.source.indexOf('https://youtu.be/') != -1
            || this.inputTrack.source.indexOf('http://youtube.com/') != -1
            || this.inputTrack.source.indexOf('http://www.youtube.com/') != -1
            || this.inputTrack.source.indexOf('https://music.youtube.com/') != -1)
        ) {

            this.getYoutubethumbnail(this.youtubeService.getYoutubeID(url));
        }
        else {
            this.soundcloudTrack = false;
        }


    }

    async getYoutubethumbnail(id){
        await this.youtubeService.getYoutubeVideoInormationbyID(id).then((data) =>{
            this.inputTrack.title = data['items'][0]['snippet']['title'];
            this.inputTrack.thumbnail = data['items'][0]['snippet']['thumbnails']['default']['url'];
        })
    }

    segmentChanged(ev: any) {
        if (ev.detail.value === 'MP3') {
            this.mode = 'mp3';
            this.tempVideos =[];
        }

        if (ev.detail.value === 'URL') {
            this.mode = 'url';
        }

    }


    replaceAll(str: string, find: string, replace: string) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    private initIoConnection(): void {
        this.ioConnection = this.socketService.onTrackAddError().subscribe((error) => {
            console.log(error['error']);
            this.failedUploadToast(error['error']);
        });
    }

    setThumbnail(track: Track) {
        this.thumbnailService.getTrackThumbnail(track.source).then((data) => {
            track.thumbnail = data['artwork_url'];
            track.thumbnail = track.thumbnail.replace('-large', '-t500x500');
            console.log('Artwork URL:' + data['artwork_url']);
        }).catch((error) => {
            console.log(error);
            this.inputTrack.thumbnail = "http://dalelyles.com/musicmp3s/no_cover.jpg";
        }).finally(() => {
            this.socketService.addtrack(track);
            this.failedUploadToast("Track successful added !");
        });
    }
    

    AddMp3Track(track: Track) {
        console.log("Upload successful.. Adding Track");
        this.socketService.addtrack(track);
        this.init();
        this.failedUploadToast("Track successful added !");
    }


    async failedUploadToast(message:string) {
        const toast = await this.toastCtrl.create({
            message: message,
            showCloseButton: true,
            closeButtonText: "OK",
            duration: 3000,
            position: "bottom"
        });
        toast.present();
    }

    convertYoutubeObject(object){
        this.tempVideos = [];
        let tempObject = {
            id: '',
            title: '',
            thumbnails: {
                default: '',
                high: '',
                medium: '',
            }
        };

        for (const i in object) {
            if (object.hasOwnProperty(i)) {
                let obj = object[i];

                if (typeof obj.id === 'string') {
                    tempObject.id = obj.id;
                } else {
                    tempObject.id = obj.id.videoId;
                }
                tempObject.title = obj.snippet.title;
                if (obj.snippet.thumbnails.default) {
                    tempObject.thumbnails.default = obj.snippet.thumbnails.default.url;
                }
                if (obj.snippet.thumbnails.maxres) {
                    tempObject.thumbnails.high = obj.snippet.thumbnails.maxres.url;
                } else if (obj.snippet.thumbnails.high) {
                    tempObject.thumbnails.high = obj.snippet.thumbnails.high.url;
                }
                if (obj.snippet.thumbnails.high) {
                    tempObject.thumbnails.medium = obj.snippet.thumbnails.high.url;
                } else if (obj.snippet.thumbnails.medium) {
                    tempObject.thumbnails.medium = obj.snippet.thumbnails.medium.url;
                }
                this.tempVideos.push(tempObject);

                tempObject = {
                    id: '',
                    title: '',
                    thumbnails: {
                        default: '',
                        high: '',
                        medium: '',
                    }
                };

            }
        }

    }

    async youtubeSearch(search){
        await this.youtubeService.getSearch(search).then((result)=>{
            if(search.length>0) {
                this.convertYoutubeObject(result['items']);
            }else{
                this.tempVideos =[];
            }
        });

    }

    addSearch(video){
        this.mode = 'url';
        // @ts-ignore
        document.getElementById('segmentButtonUrl').checked = true;
        this.inputTrack.source = 'https://www.youtube.com/watch?v='+video.id;
        this.inputTrack.title= video.title;
        this.inputTrack.thumbnail = video.thumbnails.default;
        this.tempVideos = [];
    }

    ionViewDidEnter() {
        console.log('visited Add Track Page');
        this.events.publish('tab:visited', 'Add Track');
    
    }
}
