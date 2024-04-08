import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {WebsocketService} from "../service/websocket.service";
import {User} from "../models/user";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;
  room: number;

  constructor(private router: Router, private socketService: WebsocketService) {
  }

  ngOnInit() {
    this.initIoConnection();
    this.user = new User();
  }

  onCreateRoomClicked() {
    this.socketService.createRoom();
  }

  onJoinRoomClicked() {
    this.socketService.joinRoom(this.room);
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService.onRoomConnect().subscribe((room) => {
      console.log('received Status if Room creation/join was successful');
      if (room.hasOwnProperty('error')) {
        console.log('error during Join/creation');
      } else {
        this.socketService.setRoom(room.Roominfo);
        if (room.Roominfo.host === room.requester) {
          this.socketService.setUser(new User({name: room.requester, host: true}));
        }
        else {
          this.socketService.setUser(new User({name: room.requester, host: false}));
        }
        this.router.navigate(['/voting']);
      }
    });
  }

}
