import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {WebsocketService} from "../service/websocket.service";
import {Track} from "../models/track";

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit {

  ioConnection: any;
  inputTrack: Track;
  tracks: Track[] = [];
  roomnumber: number;
  username: string;
  mode: 'simple' | 'host' = 'simple';

  constructor(private router: Router, private socketService: WebsocketService) {
  }

  onChatClicked() {
    this.router.navigate(['/chat']);
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

  initTracklist() {
    this.socketService.getTracklist();
  }

  onVoteTrackClicked(trackid) {
    this.socketService.votetrack(trackid);
  }

  onUnvoteTrackClicked(trackid) {
    this.socketService.unvotetrack(trackid);
  }

  addTrackClicked() {
    if (this.inputTrack.title && this.inputTrack.artist) {
      this.socketService.addtrack(this.inputTrack);
    }
    else {
      console.log('fill in all Track information');
    }
  }

  addTrackInfo() {
    console.log('url added');
    let url = this.inputTrack.source;
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
    }
  }

  replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  private initIoConnection(): void {

    this.ioConnection = this.socketService.onTrackUpdate().subscribe((tracks) => {
      this.tracks = [];
      for (const track of tracks) {
        this.tracks.push(new Track(track));
      }
    });
  }

}
