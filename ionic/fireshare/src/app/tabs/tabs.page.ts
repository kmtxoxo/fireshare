import {Component, NgZone} from '@angular/core';
import {WebsocketService} from "../service/websocket.service";
import {ChatService} from "../service/chat.service";
import {Events} from "@ionic/angular";
import {Platform} from '@ionic/angular';
import {Router} from "@angular/router";
import {ShareIntentService} from "../service/share-intent.service";


@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    ioConnection: any;
    title: string = '';

    constructor(private socketService: WebsocketService,
                private chatService: ChatService,
                public events: Events,
                private platform: Platform,
                private router: Router,
                private zone: NgZone,
                private shareIntentService: ShareIntentService) {

        this.initIoConnection();
        this.chatService.userName = this.socketService.user.name;
        //this.ionViewDidLoad();
        //this.ionViewDidEnter();

        this.events.subscribe('tab:visited', (title) => {
            this.zone.run(() => {
                    this.title = title;
                }
            );
        });

    }

    private initIoConnection(): void {
        this.ioConnection = this.socketService.onHostChange().subscribe((host) => {
            console.log('host changed:' + host);
            if (this.socketService.user.name === host) {
                console.log('your are the new host');
                this.socketService.room.host = host;
                this.events.publish('host:updated', host);
            }
        });

    }

    ionViewDidEnter() {
        const self = this;
        this.platform.ready().then(() => {
            if ((<any>window).plugins) {
                (<any>window).plugins.intent.setNewIntentHandler(
                    function (Intent) {
                        console.log('new intent' + JSON.stringify(Intent));
                        if (Intent.hasOwnProperty('extras')) {
                            if (Intent['extras'].hasOwnProperty('android.intent.extra.TEXT')) {
                                console.log('Song Url:' + Intent['extras']["android.intent.extra.TEXT"]);
                                self.importSharedTrack(Intent['extras']["android.intent.extra.TEXT"]);
                            }
                        }
                    }
                );
            }
        });
    }

    importSharedTrack(songUrl: string) {
        this.zone.run(() => {
                this.router.navigate(['/tabs/addTrack']).then(() => {
                    // do whatever you need after navigation succeeds
                    this.shareIntentService.setSongUrl(songUrl);
                });
            }
        );
    }

    exitRoom() {
        this.chatService.clearMessages();
        this.router.navigate(['/home']);
    }
}
