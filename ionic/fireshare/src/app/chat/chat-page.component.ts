import {Component, OnInit} from '@angular/core';
import {Message} from "../models/message";
import {WebsocketService} from "../service/websocket.service";
import {Router} from "@angular/router";
import {ChatService} from "../service/chat.service";
import {Events} from "@ionic/angular";

@Component({
    selector: 'app-chat',
    templateUrl: 'chat-page.component.html',
    styleUrls: ['chat-page.component.scss']
})
export class ChatPage implements OnInit {

    messages: Message[] = [];
    room: any;
    messageContent: string;
    userName: string;

    constructor(private socketService: WebsocketService,private router: Router, private chatService: ChatService,public events: Events) {
        console.log('chat constructor');
        this.messages = this.chatService.messages;
        this.events.subscribe('chat:updated', (messages) => {
            this.messages = messages;
            console.log('messages updated');
        });
    }

    ngOnInit(): void {
        this.userName = this.chatService.userName;
        this.messageContent = '';
    }

    onSendClicked() {
        if (this.messageContent.length > 0){
            this.chatService.sendMessage(this.messageContent);
        }
    }

    ionViewDidEnter() {
        console.log('visited Chat Page');
        this.events.publish('tab:visited', 'Chat');
    }
}
