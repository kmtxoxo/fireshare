import {Injectable} from '@angular/core';
import {WebsocketService} from "./websocket.service";
import {Events} from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class ShareIntentService {

    constructor(public events: Events) {
    }

    songUrl: string = '';

    setSongUrl(songUrl: string) {
        this.songUrl = this.extractSongUrl(songUrl);
        this.events.publish('track:importReceived');
    }

    getSongUrl() {
        return this.songUrl;
    }

    extractSongUrl(songUrl: string) {

        let index = songUrl.indexOf('https://');
        if (index != -1) {
            songUrl = songUrl.substr(index);

            index = songUrl.indexOf(' ');
            if (index != -1) {
                songUrl = songUrl.substr(0, index);
            }
        } else {
            return '';
        }

        return songUrl;
    }

}
