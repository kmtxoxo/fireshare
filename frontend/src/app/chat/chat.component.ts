import { Component, OnInit } from '@angular/core';
import {Message} from "../models/message";
import {Router} from "@angular/router";
import {WebsocketService} from "../service/websocket.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  room: any;

  messages: Message[] = [];
  messageContent: string;
  ioConnection: any;

  constructor(private socketService: WebsocketService,private router: Router) { }

  ngOnInit(): void {
    this.initIoConnection();
    this.initChatMessages();
    this.messageContent = '';
  }
  onVoteClicked() {
    this.router.navigate(['/voting']);
  }

  onSendClicked() {
    if(this.messageContent.length>0)
      this.socketService.sendChatMessage(this.messageContent);
  }

  initChatMessages(){
    console.log('initing chat');
   //alle chat nachrichten vom server abholen oder irgendwie speichern.
  }

  private initIoConnection(): void {

    this.ioConnection = this.socketService.onChatUpdate().subscribe((message)=>{
      console.log('received chat message');
      this.messages.push(message);
    });

  }



}
