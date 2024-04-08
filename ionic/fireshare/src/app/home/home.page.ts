import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {WebsocketService} from "../service/websocket.service";
import {User} from "../models/user";
import {Events, ToastController, AlertController} from "@ionic/angular";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    room: number;
    username: string = '';

    constructor(private router: Router, private socketService: WebsocketService, private toastCtrl: ToastController, public events: Events, private alertController: AlertController) {
        console.log('constructor');
        this.events.subscribe('room:leave', () => {
            console.log('reinitialize socket connection');
            this.initIoConnection();
        });

    }

    ngOnInit() {
        console.log('oninit');
        this.initIoConnection();
    }


    onCreateRoomClicked() {
        if (this.username.length >= 3) {
            if(this.username.length > 12){
                this.username = this.username.substr(0,12);
            }
            this.socketService.createRoom(this.username);
        }
        else {
            this.presentToast('Your Username is too short !');
        }
    }

    async openModal() {
        const alert = await this.alertController.create({
            header: 'Enter The Roomnumber',
            inputs: [
                {
                    name: 'input-roomnumber',
                    type: 'text',
                    placeholder: '3424'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        console.log('Confirm Ok'+JSON.stringify(data));
                        if(data['input-roomnumber'].match(/^\d+$/)) {
                            // your code here
                            this.room = data['input-roomnumber'];
                            this.onJoinRoomClicked();
                        }else{
                            this.presentToast('Roomnumber incorrect!');
                        }
                    }
                }
            ]
        });

        await alert.present();
    }

    async presentToast(msg) {
        const toast = await this.toastCtrl.create({
            message: msg,
            showCloseButton: true,
            closeButtonText: "OK",
            duration: 3000,
            position: "bottom"
        });
        toast.present();
    }

    onJoinRoomClicked() {
        if (this.username.length >= 3) {
            if(this.username.length > 12){
                this.username = this.username.substr(0,12);
            }
            this.socketService.joinRoom(this.room, this.username);
        }
        else {
            this.presentToast('Your Username is too short !');
        }
    }

    private initIoConnection(): void {
        this.socketService.initSocket();

        this.socketService.onRoomConnect().subscribe((room) => {
            console.log('received Status if Room creation/join was successful');
            if (room.hasOwnProperty('error')) {
                console.log('error during Join/creation');
                this.presentToast('Can\'t join/create Room');
            } else {
                this.socketService.setRoom(room.Roominfo);
                if (room.Roominfo.host === room.requester) {
                    this.socketService.setUser(new User({name: room.requester, host: true}));
                }
                else {
                    this.socketService.setUser(new User({name: room.requester, host: false}));
                }
                this.router.navigate(['/tabs']);
            }
        });
    }
}
