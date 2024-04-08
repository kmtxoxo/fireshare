import {Injectable} from '@angular/core';
import {Message} from "../models/message";
import {WebsocketService} from "./websocket.service";
import {Events} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

    messages: Message[] = [];
    ioConnection: any;
    userName: string;

  constructor(private socketService: WebsocketService,public events: Events) {
      this.initIoConnection();
  }

  sendMessage(messageContent: string){
      this.socketService.sendChatMessage(messageContent);
  }

  clearMessages(){
      this.messages = [];
  }

  private initIoConnection(): void {
        this.ioConnection = this.socketService.onChatUpdate().subscribe((message) => {
            console.log('received chat message');
            this.messages.push(message);
            this.events.publish('chat:updated', this.messages);
        });
  }
}
