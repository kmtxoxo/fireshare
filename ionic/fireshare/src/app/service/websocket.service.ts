import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '../models/message';

import * as socketIo from 'socket.io-client';
import {Track} from "../models/track";
import {User} from "../models/user";
import {Room} from "../models/room";
import {Events} from "@ionic/angular";

import {environment} from "../../environments/environment";


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
        if (this.room.host === this.user.name)
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


    constructor(public events: Events) {
        this.user = new User();
        this.room = new Room();
    }

    private socket;


    public initSocket(): void {
        this.socket = socketIo(environment.BACKEND_URL);
    }

    public disconnect() {
        this.socket.emit('leave');
    }

    public createRoom(username: string): void {
        this.socket.emit('createroom', username);
    }

    public joinRoom(roomnumber: number, username: string) {
        this.socket.emit('joinroom', username, roomnumber);
    }

    //Voting System

    public votetrack(trackSource: string) {
        this.socket.emit('vote', trackSource);
    }

    public unvotetrack(trackSource: string) {
        this.socket.emit('unvote', trackSource);
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

    public onTrackAddError(): Observable<any> {
        console.log('track could not be added');

        return new Observable<any>(observer => {
            this.socket.on('trackAddError', (error: any) => observer.next(error));
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

    public onHostChange(): Observable<any> {
        console.log('Host has changed');
        return new Observable<any>(observer => {
            this.socket.on('hostUpdated', (host: any) => observer.next(host));
        });
    }
}
