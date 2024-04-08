import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '../models/message';

import * as socketIo from 'socket.io-client';
import {Track} from "../models/track";
import {User} from "../models/user";
import {Room} from "../models/room";

const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  user: User;
  room: Room;

  public getUser() {
    return this.user;
  }

  public getUserModeString() {
    if (this.user.host === true)
      return 'host';
    else {
      return 'simple';
    }
  }

  public getRoom() {
    return this.room;
  }

  public setUser(user) {
    return this.user = user;
  }

  public setRoom(room) {
    return this.room = room;
  }


  constructor() {
    this.user = new User();
    this.room = new Room();
  }

  private socket;


  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  public createRoom(): void {
    this.socket.emit('createroom', prompt("What's your name?"));
  }

  public joinRoom(roomnumber: number) {
    this.socket.emit('joinroom', prompt("What's your name?"), roomnumber);
  }

  //Voting System

  public votetrack(trackid: string) {
    this.socket.emit('vote', trackid);
  }

  public unvotetrack(trackid: string) {
    this.socket.emit('unvote', trackid);
  }

  public addtrack(track: Track) {
    this.socket.emit('addtrack', track);
  }

  public getTracklist() {
    this.socket.emit('getTracks');
  }

  public onTrackUpdate(): Observable<any> {
    console.log('updating track');

    return new Observable<any>(observer => {
      this.socket.on('updatetrackvote', (tracks: any) => observer.next(tracks));
    });

  }

  // chat
  public sendChatMessage(message) {
    this.socket.emit('sendchat', message);
  }

  public onChatUpdate(): Observable<any> {
    console.log('updating chat');

    return new Observable<any>(observer => {
      this.socket.on('updatechat', (message: Message) => observer.next(message));
    });

  }

  public getRoominfo() {
    this.socket.emit('getroominfo');
  }

  public getUsername() {
    this.socket.emit('getusername');
  }

  public getMostVotedTrack() {
    this.socket.emit('getMostVotedTrack');
  }

  public onGetRoomInfo(): Observable<any> {
    console.log('requesting room information');
    return new Observable<any>(observer => {
      this.socket.on('roominfoUpdate', (room: Room) => observer.next(room));
    });
  }

  public onGetUsername(): Observable<any> {
    console.log('requesting user information');
    return new Observable<any>(observer => {
      this.socket.on('usernameUpdate', (username: string) => observer.next(username));
    });
  }

  public onMostVotedTrack(): Observable<any> {
    console.log('requesting most Voted Track');
    return new Observable<any>(observer => {
      this.socket.on('mostVotedTrack', (track: any) => observer.next(track));
    });
  }

  public onRoomConnect(): Observable<any> {
    console.log('requesting Room Connect');
    return new Observable<any>(observer => {
      this.socket.on('updateroom', (room: any) => observer.next(room));
    });
  }

}
